"use client";

import { useFilters } from "@/src/hooks/use-filters";
import { Switch } from "@/src/shadcn/components/ui/switch";
import { cn } from "@/src/shadcn/lib/utils";
import type { Filters } from "@/src/types/filters";
import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import Button from "../../cross/button";
import ArrowLeft from "../../icons/arrow-left";
import CalendarIcon from "../../icons/calendar";
import CardIcon from "../../icons/card";
import CategoriesIcon from "../../icons/categories";
import CommissionIcon from "../../icons/commission";
import ProgramDepositIcon from "../../icons/program-deposit";
import FilterAmount from "./filter-amount";
import FilterCards from "./filter-cards";
import FilterDate from "./filter-date";
import FilterInstallments from "./filter-installments";
import FilterMethods from "./filter-methods";

function FilterItem({
  icon: Icon,
  text,
  onClick,
  children,
  isActive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  onClick: () => void;
  children: React.ReactNode;
  isActive: boolean;
}) {
  const [isChecked, setIsChecked] = useState(isActive);

  // Sincronizar el estado del switch cuando cambie isActive
  useEffect(() => {
    setIsChecked(isActive);
  }, [isActive]);

  function handleClick() {
    setIsChecked(!isChecked);
    onClick();
  }

  return (
    <div>
      <div className="flex w-full items-center justify-between py-3 px-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Icon className="size-6" />
          <span>{text}</span>
        </div>
        <Switch
          className="data-[state=checked]:bg-uala-primary cursor-pointer data-[state=unchecked]:bg-[#606882] p-1 w-10 h-6"
          onCheckedChange={handleClick}
          checked={isChecked}
        />
      </div>
      <div className={cn(!isChecked && "hidden")}>{children}</div>
    </div>
  );
}

export default function FiltersSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    form,
    applyFilters,
    clearAllFilters,
    hasActiveFilters,
    currentFilters,
  } = useFilters();

  // Bloquear/desbloquear scroll del body cuando el sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const onSubmit = (data: Filters) => {
    applyFilters(data);
    onClose();
  };

  const handleClearAll = () => {
    clearAllFilters();
  };

  // Función para verificar si un filtro específico está activo
  const isFilterActive = (filterType: keyof typeof currentFilters): boolean => {
    const filter = currentFilters[filterType];

    if (filterType === "fecha") {
      const fechaFilter = filter as { desde?: string; hasta?: string };
      return Boolean(fechaFilter.desde || fechaFilter.hasta);
    }

    if (filterType === "monto") {
      const montoFilter = filter as { min?: number; max?: number };
      return montoFilter.min !== undefined || montoFilter.max !== undefined;
    }

    if (Array.isArray(filter)) {
      return filter.length > 0;
    }

    return false;
  };

  return (
    <>
      {/* Overlay de fondo */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-white/80 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed w-full lg:w-xl top-0 right-0 h-full bg-[#fafafa] shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header fijo */}
        <div className="flex-shrink-0 p-12 pb-6">
          <div className="flex items-center gap-6">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 text-uala-primary" />
            </button>
            <span className="font-bold text-lg text-[#3A3A3A]">Filtros</span>
          </div>
        </div>

        {/* Contenido de filtros con scroll */}
        <div className="flex-1 overflow-y-auto px-12">
          <FormProvider {...form}>
            <form
              id="filters-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="h-full"
            >
              <div className="flex items-center justify-between py-4 mb-4">
                <span className="font-bold text-lg text-[#3A3A3A]">
                  Todos los filtros
                </span>
                <Button
                  type="button"
                  className="text-[#B7BFD3] text-lg"
                  onClick={handleClearAll}
                  disabled={!hasActiveFilters(currentFilters)}
                >
                  Limpiar
                </Button>
              </div>

              {/* Lista de filtros */}
              <div className="flex flex-col mt-2 text-[#313643]">
                {/* Filtro de Fecha */}
                <FilterItem
                  icon={CalendarIcon}
                  text="Fecha"
                  onClick={() => {
                    form.setValue("fecha", {
                      desde: undefined,
                      hasta: undefined,
                    });
                  }}
                  isActive={isFilterActive("fecha")}
                >
                  <div className="p-4">
                    <FilterDate />
                  </div>
                </FilterItem>

                {/* Filtro de Tarjeta */}
                <FilterItem
                  icon={CardIcon}
                  text="Tarjeta"
                  onClick={() => {
                    form.setValue("tarjeta", []);
                  }}
                  isActive={isFilterActive("tarjeta")}
                >
                  <div className="p-4">
                    <FilterCards />
                  </div>
                </FilterItem>

                {/* Filtro de Cuotas */}
                <FilterItem
                  icon={ProgramDepositIcon}
                  text="Cuotas"
                  onClick={() => {
                    form.setValue("cuotas", []);
                  }}
                  isActive={isFilterActive("cuotas")}
                >
                  <div className="p-4">
                    <FilterInstallments />
                  </div>
                </FilterItem>

                {/* Filtro de Monto */}
                <FilterItem
                  icon={CommissionIcon}
                  text="Monto"
                  onClick={() => {
                    form.setValue("monto", { min: undefined, max: undefined });
                  }}
                  isActive={isFilterActive("monto")}
                >
                  <div className="p-4">
                    <FilterAmount />
                  </div>
                </FilterItem>

                {/* Filtro de Métodos de Cobro */}
                <FilterItem
                  icon={CategoriesIcon}
                  text="Métodos de cobro"
                  onClick={() => {
                    form.setValue("metodosCobro", []);
                  }}
                  isActive={isFilterActive("metodosCobro")}
                >
                  <div className="p-4">
                    <FilterMethods />
                  </div>
                </FilterItem>
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Footer fijo */}
        <div className="flex-shrink-0 p-12 pt-6 bg-[#fafafa] border-t border-gray-100">
          <Button
            type="submit"
            form="filters-form"
            className="w-full bg-uala-primary text-white rounded-full text-lg justify-center hover:bg-uala-primary/90"
          >
            Aplicar filtros
          </Button>
        </div>
      </div>
    </>
  );
}
