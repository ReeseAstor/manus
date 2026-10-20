import { afterEach, describe, expect, it } from "vitest";
import type { Server } from "node:http";
import { createApp } from "./_core/app";

describe("cron routes", () => {
  const servers: Server[] = [];

  afterEach(async () => {
    await Promise.all(
      servers.splice(0).map(
        (server) =>
          new Promise<void>((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve()));
          }),
      ),
    );
  });

  async function post(path: string, authorization?: string) {
    const app = createApp();
    const server = await new Promise<Server>((resolve) => {
      const listening = app.listen(0, () => resolve(listening));
    });
    servers.push(server);
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("no port");
    return fetch(`http://127.0.0.1:${address.port}${path}`, {
      method: "POST",
      headers: authorization ? { authorization } : {},
    });
  }

  it("rejects cron calls when CRON_SECRET is unset, including the old JWT bearer", async () => {
    const previousCron = process.env.CRON_SECRET;
    const previousJwt = process.env.JWT_SECRET;
    delete process.env.CRON_SECRET;
    process.env.JWT_SECRET = "session-signing-secret";
    try {
      for (const path of ["/api/cron/daily-briefing", "/api/cron/publish-scheduled"]) {
        expect((await post(path, "Bearer session-signing-secret")).status).toBe(401);
        expect((await post(path, "Bearer undefined")).status).toBe(401);
        expect((await post(path)).status).toBe(401);
      }
    } finally {
      if (previousCron === undefined) delete process.env.CRON_SECRET;
      else process.env.CRON_SECRET = previousCron;
      if (previousJwt === undefined) delete process.env.JWT_SECRET;
      else process.env.JWT_SECRET = previousJwt;
    }
  });
});
