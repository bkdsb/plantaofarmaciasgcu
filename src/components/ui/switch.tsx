"use client";

import { cn } from "@/lib/utils";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  className?: string;
  disabled?: boolean;
};

export function Switch({ checked, onCheckedChange, className, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 items-center rounded-full border transition",
        checked ? "border-primary bg-primary" : "border-border bg-muted",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className
      )}
      disabled={disabled}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white transition",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}
