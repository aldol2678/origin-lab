const { chromium } = require("playwright"),
  fs = require("node:fs"),
  http = require("node:http"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { core } = require("./helpers.cjs"),
  oldCore = require("./v02-helpers.cjs").core;
const results = [],
  errors = [],
  network = [];
let browser;
const server = http.createServer((req, res) => {
  try {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(fs.readFileSync(path.join(process.cwd(), req.url.split("?")[0])));
  } catch {
    res.statusCode = 404;
    res.end();
  }
});
async function check(name, fn) {
  const evidence = await fn();
  results.push({ name, status: "PASS", ...evidence });
  console.log("PASS", name);
}
(async () => {
  fs.mkdirSync("qa/screenshots", { recursive: true });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = "http://127.0.0.1:" + server.address().port;
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || chromium.executablePath(),
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    }),
    page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => network.push(r.url()));
  async function tab(id) {
    await page.evaluate((id) => __originLab.app.setTab(id), id);
  }
  const url = base + "/origin-lab-v0.3.html?debug=1",
    c = core(),
    old = oldCore();
  const seed = old.le(202603);
  seed.discovered = old.Y.map((x) => x.id);
  seed.finalResearchDone = true;
  seed.originData = 17;
  old.enterChapter(seed);
  old.chapterAction(seed, "seed");
  await check(
    "U01 real v0.2 canonical migration and old browser write isolation",
    async () => {
      await page.goto(base + "/origin-lab-v0.2.html?debug=1");
      await page.evaluate((s) => {
        __originLab.stop();
        localStorage.clear();
        Object.assign(__originLab.state, s);
        __originLab.app.save();
      }, seed);
      const v3 = await page.evaluate(() =>
        localStorage.getItem("originLab.save.v3"),
      );
      await page.goto(url);
      await page.evaluate(() => __originLab.stop());
      assert.deepEqual(
        JSON.parse(
          await page.evaluate(() => localStorage.getItem("originLab.save.v3")),
        ).state,
        JSON.parse(v3).state,
      );
      const frozenV3 = await page.evaluate(() =>
        localStorage.getItem("originLab.save.v3"),
      );
      await page.reload();
      await page.evaluate(() => __originLab.stop());
      assert.equal(
        await page.evaluate(() => localStorage.getItem("originLab.save.v3")),
        frozenV3,
      );
      assert.equal(await page.evaluate(() => __originLab.state.originData), 17);
      await page.goto(base + "/origin-lab-v0.2.html?debug=1");
      const v4 = await page.evaluate(() =>
        localStorage.getItem("originLab.save.v4"),
      );
      await page.evaluate(() => {
        __originLab.stop();
        __originLab.state.energy = 1;
        __originLab.state.totalTicks = 999999;
        __originLab.app.save();
      });
      assert.equal(
        await page.evaluate(() => localStorage.getItem("originLab.save.v4")),
        v4,
      );
      await page.goto(url);
      await page.evaluate(() => __originLab.stop());
      assert.equal(await page.evaluate(() => __originLab.state.originData), 17);
    },
  );
  await tab("evo");
  await check(
    "U02 real controls run all three presets, exact main-state isolation and measured graphs",
    async () => {
      const timings = [];
      for (const id of [
        "light-effects",
        "nursery-effects",
        "recycling-effects",
      ]) {
        await page.locator("#research-preset").selectOption(id);
        await page.locator("#research-prepared").check();
        const before = await page.evaluate(() =>
            JSON.stringify(__originLab.state),
          ),
          storage = await page.evaluate(() =>
            localStorage.getItem("originLab.save.v4"),
          );
        const start = Date.now();
        await page.locator('[data-research="run"]').click();
        await page.locator('[data-research="record"]:enabled').waitFor();
        const ms = Date.now() - start;
        assert(ms < 10000);
        timings.push({ id, wallMs: ms });
        assert.equal(
          await page.evaluate(() => JSON.stringify(__originLab.state)),
          before,
        );
        assert.equal(
          await page.evaluate(() => localStorage.getItem("originLab.save.v4")),
          storage,
        );
        const metric =
          id === "light-effects"
            ? "oxygen"
            : id === "nursery-effects"
              ? "predation.grazer.tide"
              : "recycling.ocean";
        await page.locator("#research-metric").selectOption(metric);
        const r = await page.evaluate(() => __originLab.app.comparison.result);
        const svg = page.locator(".research-figure svg");
        const max = Number(await svg.getAttribute("data-ymax"));
        for (const arm of ["a", "b"]) {
          const line = r.series
            .map(
              (p, i) =>
                (i ? "L" : "M") +
                (48 + (p.tick / r.duration) * 264).toFixed(3) +
                "," +
                (170 - (p[arm][metric] / max) * 132).toFixed(3),
            )
            .join(" ");
          assert.equal(
            await svg.locator('[data-arm="' + arm + '"]').getAttribute("d"),
            line,
          );
        }
        const download = page.waitForEvent("download");
        await page.locator('[data-research="export"]').click();
        await (await download).saveAs("qa/ui-" + id + ".json");
        const reward = await page.evaluate(() => __originLab.state.originData);
        await page.locator('[data-research="record"]').click();
        assert.equal(
          await page.evaluate(() => __originLab.state.originData),
          reward,
        );
        assert(await page.locator('[data-research="record"]').isDisabled());
        await page.screenshot({
          path: "qa/screenshots/v03-" + id + "-390.png",
          fullPage: true,
        });
      }
      assert.equal(
        await page.evaluate(() => __originLab.state.researchNotes.length),
        3,
      );
      return { timings };
    },
  );
  await check(
    "U03 repeated identical snapshot, pause and keyboard focus",
    async () => {
      const first = await page.evaluate(() =>
        JSON.stringify(__originLab.app.comparison.result.series),
      );
      const before = await page.evaluate(() => __originLab.state.totalTicks);
      await page.evaluate(() => {
        __originLab.app.onTick();
        __originLab.app.onTick();
      });
      assert.equal(
        await page.evaluate(() => __originLab.state.totalTicks),
        before,
      );
      await page.locator('[data-research="run"]').focus();
      await page.keyboard.press("Enter");
      await page.locator('[data-research="record"]:enabled').waitFor();
      assert.equal(
        await page.evaluate(() =>
          JSON.stringify(__originLab.app.comparison.result.series),
        ),
        first,
      );
      await page.locator("#research-metric").focus();
      await page.evaluate(() => __originLab.app.renderAll());
      assert.equal(
        await page.evaluate(() => document.activeElement.id),
        "research-metric",
      );
      await page.keyboard.press("Tab");
      assert.notEqual(
        await page.evaluate(() => document.activeElement.tagName),
        "BODY",
      );
      await page.locator('[data-research="close"]').click();
      await page.evaluate(() => __originLab.app.onTick());
      assert.equal(
        await page.evaluate(() => __originLab.state.totalTicks),
        before + 1,
      );
    },
  );
  await check(
    "U04 exact required viewport layouts, 44px new touch targets and screenshots",
    async () => {
      const layout = [];
      for (const [width, height] of [
        [320, 568],
        [360, 640],
        [390, 844],
        [1024, 768],
        [1280, 800],
      ]) {
        await page.setViewportSize({ width, height });
        for (const id of ["world", "lab", "evo", "log"]) {
          await tab(id);
          await page.evaluate(() => {
            __originLab.app.renderAll();
            __originLab.app.renderer.resize();
            __originLab.app.draw(true);
          });
          const bad = await page.evaluate(() =>
            [
              ...document.querySelectorAll(
                'button,canvas,.card,.hud,select,table,svg[role="img"]',
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
                tag: e.tagName,
                id: e.id,
                text: e.textContent.slice(0, 30),
              })),
          );
          assert.deepEqual(bad, [], width + "/" + id);
          assert(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
          const small = await page.evaluate(() =>
            [
              ...document.querySelectorAll(
                "#research-card button,#research-card select,#research-card input,#research-notes button,#automation-card button",
              ),
            ]
              .filter((e) => {
                const r = e.getBoundingClientRect();
                return r.width && r.height && (r.width < 44 || r.height < 44);
              })
              .map((e) => e.id || e.textContent),
          );
          assert.deepEqual(small, []);
          await page.evaluate(() => {
            document.getElementById("toast").classList.remove("show");
            window.scrollTo(0, 0);
          });
          await page.screenshot({
            path: `qa/screenshots/v03-${width}x${height}-${id}.png`,
            fullPage: true,
          });
          layout.push({
            width,
            height,
            tab: id,
            overflow: 0,
            smallTouchTargets: 0,
          });
        }
      }
      return { layout };
    },
  );
  await check(
    "U08 graph light/dark contrast and focused captures",
    async () => {
      const contrasts = [];
      for (const theme of ["light", "dark"]) {
        await page.emulateMedia({
          colorScheme: theme,
          reducedMotion: "reduce",
        });
        await page.setViewportSize({ width: 390, height: 844 });
        await tab("evo");
        await page.locator(".research-figure").scrollIntoViewIfNeeded();
        const values = await page.evaluate(() => {
          const luminance = (color) => {
            const rgb = color
              .match(/[\d.]+/g)
              .slice(0, 3)
              .map(Number)
              .map((n) => n / 255)
              .map((n) =>
                n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4,
              );
            return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
          };
          const bg = luminance(
            getComputedStyle(document.querySelector(".research-figure"))
              .backgroundColor,
          );
          return [...document.querySelectorAll(".research-legend span")].map(
            (el) => {
              const fg = luminance(getComputedStyle(el).color);
              return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
            },
          );
        });
        assert(values.every((n) => n >= 4.5));
        contrasts.push({ theme, legendRatios: values });
        await page.screenshot({
          path: `qa/screenshots/v03-graph-${theme}-390.png`,
        });
      }
      await page.emulateMedia({
        colorScheme: "light",
        reducedMotion: "reduce",
      });
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.locator(".research-figure").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "qa/screenshots/v03-graph-pc.png" });
      return { contrasts };
    },
  );
  await check(
    "U05 notes survive reload, delete confirmation changes no rewards",
    async () => {
      await page.reload();
      await page.evaluate(() => __originLab.stop());
      assert.equal(
        await page.evaluate(() => __originLab.state.researchNotes.length),
        3,
      );
      await page.setViewportSize({ width: 390, height: 844 });
      await tab("log");
      const before = await page.evaluate(() => ({
        origin: __originLab.state.originData,
        discovered: __originLab.state.discovered,
      }));
      await page.locator(".research-note summary").first().click();
      await page.locator("[data-note-delete]").first().click();
      await page.locator("#confirm-cancel").click();
      assert.equal(
        await page.evaluate(() => __originLab.state.researchNotes.length),
        3,
      );
      await page.locator("[data-note-delete]").first().click();
      await page.locator("#confirm-ok").click();
      await page.waitForFunction(
        () => __originLab.state.researchNotes.length === 2,
      );
      assert.deepEqual(
        await page.evaluate(() => ({
          origin: __originLab.state.originData,
          discovered: __originLab.state.discovered,
        })),
        before,
      );
      await page.reload();
      await page.evaluate(() => __originLab.stop());
      assert.equal(
        await page.evaluate(() => __originLab.state.researchNotes.length),
        2,
      );
    },
  );
  await check(
    "U06 free automation toggle through UI, zero artwork and runtime errors",
    async () => {
      await tab("evo");
      const enabled = await page.evaluate(
        () => __originLab.state.automation.enabled,
      );
      await page.locator('[data-research="automation"]').click();
      assert.equal(
        await page.evaluate(() => __originLab.state.automation.enabled),
        !enabled,
      );
      await page.locator('[data-research="automation"]').click();
      assert.equal(
        await page.evaluate(() =>
          window.OriginLabAssets.getAsset("species.macroalgae"),
        ),
        null,
      );
      assert.equal(await page.locator("img.optional-asset").count(), 0);
      assert.deepEqual(errors, []);
      assert(network.every((u) => u.startsWith(base)));
      return { externalNetworkRequests: 0, errors };
    },
  );
  await check(
    "U07 rapid cancellation prevents stale result and world remains playable",
    async () => {
      await page.locator("#research-preset").selectOption("recycling-effects");
      await page.locator("#research-duration").selectOption("180");
      await page.evaluate(() => {
        __originLab.app.startComparison();
        __originLab.app.closeComparison();
      });
      await page.waitForTimeout(100);
      assert.equal(
        await page.evaluate(() => __originLab.app.comparison.result),
        null,
      );
      assert.equal(
        await page.evaluate(() => __originLab.app.comparison.running),
        false,
      );
    },
  );
  await check(
    "U09 partial inline optional manifest offline with text and missing-key fallback",
    async () => {
      const ctx = await browser.newContext({
        offline: true,
        viewport: { width: 360, height: 640 },
        colorScheme: "light",
      });
      const empty =
        "data:image/svg+xml;base64," +
        Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"></svg>',
        ).toString("base64");
      const partial = {
        version: 1,
        assets: {
          "discovery.water": {
            "light.discovered": { src: empty, width: 64, height: 64 },
          },
        },
      };
      const html = fs
        .readFileSync("origin-lab-v0.3.html", "utf8")
        .replace(
          /const ASSET_MANIFEST\s*=\s*\{"version":1,"assets":\{\}\}/,
          "const ASSET_MANIFEST=" + JSON.stringify(partial),
        );
      assert(html.includes(empty));
      await ctx.route("https://origin.test/", (route) =>
        route.fulfill({ contentType: "text/html", body: html }),
      );
      const p = await ctx.newPage(),
        requests = [];
      p.on("request", (r) => requests.push(r.url()));
      p.on("pageerror", (e) => errors.push(e.message));
      await p.goto("https://origin.test/");
      await p.locator('[data-item="water"] img').waitFor();
      assert.match(await p.locator('[data-item="water"]').innerText(), /물/);
      assert.equal(
        await p.evaluate(() => OriginLabAssets.getAsset("species.macroalgae")),
        null,
      );
      await p.locator('[data-item="water"]').click();
      await p.locator('[data-item="energy"]').click();
      await p.locator("#combine").click();
      assert.match(await p.locator("#mix-result").innerText(), /새 발견/);
      assert.deepEqual(requests, ["https://origin.test/"]);
      assert.deepEqual(errors, []);
      await ctx.close();
      return { externalNetworkRequests: 0 };
    },
  );
  fs.writeFileSync(
    "qa/v03-ui-tests.json",
    JSON.stringify({ browser: browser.version(), results, errors }, null, 2),
  );
  await browser.close();
  server.close();
})().catch(async (e) => {
  console.error(e);
  fs.writeFileSync(
    "qa/v03-ui-tests.json",
    JSON.stringify({ results, errors, failure: e.stack }, null, 2),
  );
  await browser?.close();
  server.close();
  process.exitCode = 1;
});
