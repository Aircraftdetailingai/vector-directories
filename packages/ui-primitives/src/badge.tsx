import React from "react";

export interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

export function Badge({ label, variant = "default", className }: BadgeProps) {
  return (
    <span role="status" data-variant={variant} className={className}>
      {label}
    </span>
  );
}
