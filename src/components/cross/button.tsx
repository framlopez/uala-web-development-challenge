import cn from "@/src/utils/cn";

export default function Button({
  className,
  onClick,
  disabled,
  children,
}: {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      className={cn(
        "px-4 py-3 rounded-lg flex items-center gap-1 text-sm",
        !disabled && "hover:bg-gray-100 cursor-pointer transition-colors",
        className
      )}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
