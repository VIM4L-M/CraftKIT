#!/usr/bin/env node

import { Command } from "commander";

import { runCreateCommand } from "./commands/create";

const program = new Command();

program
  .name("craftkit")
  .description("Interactive scaffolding CLI for Go and React projects")
  .version("0.1.0");

program
  .command("create")
  .description("Create a new fullstack project")
  .action(async () => {
    try {
      await runCreateCommand();
    } catch (error) {
      if (error instanceof Error && error.message === "Operation cancelled") {
        process.exitCode = 1;
        return;
      }

      const message = error instanceof Error ? error.message : "Failed to create project";
      console.error(message);
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv);
