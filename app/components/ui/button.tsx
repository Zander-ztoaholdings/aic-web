import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-aic-gold text-white hover:bg-aic-gold/90 shadow-lg shadow-aic-gold/20",
        destructive: "bg-[#d4183d] text-aic-paper hover:bg-[#d4183d]/90",
        outline: "border border-aic-navy bg-transparent text-aic-navy hover:bg-aic-navy-mid hover:text-white",
        secondary: "bg-aic-navy text-white hover:bg-aic-navy/90",
        ghost: "hover:bg-aic-navy-mid/50 hover:text-aic-navy",
        link: "text-aic-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto py-3 px-7",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-10 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
