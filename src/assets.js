/* Optional artwork adapter. No artwork is supplied by this implementation. */
const ASSET_MANIFEST = /* BUILD_ASSET_MANIFEST */ { version: 1, assets: {} };
const ASSET_STATES = [
  "default",
  "locked",
  "discovered",
  "selected",
  "disabled",
];
function getAsset(key, variant = {}) {
  const requested = typeof variant === "string" ? { state: variant } : variant;
  const state = ASSET_STATES.includes(requested.state)
    ? requested.state
    : "default";
  const theme =
    requested.theme ||
    (typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  const variants = ASSET_MANIFEST.assets[key];
  if (!variants) return null;
  // Locked discoveries never show a revealed image through a fallback variant.
  const candidates =
    state === "locked"
      ? [theme + ".locked", "default.locked"]
      : [
          theme + "." + state,
          "default." + state,
          theme + ".default",
          "default.default",
        ];
  for (const v of candidates) if (variants[v]) return variants[v];
  return null;
}
const assetImageCache = new Map();
function assetImage(key, variant) {
  const asset = getAsset(key, variant);
  if (!asset) return null;
  let image = assetImageCache.get(asset.src);
  if (!image) {
    image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (typeof ge !== "undefined") ge.draw(true);
    };
    image.src = asset.src;
    assetImageCache.set(asset.src, image);
    image.onerror = () => {
      if (!image.dataset.warned) {
        console.warn("Optional image could not be decoded:", key);
        image.dataset.warned = "1";
      }
    };
  }
  return image.complete && image.naturalWidth ? image : null;
}
const assetDrawAgent = Pe.prototype.drawAgent;
Pe.prototype.drawAgent = function (sp, x, y, time) {
  const image = assetImage("species." + sp, {
    state: this.selected === sp ? "selected" : "default",
  });
  if (image) {
    this.ctx.drawImage(image, x - 9, y - 9, 18, 18);
    return;
  }
  return assetDrawAgent.call(this, sp, x, y, time);
};
Ge.prototype.applyAssets = function () {
  const slots = [
    ...document.querySelectorAll("[data-item],[data-codex],[data-tab]"),
  ];
  for (const el of slots) {
    const id = el.dataset.item || el.dataset.codex;
    const key = id ? "discovery." + id : "ui.tab." + el.dataset.tab;
    const locked = !!id && !b(this.state, id),
      state = locked
        ? "locked"
        : el.disabled
          ? "disabled"
          : el.getAttribute("aria-pressed") === "true" ||
              el.getAttribute("aria-selected") === "true"
            ? "selected"
            : id
              ? "discovered"
              : "default";
    applyAssetSlot(el, key, state);
  }
  for (const [id, key] of [
    ["hud-energy", "energy"],
    ["hud-insight", "insight"],
  ]) {
    const value = document.getElementById(id);
    if (value) applyAssetSlot(value.parentElement, "status." + key, "default");
  }
  const oxygen = document.querySelector("#env-card .bar-row > span");
  if (oxygen) applyAssetSlot(oxygen, "status.oxygen", "default");
};
function applyAssetSlot(el, key, state) {
  const asset = getAsset(key, { state }),
    existing = el.querySelector(":scope > img.optional-asset");
  if (!asset) {
    existing?.remove();
    return;
  }
  if (existing?.src === asset.src) return;
  existing?.remove();
  const img = document.createElement("img");
  img.className = "optional-asset";
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  img.width = 20;
  img.height = 20;
  img.src = asset.src;
  img.onerror = () => {
    console.warn("Optional image failed; text fallback retained:", key);
    img.remove();
  };
  el.prepend(img);
}
for (const name of ["renderLab", "renderLog", "renderTabs", "renderWorld"]) {
  const original = Ge.prototype[name];
  Ge.prototype[name] = function (...args) {
    const result = original.apply(this, args);
    this.applyAssets();
    return result;
  };
}
if (typeof window !== "undefined") {
  window.OriginLabAssets = Object.freeze({ getAsset });
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (typeof ge !== "undefined") {
        ge.applyAssets();
        ge.draw(true);
      }
    });
}
