import {
  defaultFilters,
  filtersSchema,
  type Filters,
} from "@/src/types/filters";
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

  // Función para actualizar la URL con los filtros
  const updateURL = useCallback(
    (filters: Filters) => {
      const params = new URLSearchParams(searchParams.toString());

      // Limpiar filtros existentes
      params.delete("metodosCobro");
      params.delete("fechaDesde");
      params.delete("fechaHasta");
      params.delete("tarjeta");
      params.delete("cuotas");
      params.delete("montoMin");
      params.delete("montoMax");

      // Agregar filtros activos
      if (filters.metodosCobro.length > 0) {
        filters.metodosCobro.forEach((method) => {
          params.append("metodosCobro", method);
        });
      }

      if (filters.fecha.desde) {
        params.set("fechaDesde", filters.fecha.desde);
      }

      if (filters.fecha.hasta) {
        params.set("fechaHasta", filters.fecha.hasta);
      }

      if (filters.tarjeta.length > 0) {
        filters.tarjeta.forEach((card) => {
          params.append("tarjeta", card);
        });
      }

      if (filters.cuotas.length > 0) {
        filters.cuotas.forEach((cuota) => {
          params.append("cuotas", cuota);
        });
      }

      if (filters.monto.min !== undefined) {
        params.set("montoMin", filters.monto.min.toString());
      }

      if (filters.monto.max !== undefined) {
        params.set("montoMax", filters.monto.max.toString());
      }

      // Actualizar URL sin recargar la página
      const newURL = params.toString()
        ? `?${params.toString()}`
        : window.location.pathname;

      router.replace(newURL, { scroll: false });
    },
    [router, searchParams]
  );

  // Función para cargar filtros desde la URL
  const loadFiltersFromURL = useCallback(() => {
    const filters: Filters = { ...defaultFilters };

    // Métodos de cobro
    const metodosCobro = searchParams.getAll("metodosCobro");
    if (metodosCobro.length > 0) {
      filters.metodosCobro = metodosCobro as (
        | "link"
        | "qr"
        | "mpos"
        | "pospro"
      )[];
    }

    // Fechas
    const fechaDesde = searchParams.get("fechaDesde");
    const fechaHasta = searchParams.get("fechaHasta");
    if (fechaDesde || fechaHasta) {
      filters.fecha = {
        desde: fechaDesde || undefined,
        hasta: fechaHasta || undefined,
      };
    }

    // Tarjetas
    const tarjeta = searchParams.getAll("tarjeta");
    if (tarjeta.length > 0) {
      filters.tarjeta = tarjeta as ("visa" | "mastercard" | "amex")[];
    }

    // Cuotas
    const cuotas = searchParams.get("cuotas");
    if (cuotas) {
      filters.cuotas = [cuotas as "1" | "2" | "3" | "6" | "12"];
    }

    // Montos
    const montoMin = searchParams.get("montoMin");
    const montoMax = searchParams.get("montoMax");
    if (montoMin || montoMax) {
      filters.monto = {
        min: montoMin ? parseFloat(montoMin) : undefined,
        max: montoMax ? parseFloat(montoMax) : undefined,
      };
    }

    return filters;
  }, [searchParams]);

  // Inicializar filtros desde URL al montar el componente
  useEffect(() => {
    if (!isInitialized) {
      const urlFilters = loadFiltersFromURL();
      form.reset(urlFilters);
      setIsInitialized(true);
    }
  }, [form, loadFiltersFromURL, isInitialized]);

  // Función para aplicar filtros
  const applyFilters = useCallback(
    async (data: Filters) => {
      updateURL(data);
      // Hacer mutate de todas las transacciones para refrescar los datos
      await mutate("/api/me/transactions");
    },
    [updateURL, mutate]
  );

  // Función para limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    form.reset(defaultFilters);
    updateURL(defaultFilters);
    // Hacer mutate de todas las transacciones para refrescar los datos
    mutate("/api/me/transactions");
  }, [form, updateURL, mutate]);

  // Función para verificar si hay filtros activos
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
