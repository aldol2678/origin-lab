const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm"),
  os = require("node:os"),
  path = require("node:path");
const { bundleAssets, keys } = require("../tools/assets.cjs");
const { verify, blocked } = require("../tools/verify-r1.cjs");
const list = keys(require("../data/catalog.json"));
function resolver() {
  const manifest = bundleAssets("assets", list).manifest;
  const src = fs
    .readFileSync("src/assets.js", "utf8")
    .split("const assetImageCache")[0]
    .replace(
      /\/\* BUILD_ASSET_MANIFEST \*\/\s*\{\s*version:\s*1,\s*assets:\s*\{\s*\},?\s*\}/,
      JSON.stringify(manifest),
    );
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(src + ";this.get=getAsset;", ctx);
  return { get: ctx.get, manifest };
}
test("AR01 reviewed 104-key provenance, 58 supported, 48 enabled, 10 blocked, 106 byte-identical files", () => {
  assert.equal(verify().files, 106);
});
test("AR02 no blocked or unsupported art resolves; shared lock never reveals discovery identity", () => {
  const { get, manifest } = resolver();
  for (const key of blocked)
    for (const state of [
      "default",
      "locked",
      "selected",
      "discovered",
      "disabled",
    ])
      assert.equal(get(key, { state, theme: "light" }), null);
  for (const key of ["ui.logo", "status.nutrients", "ui.button.primary"])
    assert.equal(get(key), null);
  const locks = new Set();
  for (const key of Object.keys(manifest.assets).filter((x) =>
    x.startsWith("discovery."),
  )) {
    for (const theme of ["light", "dark"]) {
      const icon = get(key, { state: "discovered", theme }),
        locked = get(key, { state: "locked", theme });
      assert(icon && locked);
      assert.notEqual(icon.src, locked.src);
      locks.add(locked.src);
    }
  }
  assert.equal(locks.size, 1);
});
test("AR03 every enabled theme resolves, 18px PNG species, selected variant and disabled fallbacks", () => {
  const { get, manifest } = resolver();
  for (const key of Object.keys(manifest.assets)) {
    const a = get(key, { theme: "light" }),
      b = get(key, { theme: "dark" });
    assert(a && b);
    assert.equal(a.src, manifest.assets[key]["light.default"].src);
    assert.equal(b.src, manifest.assets[key]["dark.default"].src);
    for (const theme of ["light", "dark"]) {
      assert(get(key, { theme, state: "selected" }));
      assert(get(key, { theme, state: "disabled" }));
    }
    if (key.startsWith("species.")) {
      assert(a.src.startsWith("data:image/png"));
      const bytes = Buffer.from(a.src.split(",")[1], "base64");
      assert.equal(bytes.readUInt32BE(16), 18);
      assert.equal(bytes.readUInt32BE(20), 18);
      assert(get(key, "selected").src.startsWith("data:image/svg+xml"));
    }
  }
});
test("AR04 changed approved bytes rejected; missing optional file retains fallback warning", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "origin-r1-"));
  try {
    fs.cpSync("assets", dir, { recursive: true });
    const manifest = JSON.parse(
        fs.readFileSync(path.join(dir, "manifest.json")),
      ),
      entry = manifest.assets["discovery.nutrients"]["light.default"],
      file = path.join(dir, entry.path);
    fs.appendFileSync(file, "\n");
    assert.throws(() => bundleAssets(dir, list), /hash mismatch/);
    fs.unlinkSync(file);
    assert(
      bundleAssets(dir, list).warnings.some((x) =>
        x.includes("discovery.nutrients"),
      ),
    );
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});
test("AR05 no fonts, archive, preview, logo or large illustrations in runtime assets", () => {
  const ledger = require("../assets/r1-provenance.json");
  for (const x of ledger.files) {
    assert(
      !/large|png256|art-svg|typography|preview|\.zip|\.woff|\.ttf/.test(
        x.path,
      ),
    );
    assert(
      !blocked.some(
        (k) =>
          path.basename(x.path).split(".")[0] === k.split(".")[1] &&
          x.path.includes("/discoveries/"),
      ),
    );
  }
});
