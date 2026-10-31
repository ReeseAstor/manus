"""Tests for the rendered check's bounded transport-only retry (QA retry spec, 10/31).
Run: python3 -m unittest scripts/rendered-check/test_retry.py -v   (needs openssl, node and /usr/bin/google-chrome)
Fake servers: a TLS server that drops the connection before the handshake (SSL EOF / reset), a plain HTTP server that
closes after reading the request (connection closed), and status-code servers (503, 500, 404)."""
import importlib.util, io, os, re, socket, ssl, subprocess, sys, tempfile, threading, unittest, contextlib
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPT = os.path.join(HERE, "rendered-check.py")

def load():
    sp = importlib.util.spec_from_file_location("rc_under_test", SCRIPT)
    m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
    m.slept = []; m._sleep = m.slept.append      # record backoff, don't wait
    return m

def run_get(m, url):
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        try: res = m.http_get(url); err = None
        except Exception as e: res = None; err = e
    return res, err, buf.getvalue()

# ---------- TLS server that drops the first N connections before the handshake ----------
class TlsDropServer:
    def __init__(self, drops, certdir):
        self.drops = drops; self.conns = 0
        self.ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        self.ctx.load_cert_chain(os.path.join(certdir, "cert.pem"), os.path.join(certdir, "key.pem"))
        self.sock = socket.socket(); self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("127.0.0.1", 0)); self.sock.listen(8); self.port = self.sock.getsockname()[1]
        self.alive = True; threading.Thread(target=self.loop, daemon=True).start()
    def loop(self):
        while self.alive:
            try: c, _ = self.sock.accept()
            except OSError: return
            self.conns += 1
            if self.conns <= self.drops:
                c.setsockopt(socket.SOL_SOCKET, socket.SO_LINGER, b"\x01\x00\x00\x00\x00\x00\x00\x00")
                c.close(); continue                                   # drop before the TLS handshake
            try:
                t = self.ctx.wrap_socket(c, server_side=True)
                t.recv(65536)
                body = b"<html><body><p>ok page</p></body></html>"
                t.sendall(b"HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: " + str(len(body)).encode() + b"\r\nConnection: close\r\n\r\n" + body)
                t.close()
            except Exception: c.close()
    def stop(self): self.alive = False; self.sock.close()

# ---------- plain HTTP server with per-path behaviour for the checker's raw reads ----------
class Site:
    """plan[path] = list of actions consumed by raw reads (UA has '(rendered-check)'): 'close', 503, 500, 404, ...
    When the list is empty the page is served normally. Browser requests are always served normally."""
    def __init__(self, pages, plan=None):
        self.pages = pages; self.plan = {k: list(v) for k, v in (plan or {}).items()}; self.raw_hits = {}
        site = self
        class H(BaseHTTPRequestHandler):
            def log_message(self, *a): pass
            def do_GET(self):
                path = self.path.split("?")[0]
                if "(rendered-check)" in self.headers.get("User-Agent", ""):
                    site.raw_hits[path] = site.raw_hits.get(path, 0) + 1
                    q = site.plan.get(path)
                    if q:
                        act = q.pop(0)
                        if act == "close": self.close_connection = True; return     # read the request, send nothing
                        self.send_response(act); self.send_header("Content-Length", "0"); self.end_headers(); return
                if path in site.pages:
                    b = site.pages[path].encode()
                    self.send_response(200); self.send_header("Content-Type", "text/html; charset=utf-8")
                    self.send_header("Content-Length", str(len(b))); self.end_headers(); self.wfile.write(b)
                else:
                    self.send_response(404); self.send_header("Content-Length", "0"); self.end_headers()
        self.httpd = ThreadingHTTPServer(("127.0.0.1", 0), H); self.port = self.httpd.server_address[1]
        threading.Thread(target=self.httpd.serve_forever, daemon=True).start()
    @property
    def base(self): return f"http://127.0.0.1:{self.port}"
    def stop(self): self.httpd.shutdown()

