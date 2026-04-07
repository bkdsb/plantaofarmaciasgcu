"use client";

import { cn } from "@/lib/utils";
import { type SelectHTMLAttributes } from "react";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  );
}
