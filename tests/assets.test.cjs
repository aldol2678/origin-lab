const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  os = require("node:os");
const { bundleAssets, keys } = require("../tools/assets.cjs");
const catalog = require("../data/catalog.json");
test("V03-T09 42 discovery / 9 species stable asset keys; zero manifest fallback", () => {
  const list = keys(catalog);
  assert.equal(list.filter((x) => x.startsWith("discovery.")).length, 42);
  assert.equal(list.filter((x) => x.startsWith("species.")).length, 9);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "origin-assets-"));
  try {
    assert.deepEqual(bundleAssets(dir, list).manifest.assets, {});
    assert.equal(
      require("./helpers.cjs").core().getAsset("discovery.water"),
      null,
    );
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});
test("V03-T09 partial/missing asset bundling is offline; no unauthorised or active SVG", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "origin-assets-")),
    list = keys(catalog);
  const write = (entry) =>
    fs.writeFileSync(
      path.join(dir, "manifest.json"),
      JSON.stringify({
        version: 1,
        assets: { "discovery.water": { "light.discovered": entry } },
      }),
    );
  try {
    write({ path: "missing.svg", approved: true });
    assert.equal(bundleAssets(dir, list).warnings.length, 1);
    // Empty viewBox is a test slot, not an authored icon or external artwork.
    fs.writeFileSync(
      path.join(dir, "empty.svg"),
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"></svg>',
    );
    write({ path: "empty.svg", approved: true });
    const data = bundleAssets(dir, list).manifest.assets["discovery.water"][
      "light.discovered"
    ].src;
    assert(data.startsWith("data:image/svg+xml;base64,"));
    write({ path: "empty.svg" });
    assert.throws(() => bundleAssets(dir, list), /approved/);
    write({ path: "https://example.invalid/asset.svg", approved: true });
    assert.throws(() => bundleAssets(dir, list), /local/);
    write({ path: "../empty.svg", approved: true });
    assert.throws(() => bundleAssets(dir, list), /local/);
    fs.writeFileSync(
      path.join(dir, "empty.svg"),
      '<svg viewBox="0 0 64 64"><script>alert(1)</script></svg>',
    );
    write({ path: "empty.svg", approved: true });
    assert.throws(() => bundleAssets(dir, list), /inert/);
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});
test("V03-T09 theme/state resolver selects variants and keeps locked artwork hidden", () => {
  const vm = require("node:vm"),
    src = fs
      .readFileSync("src/assets.js", "utf8")
      .split("const assetImageCache")[0];
  const fixture = {
    version: 1,
    assets: {
      "discovery.water": {
        "light.default": { src: "light" },
        "dark.default": { src: "dark" },
        "default.selected": { src: "selected" },
      },
    },
  };
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    src.replace(
      /\/\* BUILD_ASSET_MANIFEST \*\/\s*\{\s*version:\s*1,\s*assets:\s*\{\s*\},?\s*\}/,
      JSON.stringify(fixture),
    ) + ";this.get=getAsset;",
    context,
  );
  assert.equal(
    context.get("discovery.water", { theme: "dark", state: "discovered" }).src,
    "dark",
  );
  assert.equal(
    context.get("discovery.water", { theme: "light", state: "selected" }).src,
    "selected",
  );
  assert.equal(
    context.get("discovery.water", { theme: "light", state: "locked" }),
    null,
  );
  assert.equal(context.get("discovery.missing"), null);
});
