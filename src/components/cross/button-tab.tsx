import { cn } from "@/src/shadcn/lib/utils";

export default function ButtonTab({
  className,
  onClick,
  isActive,
  children,
}: {
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      className={cn(
        "p-3 text-foreground hover:text-uala-primary transition-colors relative cursor-pointer",
        isActive && "text-uala-primary",
        className
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
