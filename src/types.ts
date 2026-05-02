export type Config = {
  name: string;
  frontend: {
    language: "typescript";
    framework: "react";
  };
  backend: {
    language: "go";
    framework: "gin";
  };
  docker: boolean;
};
