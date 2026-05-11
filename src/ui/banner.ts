import boxen from "boxen";
import chalk from "chalk";
import gradient from "gradient-string";

import { palette } from "./theme";

const titleGradient = gradient([
  palette.gold,
  palette.amber,
  palette.orange,
  palette.coral,
  palette.rose,
  palette.lilac,
  palette.sky,
  palette.mint
]);

const outline = chalk.hex(palette.stone).dim;
const shadow = chalk.hex("#5e5a52").dim;

function renderWord(word: string): string {
  return word
    .split("")
    .map((character) => (character === " " ? character : chalk.bold(titleGradient(character))))
    .join("  ");
}

export function renderBanner(): string {
  const top = `${shadow("▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁")}`;
  const title = `${outline("▕")}${renderWord("CRAFTKIT")}${outline("▏")}`;
  const subtitle = chalk.hex("#f3efe4").bold("build your foundation");
  const accent = chalk.hex(palette.sand)("◦").repeat(12);

  return boxen([top, title, subtitle, accent].join("\n"), {
    padding: { top: 1, right: 2, bottom: 1, left: 2 },
    margin: { top: 0, bottom: 0 },
    borderStyle: "round",
    borderColor: "yellow",
    textAlignment: "center"
  });
}

export function renderCompactBanner(): string {
  return renderBanner();
}
