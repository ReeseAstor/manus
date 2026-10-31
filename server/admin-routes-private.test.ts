import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(path.join(__dirname, "..", p), "utf8");

describe("admin routes stay out of the public bundle", () => {
  it("App.tsx only mounts the admin route table behind AdminRoute", () => {
    const app = read("client/src/App.tsx");
    const adminPaths = [...app.matchAll(/path=\{?"(\/admin[^"]*)"/g)].map((m) => m[1]);
    expect(adminPaths).toEqual(["/admin", "/admin/*"]);
    expect(app).toContain('lazy(() => import("./pages/AdminRoutes"))');
    expect(app).not.toMatch(/import\("\.\/pages\/Admin(?!Routes)[A-Za-z]*"\)/);
    expect(app).not.toMatch(/ai-studio|ai-usage/);
  });

  it("admin studio and usage pages use neutral paths; old paths redirect", () => {
    const routes = read("client/src/pages/AdminRoutes.tsx");
    expect(routes).toContain('path={"/admin/studio"}');
    expect(routes).toContain('path={"/admin/usage"}');
    expect(routes).toContain('<Redirect to="/admin/studio" replace />');
    expect(routes).toContain('<Redirect to="/admin/usage" replace />');
    for (const f of ["client/src/pages/AdminDashboard.tsx", "client/src/pages/AdminCommandCenter.tsx"]) {
      expect(read(f), f).not.toMatch(/\/admin\/ai-/);
    }
  });

  it("the route table is an admin chunk that the seal step must find", () => {
    expect(read("scripts/seal-admin-chunks.mjs")).toContain('"AdminRoutes-"');
  });
});
