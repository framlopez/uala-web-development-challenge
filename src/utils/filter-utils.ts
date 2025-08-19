import type { Filters } from "@/src/types/filters";

/**
 * Verifica si un filtro específico está activo
 */
function isFilterActive(filters: Filters, filterKey: keyof Filters): boolean {
  switch (filterKey) {
    case "metodosCobro":
      return filters.metodosCobro.length > 0;

    case "fecha":
      return Boolean(filters.fecha.desde || filters.fecha.hasta);

    case "tarjeta":
      return filters.tarjeta.length > 0;

    case "cuotas":
      return filters.cuotas.length > 0;

    case "monto":
      // Función helper para validar si un valor es un número válido
      const isValidNumber = (value: unknown): value is number => {
        return typeof value === "number" && !isNaN(value) && isFinite(value);
      };
      return (
        isValidNumber(filters.monto.min) || isValidNumber(filters.monto.max)
      );

    default:
      return false;
  }
}

/**
 * Verifica si hay algún filtro activo
 */
export function hasAnyActiveFilter(filters: Filters): boolean {
  return (
    isFilterActive(filters, "metodosCobro") ||
    isFilterActive(filters, "fecha") ||
    isFilterActive(filters, "tarjeta") ||
    isFilterActive(filters, "cuotas") ||
    isFilterActive(filters, "monto")
  );
}