PAGE = ("<!doctype html><html><head><title>Test page {n}</title><meta name=\"description\" content=\"A plain test page.\"></head>"
        "<body><main><h1>Test page {n}</h1><p>This page holds ordinary reader copy about a Manhattan romance, with nothing to flag here.</p>{extra}</main></body></html>")

def site_pages(n, extra=None):
    return {f"/p{i}": PAGE.format(n=i, extra=(extra or {}).get(f"/p{i}", "")) for i in range(1, n + 1)}

class HttpGetUnit(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.certdir = tempfile.mkdtemp()
        subprocess.run(["openssl", "req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1", "-subj", "/CN=127.0.0.1",
                        "-addext", "subjectAltName=IP:127.0.0.1", "-keyout", os.path.join(cls.certdir, "key.pem"),
                        "-out", os.path.join(cls.certdir, "cert.pem")], check=True, capture_output=True)
        os.environ["SSL_CERT_FILE"] = os.path.join(cls.certdir, "cert.pem")   # trust the fake server for these tests

    def test_tls_drop_twice_then_success_passes(self):
        m = load(); s = TlsDropServer(2, self.certdir)
        try: res, err, out = run_get(m, f"https://127.0.0.1:{s.port}/x")
        finally: s.stop()
        self.assertIsNone(err); self.assertEqual(res[0], 200); self.assertIn("ok page", res[1])
        self.assertEqual(len(re.findall(r"^RETRY https://127\.0\.0\.1:\d+/x [12] ", out, re.M)), 2, out)
        self.assertEqual(m.slept, [1, 3]); self.assertEqual(m.transport, {"reads": 1, "reads_retried": 1, "retries": 2})

    def test_tls_drop_three_times_fails(self):
        m = load(); s = TlsDropServer(99, self.certdir)
        try: res, err, out = run_get(m, f"https://127.0.0.1:{s.port}/x")
        finally: s.stop()
        self.assertIsNotNone(err); self.assertTrue(m.is_transport_error(err), repr(err))
        self.assertEqual(s.conns, 3); self.assertEqual(m.slept, [1, 3])
        self.assertEqual(len(re.findall(r"^RETRY ", out, re.M)), 2)   # attempts 1 and 2 retried, attempt 3 is the failure

    def test_connection_closed_once_then_success(self):
        m = load(); site = Site(site_pages(1), {"/p1": ["close"]})
        try: res, err, out = run_get(m, site.base + "/p1")
        finally: site.stop()
        self.assertIsNone(err); self.assertEqual(res[0], 200)
        self.assertRegex(out, r"^RETRY http://127\.0\.0\.1:\d+/p1 1 RemoteDisconnected")
        self.assertEqual(m.slept, [1]); self.assertEqual(site.raw_hits["/p1"], 2)

    def test_503_503_then_200(self):
        m = load(); site = Site(site_pages(1), {"/p1": [503, 503]})
        try: res, err, out = run_get(m, site.base + "/p1")
        finally: site.stop()
        self.assertEqual(res[0], 200); self.assertEqual(m.transport["retries"], 2); self.assertIn(" 2 HTTPError: HTTP Error 503", out)

    def test_504_three_times_returns_504(self):
        m = load(); site = Site(site_pages(1), {"/p1": [504, 504, 504]})
        try: res, err, out = run_get(m, site.base + "/p1")
        finally: site.stop()
        self.assertEqual(res[0], 504); self.assertEqual(site.raw_hits["/p1"], 3); self.assertEqual(m.slept, [1, 3])

    def test_other_status_never_retried(self):
        for code in (500, 404, 403, 429):
            m = load(); site = Site(site_pages(1), {"/p1": [code, code]})
            try: res, err, out = run_get(m, site.base + "/p1")
            finally: site.stop()
            self.assertEqual(res[0], code); self.assertEqual(site.raw_hits["/p1"], 1, code)
            self.assertNotIn("RETRY", out); self.assertEqual(m.slept, [])

    def test_connection_refused_not_retried(self):
        m = load(); s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
        res, err, out = run_get(m, f"http://127.0.0.1:{port}/x")
        self.assertIsNotNone(err); self.assertNotIn("RETRY", out); self.assertEqual(m.slept, [])

    def test_content_is_read_once(self):
        m = load(); site = Site(site_pages(1, {"/p1": "<p>A dash \u2014 right here.</p>"}))
        try: res, err, out = run_get(m, site.base + "/p1")
        finally: site.stop()
        self.assertEqual(res[0], 200); self.assertIn("\u2014", res[1]); self.assertEqual(site.raw_hits["/p1"], 1); self.assertNotIn("RETRY", out)

class EndToEnd(unittest.TestCase):
    """The whole checker (Chromium, guards) against a local 12-page site: --no-sitemap, --min-pages 12."""
    def run_check(self, site):
        with tempfile.TemporaryDirectory() as d:
            routes = os.path.join(d, "routes.txt")
            with open(routes, "w") as f: f.write("\n".join(sorted(site.pages)) + "\n")
            env = dict(os.environ); env.pop("SSL_CERT_FILE", None)
            p = subprocess.run([sys.executable, SCRIPT, site.base, os.path.join(d, "out"), "--routes", routes, "--no-sitemap", "--min-pages", "12"],
                               capture_output=True, text=True, timeout=600, env=env)
        lines = p.stdout.strip().splitlines()
        return p.returncode, p.stdout, lines

    def assertTail(self, lines, verdict_re):
        self.assertRegex(lines[-2], r"^retries: \d+ "); self.assertRegex(lines[-1], verdict_re)

    def test_e2e_transient_drop_then_success_passes(self):
        site = Site(site_pages(12), {"/p5": ["close", "close"]})
        try: rc, out, lines = self.run_check(site)
        finally: site.stop()
        self.assertEqual(rc, 0, out); self.assertTail(lines, r"^VERDICT: PASS 0$")
        self.assertIn("retries: 2 (raw reads 12, needing a retry 1)", out)
        self.assertEqual(len(re.findall(r"^RETRY http://127\.0\.0\.1:\d+/p5 [12] ", out, re.M)), 2)

    def test_e2e_three_failures_fail(self):
        site = Site(site_pages(12), {"/p5": ["close", "close", "close"]})
        try: rc, out, lines = self.run_check(site)
        finally: site.stop()
        self.assertEqual(rc, 1); self.assertTail(lines, r"^VERDICT: FAIL [1-9]\d*$")
        self.assertRegex(out, r"FAIL /p5: raw read error \(fail closed\)"); self.assertEqual(site.raw_hits["/p5"], 3)

    def test_e2e_content_failure_never_retried(self):
        site = Site(site_pages(12, {"/p7": "<p>A visible dash \u2014 in reader copy.</p>"}))
        try: rc, out, lines = self.run_check(site)
        finally: site.stop()
        self.assertEqual(rc, 1); self.assertTail(lines, r"^VERDICT: FAIL [1-9]\d*$")
        self.assertRegex(out, r"FAIL /p7: \[(no-JS|SPA)\] DASH .\u2014. in visible text")
        self.assertNotIn("RETRY", out); self.assertIn("retries: 0 ", out); self.assertEqual(site.raw_hits["/p7"], 1)

    def test_e2e_transport_unstable_over_10_percent_fails(self):
        site = Site(site_pages(12), {"/p2": ["close"], "/p9": [503]})      # 2 of 12 raw reads retried = 16.7%
        try: rc, out, lines = self.run_check(site)
        finally: site.stop()
        self.assertEqual(rc, 1); self.assertTail(lines, r"^VERDICT: FAIL 1$")
        self.assertIn("FAIL (transport): transport unstable: 2 of 12 raw reads needed a retry (over 10%)", out)

if __name__ == "__main__":
    unittest.main()
