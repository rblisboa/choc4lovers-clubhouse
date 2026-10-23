import { cn } from "@/lib/utils";

/** Typographic logo — replace with an image later if needed. */
export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("font-display text-2xl font-semibold tracking-tight", light ? "text-cream" : "text-primary", className)}>
      Choc<span className="mx-px inline-block -rotate-6 rounded-md bg-pink px-1.5 text-pink-foreground">4</span>lovers
    </span>
  );
}
