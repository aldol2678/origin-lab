const fs = require("node:fs");
const { bundleAssets, keys } = require("./tools/assets.cjs");
const assets = bundleAssets("assets", keys(require("./data/catalog.json")));
for (const warning of assets.warnings) console.warn(warning);
const assetCode = fs
  .readFileSync("src/assets.js", "utf8")
  .replace(
    /\/\* BUILD_ASSET_MANIFEST \*\/\s*\{\s*version:\s*1,\s*assets:\s*\{\s*\},?\s*\}/,
    JSON.stringify(assets.manifest),
  );
const game = fs
  .readFileSync("src/game.js", "utf8")
  .replace("/* CHAPTER_MODULE */", fs.readFileSync("src/chapter.js", "utf8"))
  .replace("/* RESEARCH_MODULE */", fs.readFileSync("src/research.js", "utf8"))
  .replace(
    "/* RESEARCH_UI_MODULE */",
    fs.readFileSync("src/research-ui.js", "utf8"),
  )
  .replace("/* ASSET_MODULE */", () => assetCode);
const js = fs.readFileSync("src/persistence.js", "utf8") + "\n" + game;
const html = fs
  .readFileSync("src/shell.html", "utf8")
  .replace("/* BUILD_STYLE */", () => fs.readFileSync("src/style.css", "utf8"))
  .replace("/* BUILD_SCRIPT */", () => js)
  .replaceAll("v0.1.1", "v0.3");
fs.writeFileSync("origin-lab-v0.3.html", html);
console.log("Built standalone HTML:", Buffer.byteLength(html), "bytes");
