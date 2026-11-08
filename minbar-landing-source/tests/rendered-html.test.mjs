import assert from "node:assert/strict";
import test from "node:test";

test("renders the production home page and metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>Minbar — Архив хутб<\/title>/i);
  assert.match(html, /Аудиоархив пятничных хутб/i);
  assert.match(html, /https:\/\/t\.me\/supporminbar/i);
  assert.match(html, /https:\/\/t\.me\/hwee1rr/i);
  assert.doesNotMatch(html, />[^<]*@(?:supporminbar|hwee1rr)[^<]*</i);
  assert.match(
    html,
    /<meta(?=[^>]*\bproperty=["']og:image["'])(?=[^>]*\bcontent=["']https:\/\/minbararhive\.ru\/og\.png["'])[^>]*>/i,
  );
  assert.doesNotMatch(html, /chatgpt\.site|без темы|хутба на тему/i);
});

test("renders Telegram deep link and transcript state on a khutbah page", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("detail-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/khutba/2", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /https:\/\/t\.me\/minbar_archive_bot\?start=khutba_2/i);
  assert.match(html, /Расшифровка аудиозаписи/i);
  assert.doesNotMatch(html, /chatgpt\.site|без темы|хутба на тему/i);
});
