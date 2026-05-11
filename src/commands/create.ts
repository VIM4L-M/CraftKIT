import chalk from "chalk";
import { intro, outro, select, text, confirm, note } from "@clack/prompts";

import { generateProject } from "../generator/generate";
import { createTaskSpinner } from "../ui/spinners";
import { printIntro, printSuccessSummary } from "../ui/screens";
import { renderBanner } from "../ui/banner";

type SelectOption = {
  label: string;
  value: string;
};

const frontendOption: SelectOption = {
  label: "React + TypeScript",
  value: "react-typescript"
};

const backendOption: SelectOption = {
  label: "Go + Gin",
  value: "go-gin"
};

function buildLayout() {
  console.log(renderBanner());
  console.log();
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

  const frontend = await select({
    message: "Frontend",
    options: [frontendOption],
    initialValue: frontendOption.value
  });

  const backend = await select({
    message: "Backend",
    options: [backendOption],
    initialValue: backendOption.value
  });

  const docker = await confirm({
    message: "Enable Docker",
    initialValue: false
  });

  const config = {
    name: projectName.trim(),
    frontend: {
      language: "typescript" as const,
      framework: "react" as const
    },
    backend: {
      language: "go" as const,
      framework: "gin" as const
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
    frontend: "React + TypeScript",
    backend: "Go + Gin",
    docker: config.docker
  });

  outro(chalk.hex("#90c57c").bold("craft complete"));
}
