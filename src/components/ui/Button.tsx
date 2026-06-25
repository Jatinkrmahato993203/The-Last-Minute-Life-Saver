import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-sans font-bold uppercase tracking-widest text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:pointer-events-none disabled:opacity-50",
          "h-12 px-8 rounded-none border-2", // Base sizing
          variant === "primary" && "bg-amber border-amber text-paper hover:bg-transparent hover:text-amber transition-all",
          variant === "secondary" && "border-ink text-ink bg-transparent hover:bg-ink hover:text-paper",
          variant === "ghost" && "bg-transparent text-ink hover:bg-ink/5",
          variant === "link" && "bg-transparent text-ink underline decoration-amber decoration-2 underline-offset-4 hover:text-ink/80 px-0 h-auto",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
