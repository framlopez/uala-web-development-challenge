import { cn } from "@/src/shadcn/lib/utils";

export default function ButtonIcon({
  className,
  onClick,
  children,
}: {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={cn(
        "p-3 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer",
        className
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
