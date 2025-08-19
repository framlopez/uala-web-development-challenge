import type { Filters } from "@/src/types/filters";

/**
 * Checks if a specific filter is active
 */
function isFilterActive(filters: Filters, filterKey: keyof Filters): boolean {
  switch (filterKey) {
    case "paymentMethods":
      return filters.paymentMethods.length > 0;

    case "date":
      return Boolean(filters.date.from || filters.date.to);

    case "card":
      return filters.card.length > 0;

    case "installments":
      return filters.installments.length > 0;

    case "amount":
      // Helper function to validate if a value is a valid number
      const isValidNumber = (value: unknown): value is number => {
        return typeof value === "number" && !isNaN(value) && isFinite(value);
      };
      return (
        isValidNumber(filters.amount.min) || isValidNumber(filters.amount.max)
      );

    default:
      return false;
  }
}

/**
 * Checks if there are any active filters
 */
export function hasAnyActiveFilter(filters: Filters): boolean {
  return (
    isFilterActive(filters, "paymentMethods") ||
    isFilterActive(filters, "date") ||
    isFilterActive(filters, "card") ||
    isFilterActive(filters, "installments") ||
    isFilterActive(filters, "amount")
  );
}
