export type Config = {
  name: string;
  packageManager?: "npm";
  frontend: {
    language: "typescript";
    framework: "react";
  };
  backend: {
    language: "go";
    framework: "gin";
  };
  docker?: boolean;
  structure?: "intermediate-fullstack";
};
