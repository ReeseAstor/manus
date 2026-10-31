"""Rendered guard (QA v4 card, accepted design with conditions, 2026-10-30 10:06 PM).

Usage: python3 scripts/rendered-check/rendered-check.py <BASE_URL> <OUT_DIR> [--routes FILE ...] [--no-sitemap] [--min-pages N]
  --min-pages: fail closed if fewer pages are planned or rendered (default 55 on reeseastor.com, 44 elsewhere; QA R-a).
  BASE_URL  the preview (before the merge) or https://reeseastor.com (right after the deploy).
Covers every <loc> in BASE/sitemap.xml (rewritten onto BASE), routes-extra.txt, and the served text files
(/llms.txt, /robots.txt and every *.txt in client/public). For each page:
  1. raw HTTP body (the prerendered no-JS HTML): the 'free' guard over the whole document (meta, JSON-LD, aria,
     alt, title, body) and, on /books/<slug>, the books fallback guard with the slug (exact Kindle+ line once on KU
     titles, never on the two prequels);
  2. Chromium with JavaScript off, then 3. Chromium with JavaScript on (after hydration): in-page visibility per
     text node (zero-size or offscreen rects, clipping ancestors, opacity, transparent colour, font-size < 4px,
     display/visibility/content-visibility, closed dialog/details), ::before/::after content, then
     - the 'free' guard over the full rendered DOM (hidden text included: stricter) plus pseudo-element text;
     - the books guard (stray Kindle Unlimited/KU/Countdown/99 cent wording, Amazon tags) over the rendered DOM;
     - on /books/<slug>: the exact Kindle+ line visible at least once (exactly once without JS) and never present
       hidden on a KU title; never present at all on a non-KU title;
     - em dashes (and spaced en dashes) in visible text, <title> and the meta description, except inside a book
       excerpt quoted from the published text: only [data-book-excerpt], and only on the two pages in
       EXCERPT_ROUTES, exactly one block each (QA D2); the marker anywhere else is itself a FAIL.
  Text files are checked as plain text: each line an element ('free' guard, dashes).
Fails closed: Chromium not launching, a route not loading or timing out, an HTTP error, a guard error, or a page
with no text is a FAIL, never a skip. Third-party embed text (the MailerLite form) counts as visible text; its
hits are tagged [embed] so they can be routed to the asset owner, but they still FAIL.
The last line of output is exactly: VERDICT: PASS 0 | VERDICT: FAIL <fail count>.
"""
import json, os, re, subprocess, sys, time, urllib.request, urllib.error, glob

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
CHROME = os.environ.get("RENDERED_CHECK_CHROME", "/usr/bin/google-chrome")
NAV_TIMEOUT_MS = 45000
fails = []
def fail(route, msg):
    fails.append((route, msg)); print(f"FAIL {route}: {msg}", flush=True)

def http_get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (rendered-check)"})
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            return r.status, r.read().decode("utf-8", "replace"), r.geturl()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace"), url

class Guards:
    def __init__(self):
        self.p = subprocess.Popen(["node", os.path.join(HERE, "guards-server.mjs")], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True, bufsize=1)
    def ask(self, **q):
        self.p.stdin.write(json.dumps(q) + "\n"); self.p.stdin.flush()
        line = self.p.stdout.readline()
        if not line: raise RuntimeError("guard process exited")
        r = json.loads(line)
        if not r.get("ok"): raise RuntimeError(r.get("error"))
        return r["result"]

