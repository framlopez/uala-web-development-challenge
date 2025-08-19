"use client";

import { Calendar } from "@/src/shadcn/components/ui/calendar";
import type { Filters } from "@/src/types/filters";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useFormContext } from "react-hook-form";

export default function FilterDate() {
  const { register, setValue, watch } = useFormContext<Filters>();
  const dateRange = watch("date");

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) return;

    if (range.from && range.to) {
      // Complete range selected
      setValue("date", {
        from: range.from.toISOString(),
        to: range.to.toISOString(),
      });
    } else if (range.from) {
      // Only initial date
      setValue("date", {
        from: range.from.toISOString(),
        to: undefined,
      });
    }
  };

  const clearDates = () => {
    setValue("date", { from: undefined, to: undefined });
  };

  // Prepare dates for shadcn calendar
  const fromDate = dateRange?.from ? new Date(dateRange.from) : undefined;
  const toDate = dateRange?.to ? new Date(dateRange.to) : undefined;

  const formatDate = (date: string | undefined) => {
    if (!date) return "";
    return format(new Date(date), "dd/MM/yyyy", { locale: es });
  };

  const selectedItems = [];
  if (dateRange?.from) {
    selectedItems.push({
      value: dateRange.from,
      label: `Desde: ${formatDate(dateRange.from)}`,
    });
  }
  if (dateRange?.to) {
    selectedItems.push({
      value: dateRange.to,
      label: `Hasta: ${formatDate(dateRange.to)}`,
    });
  }

  return (
    <div className="space-y-2 mb-6">
      <div className="flex justify-center">
        <Calendar
          mode="range"
          selected={{
            from: fromDate,
            to: toDate,
          }}
          onSelect={handleSelect}
          numberOfMonths={1}
          locale={es}
          className="rounded-md border-0"
        />
      </div>

      {/* Button to clear selected dates */}
      {(dateRange?.from || dateRange?.to) && (
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={clearDates}
            className="px-4 py-2 text-sm font-medium text-uala-primary border border-uala-primary rounded-full hover:bg-uala-primary hover:text-white transition-colors duration-200"
          >
            Borrar
          </button>
        </div>
      )}

      {/* Hidden fields for react-hook-form */}
      <input type="hidden" {...register("date.from")} />
      <input type="hidden" {...register("date.to")} />
    </div>
  );
}
