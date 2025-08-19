import type { Filters } from "@/src/types/filters";
import { defaultFilters, filtersSchema } from "@/src/types/filters";
import { hasAnyActiveFilter } from "@/src/utils/filter-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate } = useSWRConfig();
  const [isInitialized, setIsInitialized] = useState(false);

  const form = useForm<Filters>({
    resolver: zodResolver(filtersSchema),
    defaultValues: defaultFilters,
  });

  // Function to update URL with filters
  const updateURL = useCallback(
    (filters: Filters) => {
      const params = new URLSearchParams(searchParams.toString());

      // Clear existing filters
      params.delete("paymentMethods");
      params.delete("dateFrom");
      params.delete("dateTo");
      params.delete("card");
      params.delete("installments");
      params.delete("amountMin");
      params.delete("amountMax");

      // Add active filters
      if (filters.paymentMethods.length > 0) {
        filters.paymentMethods.forEach((method) => {
          params.append("paymentMethods", method);
        });
      }

      if (filters.date.from) {
        params.set("dateFrom", filters.date.from);
      }

      if (filters.date.to) {
        params.set("dateTo", filters.date.to);
      }

      if (filters.card.length > 0) {
        filters.card.forEach((card) => {
          params.append("card", card);
        });
      }

      if (filters.installments.length > 0) {
        filters.installments.forEach((installment) => {
          params.append("installments", installment);
        });
      }

      if (filters.amount.min !== undefined) {
        params.set("amountMin", filters.amount.min.toString());
      }

      if (filters.amount.max !== undefined) {
        params.set("amountMax", filters.amount.max.toString());
      }

      // Update URL without reloading the page
      const newURL = params.toString()
        ? `?${params.toString()}`
        : window.location.pathname;

      router.replace(newURL, { scroll: false });
    },
    [router, searchParams]
  );

  // Function to load filters from URL
  const loadFiltersFromURL = useCallback(() => {
    const filters = { ...defaultFilters };

    // Payment methods
    const paymentMethods = searchParams.getAll("paymentMethods");
    if (paymentMethods.length > 0) {
      filters.paymentMethods = paymentMethods as (
        | "link"
        | "qr"
        | "mpos"
        | "pospro"
      )[];
    }

    // Dates
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    if (dateFrom || dateTo) {
      filters.date = {
        from: dateFrom || undefined,
        to: dateTo || undefined,
      };
    }

    // Cards
    const card = searchParams.getAll("card");
    if (card.length > 0) {
      filters.card = card as ("visa" | "mastercard" | "amex")[];
    }

    // Installments
    const installments = searchParams.get("installments");
    if (installments) {
      filters.installments = [installments as "1" | "2" | "3" | "6" | "12"];
    }

    // Amounts - Validate that they are valid numbers
    const amountMin = searchParams.get("amountMin");
    const amountMax = searchParams.get("amountMax");
    if (amountMin || amountMax) {
      const minValue = amountMin ? parseFloat(amountMin) : undefined;
      const maxValue = amountMax ? parseFloat(amountMax) : undefined;

      // Only include values if they are valid numbers, otherwise use undefined
      filters.amount = {
        min:
          minValue && !isNaN(minValue) && isFinite(minValue)
            ? minValue
            : undefined,
        max:
          maxValue && !isNaN(maxValue) && isFinite(maxValue)
            ? maxValue
            : undefined,
      };
    }

    return filters;
  }, [searchParams]);

  // Initialize filters from URL when component mounts
  useEffect(() => {
    if (!isInitialized) {
      const urlFilters = loadFiltersFromURL();
      form.reset(urlFilters);
      setIsInitialized(true);
    }
  }, [form, loadFiltersFromURL, isInitialized]);

  // Function to apply filters
  const applyFilters = useCallback(
    async (data: Filters) => {
      updateURL(data);
      // Make mutate of all transactions to refresh data
      await mutate("/api/me/transactions");
    },
    [updateURL, mutate]
  );

  // Function to clear all filters
  const clearAllFilters = useCallback(() => {
    form.reset(defaultFilters);
    updateURL(defaultFilters);
    // Make mutate of all transactions to refresh data
    mutate("/api/me/transactions");
  }, [form, updateURL, mutate]);

  // Function to check if there are active filters
  const hasActiveFilters = useCallback((filters: Filters) => {
    return hasAnyActiveFilter(filters);
  }, []);

  return {
    form,
    isInitialized,
    applyFilters,
    clearAllFilters,
    hasActiveFilters,
    currentFilters: form.watch(),
  };
}
