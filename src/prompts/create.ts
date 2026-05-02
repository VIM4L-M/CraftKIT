import prompts from "prompts";

import type { Config } from "../types";

type PromptAnswers = {
  name: string;
  frontendLanguage: "typescript";
  frontendFramework: "react";
  backendLanguage: "go";
  backendFramework: "gin";
  docker: boolean;
};

export async function promptCreateConfig(): Promise<Config> {
  const responses = await prompts<PromptAnswers>(
    [
      {
        type: "text",
        name: "name",
        message: "Project name",
        validate: (value: unknown) =>
          typeof value === "string" && value.trim().length > 0
            ? true
            : "Project name is required"
      },
      {
        type: "select",
        name: "frontendLanguage",
        message: "Frontend language",
        choices: [{ title: "TypeScript", value: "typescript" }]
      },
      {
        type: "select",
        name: "frontendFramework",
        message: "Frontend framework",
        choices: [{ title: "React", value: "react" }]
      },
      {
        type: "select",
        name: "backendLanguage",
        message: "Backend language",
        choices: [{ title: "Go", value: "go" }]
      },
      {
        type: "select",
        name: "backendFramework",
        message: "Backend framework",
        choices: [{ title: "Gin", value: "gin" }]
      },
      {
        type: "confirm",
        name: "docker",
        message: "Enable Docker",
        initial: false
      }
    ],
    {
      onCancel: () => {
        throw new Error("Operation cancelled");
      }
    }
  );

  return {
    name: responses.name.trim(),
    frontend: {
      language: responses.frontendLanguage,
      framework: responses.frontendFramework
    },
    backend: {
      language: responses.backendLanguage,
      framework: responses.backendFramework
    },
    docker: responses.docker
  };
}
