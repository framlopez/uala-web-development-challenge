"use client";

import { Calendar } from "@/src/shadcn/components/ui/calendar";
import type { Filters } from "@/src/types/filters";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useFormContext } from "react-hook-form";

export default function FilterDate() {
  const { register, setValue, watch } = useFormContext<Filters>();
  const dateRange = watch("fecha");

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) return;

    if (range.from && range.to) {
      // Rango completo seleccionado
      setValue("fecha", {
        desde: range.from.toISOString(),
        hasta: range.to.toISOString(),
      });
    } else if (range.from) {
      // Solo fecha inicial
      setValue("fecha", {
        desde: range.from.toISOString(),
        hasta: undefined,
      });
    }
  };

  const clearDates = () => {
    setValue("fecha", { desde: undefined, hasta: undefined });
  };

  // Preparar fechas para el calendario de shadcn
  const fromDate = dateRange.desde ? new Date(dateRange.desde) : undefined;
  const toDate = dateRange.hasta ? new Date(dateRange.hasta) : undefined;

  const formatDate = (date: string | undefined) => {
    if (!date) return "";
    return format(new Date(date), "dd/MM/yyyy", { locale: es });
  };

  const selectedItems = [];
  if (dateRange.desde) {
    selectedItems.push({
      value: dateRange.desde,
      label: `Desde: ${formatDate(dateRange.desde)}`,
    });
  }
  if (dateRange.hasta) {
    selectedItems.push({
      value: dateRange.hasta,
      label: `Hasta: ${formatDate(dateRange.hasta)}`,
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

      {/* Botón para borrar fechas seleccionadas */}
      {(dateRange.desde || dateRange.hasta) && (
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

      {/* Campos ocultos para react-hook-form */}
      <input type="hidden" {...register("fecha.desde")} />
      <input type="hidden" {...register("fecha.hasta")} />
    </div>
  );
}
