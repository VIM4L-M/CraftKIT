declare module "prompts" {
  type PromptObject<T extends Record<string, unknown> = Record<string, unknown>> = {
    type: string;
    name: keyof T & string;
    message: string;
    validate?: (value: unknown) => true | string | Promise<true | string>;
    choices?: Array<{ title: string; value: unknown }>;
    initial?: unknown;
  };

  type Options = {
    onCancel?: () => void;
  };

  export default function prompts<T extends Record<string, unknown>>(
    questions: Array<PromptObject<T>>,
    options?: Options
  ): Promise<T>;
}
