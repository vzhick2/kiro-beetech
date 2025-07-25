import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100',
  {
    variants: {
      variant: {
        default: 'bg-gray-900 text-white shadow-sm hover:bg-gray-800 hover:shadow-md',
        destructive: 'bg-red-500 text-white shadow-sm hover:bg-red-600 hover:shadow-md',
        outline:
          'border border-gray-200/60 bg-white/95 backdrop-blur-sm text-gray-700 shadow-sm hover:bg-gray-50/95 hover:border-gray-300/60 hover:shadow-md',
        secondary: 'bg-gray-100/80 text-gray-700 shadow-sm hover:bg-gray-200/80 hover:shadow-md',
        ghost: 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-700',
        link: 'text-gray-700 underline-offset-4 hover:underline hover:text-gray-900',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-11 rounded-lg px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
