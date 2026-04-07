import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-secondary text-secondary-foreground",
      success: "bg-success text-success-foreground",
      warning: "bg-warning text-warning-foreground",
      outline: "border border-border bg-card"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export function Badge({ className, variant, ...props }: HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
