import { cn } from "@/src/shadcn/lib/utils";

export default function ButtonIcon({
  className,
  onClick,
  children,
  disabled = false,
}: {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      className={cn(
        "p-3 hover:bg-gray-100 rounded-lg transition-colors",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-gray-100",
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