EXTRACT = r"""(LINE) => {
  // An element whose whole text is exactly the approved Kindle+ line (the SPA splits it across two spans
  // so it wraps nicely) is read as that line, in both serialised copies; nothing else is joined.
  const flatten = (root) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.children.length && el.textContent.replace(/\s+/g, " ").trim() === LINE) el.textContent = LINE;
    }
  };
  const W = document.documentElement.scrollWidth, H = document.documentElement.scrollHeight;
  const hiddenEl = new Map();
  const elHidden = (el) => {
    if (!el || el.nodeType !== 1) return false;
    if (hiddenEl.has(el)) return hiddenEl.get(el);
    let h = false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.visibility === "collapse" || cs.contentVisibility === "hidden") h = true;
    else if (parseFloat(cs.opacity) < 0.05) h = true;
    else if (el.tagName === "DIALOG" && !el.open) h = true;
    else if (el.closest("details:not([open])") && !el.closest("summary") && el.closest("details:not([open])") !== el) h = true;
    else if (el.parentElement) h = elHidden(el.parentElement);
    hiddenEl.set(el, h);
    return h;
  };
  // Clip a rect by every ancestor that clips its content (overflow other than visible, clip, clip-path).
  const clipped = (rect, el) => {
    let r = { l: rect.left + scrollX, t: rect.top + scrollY, rr: rect.right + scrollX, b: rect.bottom + scrollY };
    for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
      const cs = getComputedStyle(a);
      const clips = cs.overflowX !== "visible" || cs.overflowY !== "visible" || (cs.clip && cs.clip !== "auto") || (cs.clipPath && cs.clipPath !== "none");
      if (!clips) continue;
      const ar = a.getBoundingClientRect();
      if (cs.clipPath && cs.clipPath !== "none" && /inset\(\s*(?:50%|100%)|circle\(\s*0|polygon\(\s*0p?x?\s+0p?x?\s*\)|rect\(\s*0/.test(cs.clipPath)) return null;
      if (cs.clip && /rect\(\s*0(?:px)?,?\s*0(?:px)?,?\s*0(?:px)?,?\s*0/.test(cs.clip)) return null;
      const rx = cs.overflowX !== "visible", ry = cs.overflowY !== "visible";
      if (rx || cs.clip !== "auto") { r.l = Math.max(r.l, ar.left + scrollX); r.rr = Math.min(r.rr, ar.right + scrollX); }
      if (ry || cs.clip !== "auto") { r.t = Math.max(r.t, ar.top + scrollY); r.b = Math.min(r.b, ar.bottom + scrollY); }
    }
    return r;
  };
  const alpha = (c) => { const m = c.match(/rgba?\(([^)]*)\)/); if (!m) return c === "transparent" ? 0 : 1; const p = m[1].split(/[ ,\/]+/).filter(Boolean); return p.length > 3 ? parseFloat(p[3]) : 1; };
  const textVisible = (n) => {
    const el = n.parentElement;
    if (!el || elHidden(el)) return false;
    const cs = getComputedStyle(el);
    if (parseFloat(cs.fontSize) < 4) return false;
    if (alpha(cs.color) < 0.1 && (cs.webkitTextFillColor === "" || alpha(cs.webkitTextFillColor) < 0.1)) return false;
    let op = 1; for (let a = el; a; a = a.parentElement) op *= parseFloat(getComputedStyle(a).opacity);
    if (op < 0.05) return false;
    const range = document.createRange(); range.selectNodeContents(n);
    for (const rc of range.getClientRects()) {
      if (rc.width < 1 || rc.height < 3) continue;
      const c = clipped(rc, el);
      if (!c) continue;
      const w = c.rr - c.l, h = c.b - c.t;
      if (w < 1 || h < 3) continue;
      if (c.rr <= 0 || c.b <= 0 || c.l >= W || c.t >= H) continue;
      return true;
    }
    return false;
  };
  const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT);
  const hiddenIdx = []; const dashes = []; const embed = [];
  let i = 0, total = 0;
  for (let n; (n = walker.nextNode()); i++) {
    const t = n.textContent; if (!t.trim()) continue;
    const p = n.parentElement; if (p && /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(p.tagName)) continue;
    const vis = textVisible(n);
    if (!vis) { hiddenIdx.push(i); continue; }
    total += t.trim().length;
    const inEmbed = !!(p && p.closest(".ml-embedded,[class*='ml-form'],[id^='mlb2']"));
    if (inEmbed) embed.push(t.trim().slice(0, 200));
    if (/\u2014|\s\u2013\s/.test(t) && !(p && p.closest("[data-book-excerpt]"))) dashes.push((inEmbed ? "[embed] " : "") + t.trim().slice(0, 200));
  }
  const pseudo = [];
  for (const el of document.querySelectorAll("body *")) {
    if (elHidden(el)) continue;
    for (const ps of ["::before", "::after"]) {
      const c = getComputedStyle(el, ps).content;
      if (c && c !== "none" && c !== "normal" && /[A-Za-z0-9]/.test(c)) pseudo.push(c.replace(/^["']|["']$/g, ""));
    }
  }
  // Visible-only clone: drop hidden text nodes (same walk order).
  const clone = document.documentElement.cloneNode(true);
  const cw = document.createTreeWalker(clone.querySelector("body") || clone, NodeFilter.SHOW_TEXT);
  const drop = new Set(hiddenIdx); const rm = [];
  let j = 0; for (let n; (n = cw.nextNode()); j++) if (drop.has(j)) rm.push(n);
  rm.forEach((n) => (n.textContent = " "));
  flatten(clone);
  const fullClone = document.documentElement.cloneNode(true);
  flatten(fullClone);
  const md = document.querySelector('meta[name="description"]');
  return { full: "<!doctype html>" + fullClone.outerHTML, visible: "<!doctype html>" + clone.outerHTML, textLen: total,
           pseudo, dashes, embed, excerptMarks: document.querySelectorAll("[data-book-excerpt]").length, title: document.title, metaDescription: md ? md.content : "", innerText: (document.body ? document.body.innerText : "").slice(0, 400) };
}"""

