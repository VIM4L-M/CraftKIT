import chalk from "chalk";
import boxen from "boxen";

import { colors, styles } from "./theme";

export function printIntro(): void {
  const top = boxen("", {
    padding: 0,
    margin: 0,
    borderStyle: "single",
    borderColor: "#7c7267"
  });

  console.log("\n");
  console.log(top.replace(/\n$/, ""));
}

export function printSuccessSummary(summary: {
  projectName: string;
  frontend: string;
  backend: string;
  docker: boolean;
}): void {
  console.log();
  console.log(styles.success("◆ project"));
  console.log(`  ${styles.value(summary.projectName)}`);
  console.log();
  console.log(styles.success("◆ frontend"));
  console.log(`  ${styles.value(summary.frontend)}`);
  console.log();
  console.log(styles.success("◆ backend"));
  console.log(`  ${styles.value(summary.backend)}`);
  console.log();
  console.log(styles.success("◆ docker"));
  console.log(`  ${styles.value(summary.docker ? "enabled" : "disabled")}`);
  console.log();
  console.log(colors.success("Project created successfully"));
  console.log(chalk.hex("#b6b0a3")("Next steps:"));
  console.log(`  ${chalk.hex("#f3efe4").bold(`cd ${summary.projectName}`)}`);
  console.log(`  ${chalk.hex("#f3efe4").bold("cd frontend && npm install && npm run dev")}`);
  console.log(`  ${chalk.hex("#f3efe4").bold("cd backend && go run ./cmd/server")}`);
}
