const { chromium } = require("playwright");
const fs = require("node:fs"),
  http = require("node:http"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { core } = require("./helpers.cjs");
const results = [],
  errors = [];
const server = http.createServer((req, res) => {
  try {
    let file = path.join(
      process.cwd(),
      decodeURIComponent(req.url.split("?")[0]),
    );
    res.setHeader(
      "Content-Type",
      file.endsWith(".html") ? "text/html; charset=utf-8" : "text/plain",
    );
    res.end(fs.readFileSync(file));
  } catch {
    res.statusCode = 404;
    res.end("missing");
  }
});
(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || chromium.executablePath(),
    args: ["--no-sandbox"],
  });
  const browserVersion = browser.version();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  const url = base + "/origin-lab-v0.2.html?debug=1";
  async function check(name, fn) {
    const info = await fn();
    results.push({ name, status: "PASS", ...info });
    console.log(info?.status || "PASS", name);
  }
  async function tab(id) {
    if (await page.locator("#tab-" + id).isVisible())
      await page.locator("#tab-" + id).click();
    else await page.evaluate((id) => __originLab.app.setTab(id), id);
  }
  async function seed(state, v = 2) {
    await page.goto(url);
    await page.evaluate(
      ({ state, v }) => {
        __originLab.stop();
        localStorage.clear();
        localStorage.setItem(
          "originLab.save.v2",
          JSON.stringify({ schemaVersion: v, state }),
        );
      },
      { state, v },
    );
    await page.reload();
    await page.evaluate(() => __originLab.stop());
  }
  const c = core();
  const finished = c.le();
  finished.discovered = c.Y.slice(0, 30).map((x) => x.id);
  finished.finalResearchDone = true;
  finished.originData = 11;
  finished.perms = { click: 1 };
  finished.pops.photo_microbe.ocean = 50;
  finished.env.oxygen = 55;
  await check(
    "B01 supplied v0.1.1 browser baseline opens and combines",
    async () => {
      await page.goto(base + "/baseline/origin-lab-v0.1.1.html?debug=1");
      await page.evaluate(() => {
        __originLab.stop();
        localStorage.clear();
      });
      await page.locator("#tab-lab").click();
      await page.locator('[data-item="water"]').click();
      await page.locator('[data-item="energy"]').click();
      await page.locator("#combine").click();
      assert.match(await page.locator("#mix-result").innerText(), /새 발견/);
    },
  );
  await check(
    "B02 v2 migration and supplied old HTML re-execution isolates canonical",
    async () => {
      await seed(finished);
      await page.goto(base + "/baseline/origin-lab-v0.1.1.html?debug=1");
      const before = await page.evaluate(() =>
        localStorage.getItem("originLab.save.v3"),
      );
      await page.evaluate(() => {
        __originLab.stop();
        __originLab.state.finalResearchDone = false;
        __originLab.state.totalTicks = 999999;
        __originLab.app.save();
      });
      assert.equal(
        await page.evaluate(() => localStorage.getItem("originLab.save.v3")),
        before,
      );
      await page.goto(url);
      await page.evaluate(() => __originLab.stop());
      assert.equal(
        await page.evaluate(() => __originLab.state.finalResearchDone),
        true,
      );
    },
  );
  let start;
  await check(
    "B03 chapter first five minutes through UI; 10 recipes + 2 live observations",
    async () => {
      start = Date.now();
      await tab("evo");
      await page.locator('[data-chapter="enter"]').click();
      for (const r of c.Se.slice(24, 33)) {
        await tab("lab");
        await page.locator(`[data-item="${r.a}"]`).click();
        await page.locator(`[data-item="${r.b}"]`).click();
        await page.locator("#combine").click();
        assert.match(await page.locator("#mix-result").innerText(), /새 발견/);
      }
      await tab("evo");
      await page.locator('[data-chapter="seed"]').click();
      // Real wall-clock reactions in the browser; no time jump for chapter observations.
      await page.evaluate(() => __originLab.app.loop.start());
      await page.locator('[data-chapter="observe"]:enabled').waitFor();
      await page.locator('[data-chapter="observe"]').click();
      await page.locator('[data-chapter="shade"]').click();
      await page.locator('[data-chapter="observe"]:enabled').waitFor();
      await page.locator('[data-chapter="observe"]').click();
      await page.evaluate(() => __originLab.stop());
      await tab("lab");
      await page.locator('[data-item="light_comparison"]').click();
      await page.locator('[data-item="living_web"]').click();
      await page.locator("#combine").click();
      const state = await page.evaluate(() =>
        JSON.parse(JSON.stringify(__originLab.state)),
      );
      assert.equal(state.chapter.completed, true);
      assert.equal(state.discovered.length, 42);
      assert.equal(state.originData, 15);
      const seconds = (Date.now() - start) / 1000;
      assert(seconds < 300);
      fs.writeFileSync(
        "qa/browser-discovery-timeline.json",
        JSON.stringify(
          {
            wallSeconds: seconds,
            method:
              "automated UI with known recipes, real clock 5s + 5s observations; human discoverability UNKNOWN",
            state,
          },
          null,
          2,
        ),
      );
    },
  );
  await check(
    "B04 320/360/390/1280 layouts, all four panels and screenshots",
    async () => {
      const layout = [];
      for (const width of [320, 360, 390, 1280]) {
        await page.setViewportSize({
          width,
          height: width === 1280 ? 900 : 844,
        });
        for (const id of ["world", "lab", "evo", "log"]) {
          await tab(id);
          await page.evaluate(() => {
            __originLab.app.renderAll();
            __originLab.app.renderer.resize();
            __originLab.app.draw(true);
          });
          const bad = await page.evaluate(() =>
            [...document.querySelectorAll("button,canvas,.card,.hud")]
              .filter((e) => {
                const r = e.getBoundingClientRect();
                return (
                  r.width &&
                  r.height &&
                  getComputedStyle(e).visibility !== "hidden" &&
                  (r.left < -0.5 || r.right > innerWidth + 0.5)
                );
              })
              .map((e) => ({
                tag: e.tagName,
                id: e.id,
                text: e.textContent.slice(0, 40),
                rect: e.getBoundingClientRect().toJSON(),
              })),
          );
          assert.deepEqual(bad, [], `${width}/${id} overflow`);
          layout.push({ width, tab: id, overflow: bad.length });
          await page.evaluate(() => {
            document.getElementById("toast").classList.remove("show");
            window.scrollTo(0, 0);
          });
          await page.screenshot({
            path: `qa/screenshots/${width}-${id}.png`,
            fullPage: true,
          });
          if (id === "evo")
            await page.screenshot({
              path: `qa/screenshots/${width}-chapter.png`,
            });
        }
      }
      fs.writeFileSync("qa/layout.json", JSON.stringify(layout, null, 2));
    },
  );
  await check(
    "B05 JSON export + import cancel / confirm / backup restore",
    async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await tab("log");
      const download = page.waitForEvent("download");
      await page.locator('[data-act="export"]').click();
      const d = await download;
      await d.saveAs("qa/export-evidence.json");
      const exported = JSON.parse(fs.readFileSync("qa/export-evidence.json"));
      assert.equal(exported.schemaVersion, 3);
      assert.equal(exported.state.chapter.completed, true);
      const imported = structuredClone(exported);
      imported.state.energy = 12345;
      await page.evaluate(
        (raw) => __originLab.app.importSaveText(raw),
        JSON.stringify(imported),
      );
      await page.locator("#confirm-cancel").click();
      assert.notEqual(
        await page.evaluate(() => __originLab.state.energy),
        12345,
      );
      await page.evaluate(
        (raw) => __originLab.app.importSaveText(raw),
        JSON.stringify(imported),
      );
      await page.locator("#confirm-ok").click();
      await page.waitForFunction(() => __originLab.state.energy === 12345);
      assert.equal(await page.evaluate(() => __originLab.state.energy), 12345);
      await page.locator('[data-storage="recover"]').click();
      assert((await page.locator("[data-restore]").count()) > 0);
      await page.screenshot({
        path: "qa/screenshots/recovery-390.png",
        fullPage: true,
      });
      const candidate = await page.evaluate(() => {
        const a = __originLab.app.recoveryEntries;
        const i = a.findIndex(
          (x) => x.state?.chapter.completed && x.state.energy !== 12345,
        );
        return { index: i, energy: a[i]?.state.energy };
      });
      assert(candidate.index >= 0);
      await page.locator(`[data-restore="${candidate.index}"]`).click();
      await page.waitForFunction(
        () =>
          document.querySelector("#confirm[open] #confirm-title")
            ?.textContent === "이 저장을 불러올까요?",
      );
      await page.locator("#confirm-ok").click();
      await page.waitForFunction(
        (energy) => __originLab.state.energy === energy,
        candidate.energy,
      );
    },
  );
  await check(
    "B06 real two-tab conflict blocks writes and preserves both branches",
    async () => {
      const other = await context.newPage();
      other.on("pageerror", (e) => errors.push(e.message));
      await other.goto(url);
      await other.evaluate(() => __originLab.stop());
      await page.evaluate(() => {
        __originLab.state.energy = 4321;
        __originLab.app.save();
      });
      await other.waitForFunction(() => document.querySelector("main").inert);
      assert.equal(await other.evaluate(() => __originLab.app.save()), false);
      assert.equal(
        await page.evaluate(
          () =>
            JSON.parse(localStorage.getItem("originLab.save.v3")).state.energy,
        ),
        4321,
      );
      await other.screenshot({
        path: "qa/screenshots/conflict-390.png",
        fullPage: true,
      });
      await other.close();
    },
  );
  await check(
    "B07 file:// standalone loads without network and plays",
    async () => {
      const ctx = await browser.newContext({ offline: true });
      const file = await ctx.newPage();
      file.on("pageerror", (e) => errors.push(e.message));
      try {
        await file.goto(
          "file://" +
            path.join(process.cwd(), "origin-lab-v0.2.html") +
            "?debug=1",
        );
      } catch (e) {
        await ctx.close();
        if (e.message.includes("ERR_BLOCKED_BY_ADMINISTRATOR"))
          return {
            status: "BLOCKED",
            reason:
              "Environment Chromium policy blocks file://. No policy changes attempted.",
          };
        throw e;
      }
      await file.locator("#tab-lab").click();
      await file.locator('[data-item="water"]').click();
      await file.locator('[data-item="energy"]').click();
      await file.locator("#combine").click();
      assert.match(await file.locator("#mix-result").innerText(), /새 발견/);
      await ctx.close();
    },
  );
  await check(
    "B09 first chapter final experiment three conditions + ending + one-time rebirth UI",
    async () => {
      const ready = structuredClone(finished);
      ready.finalResearchDone = false;
      ready.originData = 0;
      await page.setViewportSize({ width: 390, height: 844 });
      await seed(ready);
      await tab("evo");
      await page.locator('[data-exp="open"]').click();
      for (const cond of ["control", "light", "food"]) {
        await page.locator(`[data-cond="${cond}"]`).click();
        await page.locator("#exp-run").click();
        await page.locator("#exp-record:enabled").waitFor();
        await page.locator("#exp-record").click();
      }
      await page.locator('[data-exp="complete"]').click();
      assert.equal(
        await page.evaluate(() => __originLab.state.finalResearchDone),
        true,
      );
      await page.screenshot({
        path: "qa/screenshots/chapter-one-ending-390.png",
        fullPage: true,
      });
      await page.locator('[data-exp="stay"]').click();
      await page.locator('[data-act="rebirth"]').click();
      await page.locator("#confirm-ok").click();
      await page.waitForFunction(() => __originLab.state.originData === 3);
      assert.equal(await page.evaluate(() => __originLab.state.originData), 3);
      assert.equal(
        await page.evaluate(
          () => Object.keys(__originLab.state.experiment.records).length,
        ),
        3,
      );
      await page.locator('[data-act="rebirth"]').click();
      await page.locator("#confirm-ok").click();
      await page.waitForFunction(() => __originLab.state.originData === 3);
      assert.equal(await page.evaluate(() => __originLab.state.originData), 3);
      await page.waitForFunction(() => __originLab.state.rebirths === 2);
      assert.equal(await page.evaluate(() => __originLab.state.originData), 3);
      assert(await page.locator('[data-chapter="enter"]').isVisible());
    },
  );
  await check(
    "B10 bundled HTML with network offline and no external assets",
    async () => {
      const ctx = await browser.newContext({
        offline: true,
        viewport: { width: 360, height: 800 },
        colorScheme: "dark",
      });
      await ctx.route("https://origin.test/", (r) =>
        r.fulfill({
          contentType: "text/html",
          body: fs.readFileSync("origin-lab-v0.2.html", "utf8"),
        }),
      );
      const offline = await ctx.newPage();
      offline.on("pageerror", (e) => errors.push(e.message));
      const requests = [];
      offline.on("request", (r) => requests.push(r.url()));
      await offline.goto("https://origin.test/");
      await offline.locator('[data-item="water"]').click();
      await offline.locator('[data-item="energy"]').click();
      await offline.locator("#combine").click();
      assert.match(await offline.locator("#mix-result").innerText(), /새 발견/);
      assert.deepEqual(requests, ["https://origin.test/"]);
      await offline.screenshot({ path: "qa/screenshots/dark-360.png" });
      await ctx.close();
    },
  );
  assert.deepEqual(errors, []);
  results.push({ name: "B08 browser uncaught errors", status: "PASS", errors });
  await browser.close();
  server.close();
  fs.writeFileSync(
    "qa/browser-tests.json",
    JSON.stringify(
      { browser: `Chromium ${browserVersion}`, results },
      null,
      2,
    ),
  );
})().catch((e) => {
  console.error(e);
  fs.writeFileSync(
    "qa/browser-tests.json",
    JSON.stringify({ results, errors, failure: e.stack }, null, 2),
  );
  server.close();
  process.exit(1);
});
