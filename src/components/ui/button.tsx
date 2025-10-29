import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold font-sans tracking-wide transition-all duration-300 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-deep shadow-medium hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-medium hover:shadow-strong",
        outline: "border-2 border-primary/30 text-primary-deep bg-background hover:bg-primary/10 hover:border-primary shadow-soft",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-medium hover:shadow-glow-secondary hover:scale-[1.02] active:scale-[0.98]",
        ghost: "hover:bg-accent-light hover:text-primary-deep",
        link: "text-primary-deep underline-offset-4 hover:underline",
        hero: "bg-gradient-hero text-primary-foreground hover:shadow-glow shadow-medium hover:scale-[1.03] active:scale-[0.98] font-heading",
        accent: "bg-gradient-accent text-secondary-foreground hover:shadow-glow-secondary shadow-medium hover:scale-[1.03] active:scale-[0.98] font-heading",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-2xl px-10 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
