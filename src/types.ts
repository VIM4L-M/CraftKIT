export type Config = {
  name: string;
  packageManager?: "npm";
  frontend: {
    language: "typescript" | "javascript";
    framework: "react" | "next";
  };
  backend: {
    language: "go";
    framework: "gin" | "fiber";
  };
  docker: boolean;
  structure?: "intermediate-fullstack";
};
