import path from "node:path";

import { generateProject } from "../generator/generate";
import { promptCreateConfig } from "../prompts/create";

export async function runCreateCommand(): Promise<void> {
  const config = await promptCreateConfig();
  const projectRoot = await generateProject(config);

  const projectName = path.basename(projectRoot);

  console.log("✔ Project created successfully");
  console.log("✔ Frontend: React + TypeScript");
  console.log("✔ Backend: Go (Gin)");
  console.log(`✔ Docker: ${config.docker ? "Enabled" : "Disabled"}`);
  console.log("");
  console.log("Next steps:");
  console.log(`cd ${projectName}`);
  console.log("npm install");
  console.log("go run main.go");
}
