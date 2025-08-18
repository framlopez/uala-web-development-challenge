import cn from "@/src/utils/cn";

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
        "p-3 text-foreground hover:text-primary transition-colors relative cursor-pointer",
        isActive && "text-primary",
        className
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
