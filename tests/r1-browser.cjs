const { chromium } = require("playwright"),
  fs = require("node:fs"),
  assert = require("node:assert/strict");
const { core } = require("./helpers.cjs"),
  { bundleAssets, keys } = require("../tools/assets.cjs");
const html = fs.readFileSync("origin-lab-v0.3.html", "utf8"),
  manifest = bundleAssets(
    "assets",
    keys(require("../data/catalog.json")),
  ).manifest;
const withManifest = (m) =>
  html.replace(
    /const ASSET_MANIFEST\s*=\s*[^\n]+;/,
    "const ASSET_MANIFEST=" + JSON.stringify(m) + ";",
  );
const results = [],
  errors = [];
let browser;
const c = core(),
  state = c.le(20261018);
state.discovered = c.Y.map((x) => x.id);
state.finalResearchDone = true;
state.chapter.unlocked = true;
state.chapter.entered = true;
state.chapter.kitClaimed = true;
state.env.oxygen = 45;
for (const sp of c.I)
  for (const h of c.g[sp].habitats)
    state.pops[sp][h] = Math.min(10, c.g[sp].K[h]);
async function check(name, fn) {
  results.push({ name, status: "PASS", ...(await fn()) });
  console.log("PASS", name);
}
(async () => {
  fs.mkdirSync("qa/screenshots", { recursive: true });
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || chromium.executablePath(),
    args: ["--no-sandbox"],
  });
  async function open(body = html) {
    const ctx = await browser.newContext({
        offline: true,
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
        colorScheme: "light",
      }),
      requests = [],
      warnings = [];
    await ctx.route("https://origin.test/**", (r) =>
      r.fulfill({ contentType: "text/html", body }),
    );
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => requests.push(r.url()));
    page.on("console", (m) => {
      if (m.type() === "warning") warnings.push(m.text());
    });
    await page.goto("https://origin.test/?debug=1");
    await page.evaluate(() => __originLab.stop());
    return { ctx, page, requests, warnings };
  }
  // The routed path includes the debug query; no external servers participate.
  async function settled(page) {
    await page.evaluate(async () => {
      await Promise.all(
        [...document.images].map((i) => i.decode().catch(() => {})),
      );
    });
  }
  async function seed(page) {
    await page.evaluate((s) => {
      Object.assign(__originLab.state, s);
      __originLab.app.renderAll();
      __originLab.app.draw(true);
    }, state);
    await settled(page);
  }
  const env = await open(),
    { page } = env;
  await settled(page);
  await check(
    "R1B01 actual 20px HUD/tabs, accessible names, no duplicate glyph or body icon",
    async () => {
      assert.equal(await page.locator("body > img").count(), 0);
      assert.equal(
        await page.locator(".tabbar img.optional-asset:not([hidden])").count(),
        4,
      );
      assert.equal(
        await page.locator(".tabbar svg.ico:not(.asset-replaced)").count(),
        0,
      );
      assert.match(await page.locator("#hud-energy").innerText(), /^\d/);
      assert.match(
        await page.locator(".hud-stats dt").first().innerText(),
        /에너지/,
      );
      for (const id of ["world", "lab", "evo", "log"])
        assert(await page.locator("#tab-" + id).getAttribute("aria-controls"));
      for (const img of await page.locator(".tabbar img").all()) {
        assert.equal(await img.getAttribute("alt"), "");
        assert.equal(await img.getAttribute("aria-hidden"), "true");
      }
    },
  );
  await check(
    "R1B02 undiscovered selected codex never reveals identity; shared lock only",
    async () => {
      await page.evaluate(() => __originLab.app.setTab("log"));
      await page.locator('[data-codex="macroalgae"]').click();
      await settled(page);
      const locked = await page
        .locator('[data-codex="macroalgae"] img')
        .getAttribute("src");
      assert.equal(
        locked,
        manifest.assets["discovery.macroalgae"]["default.locked"].src,
      );
      for (const id of ["macroalgae", "sponge", "cnidarian", "replicator"])
        assert.equal(
          await page.locator(`[data-codex="${id}"] img`).getAttribute("src"),
          locked,
        );
      assert.match(
        await page.locator('[data-codex="macroalgae"]').innerText(),
        /\?\?\?/,
      );
      for (const id of ["water", "mineral", "hydrothermal"])
        assert.equal(await page.locator(`[data-codex="${id}"] img`).count(), 1);
      await page.screenshot({
        path: "qa/screenshots/r1-locked-390.png",
        fullPage: true,
      });
    },
  );
  await seed(page);
  await check(
    "R1B03 all selected SVG/PNG variants decode, transparent nonempty art",
    async () => {
      const variants = [
        ...new Set(
          Object.values(manifest.assets).flatMap((v) =>
            Object.values(v).map((a) => a.src),
          ),
        ),
      ];
      const decoded = await page.evaluate(async (sources) => {
        const out = [];
        for (const src of sources) {
          const img = new Image();
          img.src = src;
          await img.decode();
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 64;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, 64, 64);
          const bytes = ctx.getImageData(0, 0, 64, 64).data;
          let clear = 0,
            visible = 0;
          for (let i = 3; i < bytes.length; i += 4) {
            if (!bytes[i]) clear++;
            else visible++;
          }
          out.push({
            width: img.naturalWidth,
            height: img.naturalHeight,
            clear,
            visible,
          });
        }
        return out;
      }, variants);
      assert(decoded.every((x) => x.visible > 0 && x.clear > 0));
      assert(
        decoded.every(
          (x) => [18, 64].includes(x.width) && x.width === x.height,
        ),
      );
      return { uniqueDecodedSources: decoded.length };
    },
  );
  await check(
    "R1B04 nine species use actual 18px Canvas images and selected variants",
    async () => {
      await page.evaluate(() => {
        const ctx = __originLab.app.renderer.ctx,
          draw = ctx.drawImage.bind(ctx);
        window.__drawn = [];
        ctx.drawImage = (...args) => {
          if (__drawn.length < 3000)
            __drawn.push({ src: args[0].src, w: args[3], h: args[4] });
          return draw(...args);
        };
        __originLab.app.setTab("world");
        __originLab.app.draw(true);
      });
      await page.waitForFunction(
        () => new Set(__drawn.map((x) => x.src)).size >= 9,
      );
      const drawn = await page.evaluate(() => __drawn);
      assert(drawn.every((x) => x.w === 18 && x.h === 18));
      for (const sp of c.I) {
        await page.locator(`[data-select="${sp}"]`).click();
        const src = manifest.assets["species." + sp]["default.selected"].src;
        await page.waitForFunction(
          (src) => __drawn.some((x) => x.src === src),
          src,
        );
        assert.equal(
          await page
            .locator(`[data-select="${sp}"]`)
            .getAttribute("aria-expanded"),
          "true",
        );
      }
      return { speciesDrawn: 9, selectedVariants: 9, width: 18, height: 18 };
    },
  );
  await check(
    "R1B05 live themes, exact five viewports, focus and 20px HTML assets",
    async () => {
      const layout = [];
      for (const theme of ["light", "dark"]) {
        await page.emulateMedia({
          colorScheme: theme,
          reducedMotion: "reduce",
        });
        await settled(page);
        for (const [width, height] of [
          [320, 568],
          [360, 640],
          [390, 844],
          [1024, 768],
          [1280, 800],
        ]) {
          await page.setViewportSize({ width, height });
          for (const tab of ["world", "lab", "evo", "log"]) {
            await page.evaluate((tab) => {
              __originLab.app.setTab(tab);
              __originLab.app.renderAll();
              __originLab.app.renderer.resize();
              __originLab.app.draw(true);
            }, tab);
            await settled(page);
            const bad = await page.evaluate(() =>
              [
                ...document.querySelectorAll(
                  "button,canvas,.card,.hud,img.optional-asset",
                ),
              ]
                .filter((e) => {
                  const r = e.getBoundingClientRect();
                  return (
                    r.width &&
                    r.height &&
                    (r.left < -0.5 || r.right > innerWidth + 0.5)
                  );
                })
                .map((e) => ({
                  id: e.id,
                  tag: e.tagName,
                  text: e.textContent.slice(0, 20),
                })),
            );
            assert.deepEqual(bad, [], `${theme}/${width}/${tab}`);
            const sizes = await page.evaluate(() =>
              [...document.querySelectorAll("img.optional-asset")]
                .map((e) => e.getBoundingClientRect())
                .filter((r) => r.width && r.height)
                .every((r) => r.width === 20 && r.height === 20),
            );
            assert(sizes);
            if (
              ["world", "lab", "log"].includes(tab) &&
              [320, 390, 1280].includes(width)
            ) {
              await page.evaluate(() => {
                document.querySelector("#toast")?.classList.remove("show");
                window.scrollTo(0, 0);
              });
              await page.screenshot({
                path: `qa/screenshots/r1-${theme}-${width}-${tab}.png`,
                fullPage: true,
              });
            }
            layout.push({ theme, width, height, tab, overflow: 0 });
          }
        }
        const src = await page
          .locator('[data-item="nutrients"] img')
          .getAttribute("src");
        assert.equal(
          src,
          manifest.assets["discovery.nutrients"][theme + ".default"].src,
        );
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate(() => __originLab.app.setTab("lab"));
      await page.locator('[data-item="nutrients"]').focus();
      await page.evaluate(() => __originLab.app.renderAll());
      assert.equal(
        await page.evaluate(() => document.activeElement.dataset.item),
        "nutrients",
      );
      await page.keyboard.press("Enter");
      assert.equal(
        await page
          .locator('[data-item="nutrients"]')
          .getAttribute("aria-pressed"),
        "true",
      );
      return { layout };
    },
  );
  await check(
    "R1B06 theme/render/asset loading leaves v4 save and engine state unchanged",
    async () => {
      await page.evaluate(() => __originLab.app.save());
      const before = await page.evaluate(() => ({
        state: JSON.stringify(__originLab.state),
        save: localStorage.getItem("originLab.save.v4"),
      }));
      for (const colorScheme of ["light", "dark", "light", "dark"]) {
        await page.emulateMedia({ colorScheme });
        await page.evaluate(() => {
          __originLab.app.renderAll();
          __originLab.app.draw(true);
        });
        await settled(page);
      }
      assert.deepEqual(
        await page.evaluate(() => ({
          state: JSON.stringify(__originLab.state),
          save: localStorage.getItem("originLab.save.v4"),
        })),
        before,
      );
      assert.equal(JSON.parse(before.save).schemaVersion, 4);
      assert(env.requests.every((u) => u === "https://origin.test/?debug=1"));
      assert.deepEqual(errors, []);
      return { externalNetworkRequests: 0 };
    },
  );
  await check(
    "R1B07 empty and failed manifests retain playable fallback without warning loops",
    async () => {
      for (const kind of ["empty", "failure"]) {
        const m =
          kind === "empty"
            ? { version: 1, assets: {} }
            : structuredClone(manifest);
        if (kind === "failure")
          for (const key of [
            "ui.tab.world",
            "status.energy",
            "species.macroalgae",
          ])
            for (const variant of Object.values(m.assets[key]))
              variant.src = "data:image/png;base64,YnJva2Vu";
        const x = await open(withManifest(m));
        await seed(x.page);
        await x.page.evaluate(() => {
          const ctx = __originLab.app.renderer.ctx,
            ellipse = ctx.ellipse.bind(ctx);
          window.__ellipses = 0;
          ctx.ellipse = (...a) => {
            __ellipses++;
            return ellipse(...a);
          };
        });
        for (let i = 0; i < 8; i++) {
          await x.page.evaluate(() => {
            __originLab.app.renderAll();
            __originLab.app.draw(true);
          });
          await settled(x.page);
        }
        assert.equal(
          await x.page.locator("#tab-world svg.asset-replaced").count(),
          0,
        );
        assert.equal(await x.page.locator("#tab-world img").count(), 0);
        assert(await x.page.evaluate(() => __ellipses > 0));
        assert(x.warnings.length <= 1);
        await x.page.evaluate(() => __originLab.app.setTab("lab"));
        await x.page.locator('[data-item="water"]').click();
        await x.page.locator('[data-item="energy"]').click();
        await x.page.locator("#combine").click();
        assert.match(
          await x.page.locator("#mix-result").innerText(),
          /발견|이미/,
        );
        assert.equal(x.requests.length, 1);
        await x.ctx.close();
      }
    },
  );
  await check(
    "R1B08 measured warm rendering overhead and standalone size",
    async () => {
      async function measure(p) {
        return p.evaluate(() => {
          const app = __originLab.app;
          app.renderer.resize();
          const times = [];
          for (let i = 0; i < 150; i++) {
            const t = performance.now();
            app.renderer.draw(app.state, i * 33, app.selectedSpecies);
            times.push(performance.now() - t);
          }
          times.sort((a, b) => a - b);
          return {
            draws: times.length,
            meanMs: times.reduce((a, b) => a + b, 0) / times.length,
            p95Ms: times[Math.floor(times.length * 0.95)],
            maxMs: times.at(-1),
          };
        });
      }
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.evaluate(() => __originLab.app.setTab("world"));
      await settled(page);
      const active = await measure(page);
      const fallback = await open(withManifest({ version: 1, assets: {} }));
      await seed(fallback.page);
      await fallback.page.setViewportSize({ width: 1280, height: 800 });
      await fallback.page.evaluate(() => __originLab.app.setTab("world"));
      const empty = await measure(fallback.page);
      await fallback.ctx.close();
      assert(active.p95Ms < 100, "no severe render stall");
      assert(Buffer.byteLength(html) < 1024 * 1024);
      return {
        withArt: active,
        emptyManifest: empty,
        htmlBytes: Buffer.byteLength(html),
        v03BaselineHtmlBytes: 219841,
        physicalDevice: "UNKNOWN",
      };
    },
  );
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    "qa/r1-browser-results.json",
    JSON.stringify({ browser: browser.version(), results, errors }, null, 2),
  );
  await env.ctx.close();
  await browser.close();
})().catch(async (e) => {
  console.error(e);
  fs.writeFileSync(
    "qa/r1-browser-results.json",
    JSON.stringify({ results, errors, failure: e.stack }, null, 2),
  );
  await browser?.close();
  process.exitCode = 1;
});
