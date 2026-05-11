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

function getInfraTemplatePath(): string {
  return path.join(templateRoot, "infra");
}

function getRootTemplatePath(): string {
  return path.join(templateRoot, "root");
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
  const infraPath = path.join(projectRoot, "infra");

  await ensureDirectory(projectRoot);
  await ensureDirectory(frontendPath);
  await ensureDirectory(backendPath);
  await ensureDirectory(infraPath);

  await copyRecursive(getFrontendTemplatePath(), frontendPath);
  await copyRecursive(getBackendTemplatePath(), backendPath);
  await copyRecursive(getInfraTemplatePath(), infraPath);
  await copyRecursive(getRootTemplatePath(), projectRoot);

  await fs.writeFile(
    path.join(projectRoot, "README.md"),
    `# ${config.name}\n\nGenerated with CraftKit.\n\n## Structure\n\n- frontend: React + TypeScript + Vite\n- backend: Go + Gin\n- infra: Docker assets and compose file\n`
  );

  await fs.writeFile(
    path.join(projectRoot, "craft.config.json"),
    JSON.stringify(
      {
        name: config.name,
        frontend: config.frontend,
        backend: config.backend,
        docker: config.docker ?? false,
        packageManager: config.packageManager ?? "npm",
        structure: "intermediate-fullstack"
      },
      null,
      2
    ) + "\n"
  );

  await fs.writeFile(
    path.join(projectRoot, ".gitignore"),
    `node_modules/\ndist/\n.env\nfrontend/.env\nbackend/.env\n`
  );

  if (config.docker) {
    await writeFileIfMissing(
      path.join(infraPath, "docker-compose.yml"),
      `services:\n  backend:\n    build:\n      context: ../backend\n      dockerfile: ../infra/docker/backend.Dockerfile\n    ports:\n      - "8080:8080"\n    env_file:\n      - ../backend/.env\n  frontend:\n    build:\n      context: ../frontend\n      dockerfile: ../infra/docker/frontend.Dockerfile\n    ports:\n      - "5173:5173"\n    env_file:\n      - ../frontend/.env\n`
    );

    await writeFileIfMissing(
      path.join(infraPath, "docker", "frontend.Dockerfile"),
      `FROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 5173\nCMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]\n`
    );

    await writeFileIfMissing(
      path.join(infraPath, "docker", "backend.Dockerfile"),
      `FROM golang:1.24-alpine AS build\nWORKDIR /app\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\nRUN go build -o server ./cmd/server\nFROM alpine:3.21\nWORKDIR /app\nCOPY --from=build /app/server .\nEXPOSE 8080\nCMD ["./server"]\n`
    );
  }

  return projectRoot;
}
