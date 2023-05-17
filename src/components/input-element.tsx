import * as React from "react";
import clsx from "clsx";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(
          "placeholder:text-muted-400 flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-1 focus:outline-none focus:ring-1 focus:ring-teal-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
