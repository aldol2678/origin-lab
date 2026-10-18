const fs = require("node:fs");
const game = fs
  .readFileSync("src/game.js", "utf8")
  .replace("/* CHAPTER_MODULE */", fs.readFileSync("src/chapter.js", "utf8"));
const js = fs.readFileSync("src/persistence.js", "utf8") + "\n" + game;
const html = fs
  .readFileSync("src/shell.html", "utf8")
  .replace("/* BUILD_STYLE */", () => fs.readFileSync("src/style.css", "utf8"))
  .replace("/* BUILD_SCRIPT */", () => js)
  .replaceAll("v0.1.1", "v0.2");
fs.writeFileSync("origin-lab-v0.2.html", html);
console.log("Built standalone HTML:", Buffer.byteLength(html), "bytes");
