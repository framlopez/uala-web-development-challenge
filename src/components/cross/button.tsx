import { cn } from "@/src/shadcn/lib/utils";

export default function Button({
  className,
  onClick,
  disabled,
  children,
  type = "button",
  form,
  ...props
}: {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  form?: string;
  [key: string]: unknown;
}) {
  return (
    <button
      className={cn(
        "px-4 py-3 rounded-lg flex items-center gap-1 text-sm",
        !disabled && "hover:bg-gray-100 cursor-pointer transition-colors",
        className
      )}
      type={type}
      onClick={onClick}
      disabled={disabled}
      form={form}
      {...props}
    >
      {children}
    </button>
  );
}
