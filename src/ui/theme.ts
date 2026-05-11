import chalk from "chalk";

export const palette = {
  sand: "#e9db9b",
  gold: "#d9b96c",
  amber: "#d89a3c",
  orange: "#d37244",
  coral: "#ce6565",
  rose: "#d26b93",
  lilac: "#b48bd8",
  sky: "#95b7d6",
  slate: "#93a8b8",
  mint: "#90c57c",
  lime: "#bed36d",
  stone: "#b9bcaf"
} as const;

export const colors = {
  text: chalk.hex("#f3efe4"),
  muted: chalk.hex("#b6b0a3"),
  accent: chalk.hex("#d9b96c"),
  border: chalk.hex("#80796d"),
  success: chalk.hex("#90c57c"),
  warning: chalk.hex("#d89a3c"),
  danger: chalk.hex("#d26b65")
} as const;

export const styles = {
  label: chalk.hex("#b9bcaf").bold,
  value: chalk.hex("#f3efe4").bold,
  prompt: chalk.hex("#d9b96c").bold,
  subtle: chalk.hex("#b6b0a3"),
  success: chalk.hex("#90c57c").bold
} as const;
