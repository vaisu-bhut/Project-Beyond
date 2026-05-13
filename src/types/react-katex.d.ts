declare module "react-katex" {
  import type { ComponentType } from "react";

  type MathProps = {
    math: string;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
    settings?: Record<string, unknown>;
  };

  export const InlineMath: ComponentType<MathProps>;
  export const BlockMath: ComponentType<MathProps>;
}
