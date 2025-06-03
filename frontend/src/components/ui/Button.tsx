import { forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-3 text-base",
};

const variantStyles = {
  primary: "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300",
  outline:
    "border border-green-600 text-green-700 hover:bg-green-50 disabled:border-gray-300 disabled:text-gray-400",
  ghost: "text-green-700 hover:bg-green-50",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  )
);

Button.displayName = "Button";
