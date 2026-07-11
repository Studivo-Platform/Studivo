import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/shared/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-semibold whitespace-nowrap transition-all",
  {
    variants: {
      variant: {
        default: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/30",
        secondary: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300",
        destructive: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-100 dark:border-red-900/30",
        outline: "border-gray-200 text-gray-700 dark:border-zinc-800 dark:text-zinc-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
