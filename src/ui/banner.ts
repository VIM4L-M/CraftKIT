import figlet from "figlet";
import gradient from "gradient-string";

const brandName = "CraftKit";

function createFigletText(text: string): string {
  return figlet.textSync(text, {
    font: "ANSI Shadow",
    horizontalLayout: "fitted",
    verticalLayout: "fitted",
    whitespaceBreak: true
  });
}

function indent(value: string, spaces = 2): string {
  const padding = " ".repeat(spaces);
  return value
    .split("\n")
    .map((line) => `${padding}${line}`)
    .join("\n");
}

function renderTitle(): string {
  const title = createFigletText(brandName);

  const main = gradient([
    "#e8d68f",
    "#c5df72",
    "#74d5c7",
    "#e2a851",
    "#e4836e"
  ]).multiline(title);

  return `${main}`;
}


export function renderBanner(): string {
  const content = [
    indent(renderTitle()),
  ];

  return `\n\n ${content}`;
}

export function renderCompactBanner(): string {
  return renderBanner();
}