# QA D2: the dash exemption marker may sit only on these two quoted excerpts, one block each.
EXCERPT_ROUTES = {"/read/poison-pill", "/read/the-billionaires-one-night-stand"}

def books_slug(route):
    m = re.search(r"/books/([a-z0-9-]+)(?:\.html|/)?$", route.split("?")[0])
    return m.group(1) if m else None

def main():
    args = sys.argv[1:]
    if len(args) < 2: print("usage: rendered-check.py BASE OUT [--routes FILE] [--no-sitemap]"); print("VERDICT: FAIL 1"); return 1
    base, out = args[0].rstrip("/"), args[1]
    extra_files = [args[k + 1] for k, a in enumerate(args) if a == "--routes"] or [os.path.join(HERE, "routes-extra.txt")]
    use_sitemap = "--no-sitemap" not in args
    mp = [args[k + 1] for k, a in enumerate(args) if a == "--min-pages"]
    floor = int(mp[0]) if mp else (55 if re.match(r"^https?://(www\.)?reeseastor\.com$", base) else 44)
    os.makedirs(out, exist_ok=True)
    started = time.strftime("%Y-%m-%d %H:%M:%S %Z")
    print(f"rendered-check {base} started {started}")
    routes = []
    if use_sitemap:
        st, body, _ = http_get(base + "/sitemap.xml")
        locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body) if st == 200 else []
        if not locs: fail("/sitemap.xml", f"HTTP {st}, {len(locs)} <loc> entries (fail closed)")
        for u in locs:
            p = re.sub(r"^https?://[^/]+", "", u) or "/"
            routes.append(p)
        print(f"sitemap: {len(locs)} routes")
    for f in extra_files:
        for l in open(f):
            l = l.strip()
            if l and not l.startswith("#") and l not in routes: routes.append(l)
    txt = ["/llms.txt", "/robots.txt"] + ["/" + os.path.relpath(p, os.path.join(REPO, "client", "public")) for p in glob.glob(os.path.join(REPO, "client", "public", "**", "*.txt"), recursive=True)]
    txt = sorted(set(t for t in txt if not t.startswith("/read/")) | {"/llms.txt", "/robots.txt"}) if use_sitemap else [t for t in routes if t.endswith(".txt")]
    routes = [r for r in routes if not r.endswith(".txt")]
    print(f"routes: {len(routes)} pages, {len(txt)} text files (page floor {floor})")
    if len(routes) < floor: fail("(routes)", f"only {len(routes)} pages planned, floor is {floor} (fail closed)")
    rendered_ok = 0
    try:
        g = Guards(); meta = g.ask(op="meta")
    except Exception as e:
        fail("(guards)", f"guard process failed: {e}"); print(f"VERDICT: FAIL {len(fails)}"); return 1
    LINE, KU, NONKU = meta["line"], set(meta["ku"]), set(meta["nonku"])
    from playwright.sync_api import sync_playwright
    report = {}
    try:
        pw = sync_playwright().start()
        browser = pw.chromium.launch(executable_path=CHROME, args=["--no-sandbox", "--disable-dev-shm-usage"])
        print(f"chromium {browser.version}")
    except Exception as e:
        fail("(chromium)", f"Chromium did not launch: {e}"); print(f"VERDICT: FAIL {len(fails)}"); return 1
    ctx_js = browser.new_context(viewport={"width": 1366, "height": 900})
    ctx_nojs = browser.new_context(viewport={"width": 1366, "height": 900}, java_script_enabled=False)
    for route in routes:
        rep = report.setdefault(route, {})
        slug = books_slug(route)
        before = len(fails)
        # 1) raw prerendered HTML
        try:
            st, raw, final = http_get(base + route)
            rep["http"] = st; rep["final_url"] = final
            if st >= 400 and route != "/this-page-does-not-exist": fail(route, f"HTTP {st}")
            for h in g.ask(op="free", src=raw, kind="html"): fail(route, f"[raw HTML] free: {h['near']} :: {h['sentence']}")
            if slug:
                for pr in g.ask(op="ku", html=raw, slug=slug): fail(route, f"[raw HTML] books guard: {pr}")
        except Exception as e:
            fail(route, f"raw read error (fail closed): {e}")
        # 2) and 3) rendered without and with JavaScript
        for label, ctx in (("no-JS", ctx_nojs), ("SPA", ctx_js)):
            pg = ctx.new_page()
            try:
                pg.goto(base + route, wait_until="networkidle" if label == "SPA" else "load", timeout=NAV_TIMEOUT_MS)
                if label == "SPA": pg.wait_for_timeout(2500)
                x = pg.evaluate(EXTRACT, LINE)
            except Exception as e:
                fail(route, f"[{label}] render failed or timed out (fail closed): {str(e)[:200]}"); pg.close(); continue
            pg.close()
            if label == "SPA" and x["textLen"] >= 40: rendered_ok += 1
            rep[label] = {"textLen": x["textLen"], "title": x["title"], "dashes": x["dashes"], "embed": x["embed"][:20], "pseudo": x["pseudo"][:20]}
            if x["textLen"] < 40: fail(route, f"[{label}] page has no visible text ({x['textLen']} chars; fail closed)"); continue
            try:
                for h in g.ask(op="free", src=x["full"], kind="html"): fail(route, f"[{label}] free: {h['near']} :: {h['sentence']}")
                if x["pseudo"]:
                    for h in g.ask(op="free", src="".join(f"<p>{p}</p>" for p in x["pseudo"]), kind="html"): fail(route, f"[{label}] free (::before/::after): {h['sentence']}")
                for d in x["dashes"]: fail(route, f"[{label}] dash in visible text :: {d}")
                want = 1 if route.rstrip("/").removesuffix("/index.html") in EXCERPT_ROUTES else 0
                if x["excerptMarks"] != want: fail(route, f"[{label}] [data-book-excerpt] blocks: {x['excerptMarks']} (allowed here: {want}; QA D2)")
                for d in (x["title"], x["metaDescription"]):
                    if re.search("\u2014|\\s\u2013\\s", d or ""): fail(route, f"[{label}] dash in title/meta description :: {d[:160]}")
                if slug:
                    for pr in g.ask(op="ku", html=x["full"], slug=None): fail(route, f"[{label}] books guard: {pr}")
                    vis = g.ask(op="visible", html=x["visible"]).count(LINE)
                    full = g.ask(op="visible", html=re.sub(r"(?is)<(head|script|style|noscript|template)\b.*?</\1>", " ", x["full"])).count(LINE)
                    allc = re.sub(r"<[^>]+>", "", re.sub(r"(?is)<(head|script|style|noscript|template)\b.*?</\1>", " ", x["full"])).replace("&nbsp;", " ")
                    allc = re.sub(r"\s+", " ", allc).count(LINE)
                    rep[label]["ku_line_visible"], rep[label]["ku_line_in_dom"] = vis, allc
                    if slug in KU:
                        if vis < 1 or (label == "no-JS" and vis != 1): fail(route, f"[{label}] KU title: exact Kindle+ line visible {vis} times (needs {'exactly 1' if label == 'no-JS' else 'at least 1'})")
                        if allc > vis: fail(route, f"[{label}] KU title: {allc - vis} hidden copy/copies of the exact Kindle+ line")
                    elif slug in NONKU:
                        if allc: fail(route, f"[{label}] non-KU title shows the exact Kindle+ line ({allc})")
                    else:
                        fail(route, f"[{label}] /books slug {slug} is in neither KU list (fail closed)")
            except Exception as e:
                fail(route, f"[{label}] guard error (fail closed): {e}")
        print(("PASS" if len(fails) == before else "FAIL") + f" {route} (http {rep.get('http')}, text {rep.get('SPA', {}).get('textLen')})", flush=True)
    for t in txt:
        try:
            st, body, _ = http_get(base + t)
            if st != 200:
                if t in ("/llms.txt", "/robots.txt"): fail(t, f"HTTP {st}")
                else: print(f"note {t}: HTTP {st} (not served)")
                continue
            if not body.strip(): fail(t, "empty (fail closed)"); continue
            for h in g.ask(op="free", src=body, kind="markdown"): fail(t, f"[text] free: {h['near']} :: {h['sentence']}")
            for k, l in enumerate(body.split("\n")):
                if re.search("\u2014|\\s\u2013\\s", l): fail(t, f"[text] dash on line {k + 1} :: {l.strip()[:160]}")
            print(f"checked {t} ({len(body)} bytes)")
        except Exception as e:
            fail(t, f"read error (fail closed): {e}")
    try: browser.close(); pw.stop()
    except Exception: pass
    if rendered_ok < floor: fail("(routes)", f"only {rendered_ok} pages rendered with text, floor is {floor} (fail closed)")
    json.dump({"base": base, "started": started, "routes": routes, "text_files": txt, "fails": fails, "pages": report}, open(os.path.join(out, "rendered-check.json"), "w"), indent=1, ensure_ascii=False)
    print(f"pages planned {len(routes)}, rendered with text {rendered_ok}, floor {floor}")
    print(f"summary: {len(routes)} pages x (raw, no-JS, SPA) + {len(txt)} text files, {len(fails)} failures")
    print(f"VERDICT: {'PASS' if not fails else 'FAIL'} {len(fails)}")
    return 0 if not fails else 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(f"FAIL (rendered-check crashed, fail closed): {e}")
        print(f"VERDICT: FAIL {len(fails) + 1}")
        sys.exit(1)
