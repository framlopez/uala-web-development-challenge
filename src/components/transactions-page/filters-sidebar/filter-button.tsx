import { cn } from "@/src/shadcn/lib/utils";
import CloseIcon from "../../icons/close";

export default function FilterButton({
  id,
  checked,
  onCheckedChange,
  label,
  value,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (value: string) => void;
  label: string;
  value: string;
}) {
  return (
    <div className="relative text-[10px] text-uala-primary leading-none">
      {/* Checkbox oculto pero funcional */}
      <input
        id={id}
        className="sr-only"
        type="checkbox"
        checked={checked}
        onChange={() => onCheckedChange(value)}
      />

      {/* Botón visual que actúa como label */}
      <label
        className={cn(
          "border-2 border-uala-primary rounded-full p-3 flex items-center gap-1",
          checked && "bg-[#E0EDFF]"
        )}
        htmlFor={id}
        role="button"
      >
        <span className="py-1">{label}</span>
        {checked && (
          <button type="button" onClick={() => onCheckedChange(value)}>
            <CloseIcon className="size-4" />
          </button>
        )}
      </label>
    </div>
  );
}
