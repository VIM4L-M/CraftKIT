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

function getFrontendTemplatePath(config: Config): string {
  if (config.frontend.framework === "react") {
    return path.join(
      templateRoot,
      config.frontend.language === "javascript" ? "react-js" : "react-ts"
    );
  }

  return path.join(
    templateRoot,
    config.frontend.language === "javascript" ? "next-js" : "next-ts"
  );
}

function getBackendTemplatePath(config: Config): string {
  return path.join(
    templateRoot,
    config.backend.framework === "fiber" ? "go-fiber" : "go-gin"
  );
}

function getInfraTemplatePath(): string {
  return path.join(templateRoot, "infra");
}

function getRootTemplatePath(): string {
  return path.join(templateRoot, "root");
}

function getFrontendLabel(config: Config): string {
  if (config.frontend.framework === "react") {
    return `React + ${config.frontend.language === "javascript" ? "JavaScript" : "TypeScript"}`;
  }

  return `Next.js + ${config.frontend.language === "javascript" ? "JavaScript" : "TypeScript"}`;
}

function getBackendLabel(config: Config): string {
  return config.backend.framework === "fiber" ? "Go + Fiber" : "Go + Gin";
}

function getFrontendPort(config: Config): number {
  return config.frontend.framework === "react" ? 5173 : 3000;
}

function getFrontendDockerfile(config: Config): string {
  if (config.frontend.framework === "react") {
    return `FROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 5173\nCMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]\n`;
  }

  return `FROM node:22-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\nFROM node:22-alpine\nWORKDIR /app\nENV NODE_ENV=production\nCOPY --from=build /app/package*.json ./\nRUN npm install --omit=dev\nCOPY --from=build /app/.next ./.next\nCOPY --from=build /app/public ./public\nEXPOSE 3000\nCMD ["npm", "run", "start"]\n`;
}

function getDockerCompose(config: Config): string {
  const frontendPort = getFrontendPort(config);

  return `services:\n  backend:\n    build:\n      context: ../backend\n      dockerfile: ../infra/docker/backend.Dockerfile\n    ports:\n      - "8080:8080"\n    env_file:\n      - ../backend/.env\n  frontend:\n    build:\n      context: ../frontend\n      dockerfile: ../infra/docker/frontend.Dockerfile\n    ports:\n      - "${frontendPort}:${frontendPort}"\n    env_file:\n      - ../frontend/.env\n`;
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

  await copyRecursive(getFrontendTemplatePath(config), frontendPath);
  await copyRecursive(getBackendTemplatePath(config), backendPath);
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
      getDockerCompose(config)
    );

    await writeFileIfMissing(
      path.join(infraPath, "docker", "frontend.Dockerfile"),
      getFrontendDockerfile(config)
    );

    await writeFileIfMissing(
      path.join(infraPath, "docker", "backend.Dockerfile"),
      `FROM golang:1.24-alpine AS build\nWORKDIR /app\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\nRUN go build -o server ./cmd/server\nFROM alpine:3.21\nWORKDIR /app\nCOPY --from=build /app/server .\nEXPOSE 8080\nCMD ["./server"]\n`
    );
  }

  return projectRoot;
}
