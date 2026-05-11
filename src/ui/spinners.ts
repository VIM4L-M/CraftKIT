import ora from "ora";

export function createTaskSpinner(text: string) {
  return ora({
    text,
    spinner: "dots",
    color: "yellow"
  });
}
