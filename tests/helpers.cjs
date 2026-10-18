const fs = require("node:fs"),
  vm = require("node:vm");
function core(baseline = false) {
  let js = fs.readFileSync(
    baseline ? "baseline/readable-bundle.js" : "src/game.js",
    "utf8",
  );
  if (!baseline)
    js = js
      .replace(
        "/* CHAPTER_MODULE */",
        fs.readFileSync("src/chapter.js", "utf8"),
      )
      .replace(
        "/* RESEARCH_MODULE */",
        fs.readFileSync("src/research.js", "utf8"),
      )
      .replace(
        "/* RESEARCH_UI_MODULE */",
        fs.readFileSync("src/research-ui.js", "utf8"),
      )
      .replace("/* ASSET_MODULE */", fs.readFileSync("src/assets.js", "utf8"));
  js =
    js.slice(0, js.indexOf("  var Wt =")) +
    `globalThis.core={le,Pt,Je,Re,Ye,Xe,yt,Ze,Ht,Kt,Bt,Ut,nt,Ft,jt,Rt,It,ze,Ut,_t,U,Se,Y,I,C,g,S,$,Et${baseline ? "" : ",enterChapter,observeChapter,chapterAction,storageManager,automationRate,automationTick,researchSnapshot,prepareResearch,runComparison,researchMetrics,RESEARCH_METRICS,makeResearchNote,normalizeResearchNotes,researchAvailability,stepResearch,researchTotals,applyResearchCondition,researchChart,getAsset"}};})();`;
  const ctx = {
    console,
    setTimeout,
    clearTimeout,
    structuredClone,
    URLSearchParams,
    crypto: require("node:crypto").webcrypto,
  };
  vm.createContext(ctx);
  if (!baseline)
    vm.runInContext(fs.readFileSync("src/persistence.js", "utf8"), ctx);
  vm.runInContext(js, ctx);
  return ctx.core;
}
class MemoryStorage {
  constructor() {
    this.data = new Map();
    this.fail = false;
  }
  get length() {
    return this.data.size;
  }
  key(i) {
    return [...this.data.keys()][i] ?? null;
  }
  getItem(k) {
    return this.data.get(k) ?? null;
  }
  setItem(k, v) {
    if (this.fail) throw Error("QuotaExceededError");
    this.data.set(k, String(v));
  }
  removeItem(k) {
    this.data.delete(k);
  }
}
module.exports = { core, MemoryStorage };
