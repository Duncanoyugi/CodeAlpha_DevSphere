import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--brand)] text-[var(--brand-foreground)] hover:bg-[var(--brand)]/80",
        secondary:
          "border-transparent bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80",
        destructive:
          "border-transparent bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/80",
        outline: "border-[var(--border)] bg-transparent text-[var(--foreground)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
