import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  variant?: "default" | "highlight" | "muted";
  className?: string;
};

export function ConceptTag({ children, variant = "default", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono border transition-colors",
        variant === "default" && "bg-white/[0.04] border-white/10 text-foreground/85 hover:bg-white/[0.08]",
        variant === "highlight" &&
          "bg-violet-500/10 border-violet-500/30 text-violet-200 hover:bg-violet-500/20",
        variant === "muted" && "bg-transparent border-white/[0.06] text-foreground-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
