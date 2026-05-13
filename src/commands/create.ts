import chalk from "chalk";
import { intro, outro, select, text, confirm, note } from "@clack/prompts";

import { generateProject } from "../generator/generate";
import { createTaskSpinner } from "../ui/spinners";
import { printSuccessSummary } from "../ui/screens";
import { renderBanner } from "../ui/banner";
import type { Config } from "../types";

type SelectOption<T extends string> = {
  label: string;
  value: T;
};

const frontendLanguages = [
  {
    label: "Typescript",
    value: "typescript"
  },
  {
    label: "Javascript",
    value: "javascript"
  }
] as const satisfies readonly SelectOption<string>[];

const frontendFrameworks = [
  {
    label: "React",
    value: "react"
  },
  {
    label : "Next.js",
    value: "next"
  }
] as const satisfies readonly SelectOption<string>[];

const backendLanguages = [
  {
    label: "Go",
    value: "go"
  }
] as const satisfies readonly SelectOption<string>[];

const backendFrameworks = [
  {
    label: "Gin",
    value: "gin"
  },
  {
    label: "Fiber",
    value: "fiber"
  }
] as const satisfies readonly SelectOption<string>[];

function buildLayout() {
  console.log(renderBanner());
  console.log();
}

function formatFrontendLabel(language: Config["frontend"]["language"], framework: Config["frontend"]["framework"]): string {
  const frameworkLabel = framework === "react" ? "React" : "Next.js";
  const languageLabel = language === "javascript" ? "JavaScript" : "TypeScript";

  return `${frameworkLabel} + ${languageLabel}`;
}

function formatBackendLabel(framework: Config["backend"]["framework"]): string {
  return framework === "fiber" ? "Go + Fiber" : "Go + Gin";
}

export async function runCreateCommand(): Promise<void> {
  intro(chalk.hex("#d9b96c").bold("craftkit"));

  buildLayout();

  const projectName = await text({
    message: "Project name",
    placeholder: "my-app",

    validate: (value) => {
      if (typeof value !== "string" || value.trim().length === 0) {
        return "Project name is required";
      }

      return undefined;
    }
  });

  if (typeof projectName !== "string") {
    throw new Error("Project name is required");
  }

  const frontendLanguage = await select({
    message: "Frontend Language",
    options: [...frontendLanguages],
    initialValue: frontendLanguages[0].value
  });

  const frontendFramework = await select({
    message: "Frontend Framework",
    options: [...frontendFrameworks],
    initialValue: frontendFrameworks[0].value
  });

  const backendLanguage = await select({
    message: "Backend Language",
    options: [...backendLanguages],
    initialValue: backendLanguages[0].value
  });

  const backendFramework = await select({
    message: "Backend Framework",
    options: [...backendFrameworks],
    initialValue: backendFrameworks[0].value
  });

  if (
    typeof frontendLanguage !== "string" ||
    typeof frontendFramework !== "string" ||
    typeof backendLanguage !== "string" ||
    typeof backendFramework !== "string"
  ) {
    throw new Error("Selection cancelled");
  }

  const docker = await confirm({
    message: "Enable Docker",
    initialValue: false
  });

  const config: Config = {
    name: projectName.trim(),

    frontend: {
      language: frontendLanguage,
      framework: frontendFramework
    },

    backend: {
      language: backendLanguage,
      framework: backendFramework
    },

    docker: Boolean(docker)
  };

  const generationSpinner = createTaskSpinner("generating project...");

  generationSpinner.start();

  const projectRoot = await generateProject(config);

  generationSpinner.succeed("project generated");

  note(`Created at ${projectRoot}`, "generated");

  printSuccessSummary({
    projectName: config.name,
    frontend: formatFrontendLabel(config.frontend.language, config.frontend.framework),
    backend: formatBackendLabel(config.backend.framework),
    docker: config.docker
  });

  outro(chalk.hex("#90c57c").bold("craft complete"));
}