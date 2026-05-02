import fs from "node:fs/promises";
import path from "node:path";

import type { Config } from "../types";
import {
  copyRecursive,
  ensureDirectory,
  pathExists,
  writeFileIfMissing
} from "../utils/fs";

const templateRoot = path.resolve(__dirname, "..", "..", "src", "templates");

function getFrontendTemplatePath(): string {
  return path.join(templateRoot, "react-ts");
}

function getBackendTemplatePath(): string {
  return path.join(templateRoot, "go-gin");
}

function getProjectRoot(projectName: string): string {
  return path.resolve(process.cwd(), projectName);
}

export async function generateProject(config: Config): Promise<string> {
  const projectRoot = getProjectRoot(config.name);

  if (await pathExists(projectRoot)) {
    throw new Error(`Directory already exists: ${config.name}`);
  }

  const frontendPath = path.join(projectRoot, "frontend");
  const backendPath = path.join(projectRoot, "backend");

  await ensureDirectory(projectRoot);
  await ensureDirectory(frontendPath);
  await ensureDirectory(backendPath);

  await copyRecursive(getFrontendTemplatePath(), frontendPath);
  await copyRecursive(getBackendTemplatePath(), backendPath);

  if (config.docker) {
    await writeFileIfMissing(
      path.join(projectRoot, "docker-compose.yml"),
      `services:\n  backend:\n    build:\n      context: ./backend\n    ports:\n      - "8080:8080"\n  frontend:\n    build:\n      context: ./frontend\n    ports:\n      - "5173:5173"\n`
    );

    await writeFileIfMissing(
      path.join(frontendPath, "Dockerfile"),
      `FROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 5173\nCMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]\n`
    );

    await writeFileIfMissing(
      path.join(backendPath, "Dockerfile"),
      `FROM golang:1.24-alpine AS build\nWORKDIR /app\nCOPY . .\nRUN go build -o server .\nFROM alpine:3.21\nWORKDIR /app\nCOPY --from=build /app/server .\nEXPOSE 8080\nCMD ["./server"]\n`
    );
  }

  return projectRoot;
}
