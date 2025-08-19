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
  // Usar directamente isActive en lugar de estado interno
  // para mantener sincronización con el estado real del filtro

  function handleClick() {
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
          checked={isActive}
          aria-label={text}
        />
      </div>
      <div className={cn(!isActive && "hidden")}>{children}</div>
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

  // Estado para controlar la visibilidad de cada filtro independientemente de sus valores
  const [filterVisibility, setFilterVisibility] = useState({
    date: false,
    amount: false,
    card: false,
    installments: false,
    paymentMethods: false,
  });

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
    // Solo aplicar filtros que estén activos (visibles) y limpiar valores NaN
    const activeFilters: Filters = {
      paymentMethods: filterVisibility.paymentMethods
        ? data.paymentMethods
        : [],
      card: filterVisibility.card ? data.card : [],
      installments: filterVisibility.installments ? data.installments : [],
      date: filterVisibility.date ? data.date : {},
      amount: filterVisibility.amount
        ? (() => {
            const amount = data.amount;
            // Validar que los valores sean números válidos
            const isValidNumber = (value: unknown): value is number => {
              return (
                typeof value === "number" && !isNaN(value) && isFinite(value)
              );
            };

            return {
              min: isValidNumber(amount.min) ? amount.min : undefined,
              max: isValidNumber(amount.max) ? amount.max : undefined,
            };
          })()
        : {},
    };

    applyFilters(activeFilters);
    onClose();
  };

  // Función para manejar el submit del formulario
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Obtener los valores actuales del formulario
    const formData = form.getValues();

    // Limpiar valores NaN antes de la validación
    const cleanedData = {
      ...formData,
      amount: {
        min:
          typeof formData.amount.min === "number" &&
          !isNaN(formData.amount.min) &&
          isFinite(formData.amount.min)
            ? formData.amount.min
            : undefined,
        max:
          typeof formData.amount.max === "number" &&
          !isNaN(formData.amount.max) &&
          isFinite(formData.amount.max)
            ? formData.amount.max
            : undefined,
      },
    };

    // Actualizar el formulario con los valores limpios
    form.reset(cleanedData);

    // Ahora sí, ejecutar onSubmit con los datos limpios
    onSubmit(cleanedData);
  };

  const handleClearAll = () => {
    clearAllFilters();
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
              onSubmit={handleFormSubmit}
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
                    const isCurrentlyActive = filterVisibility.date;
                    if (isCurrentlyActive) {
                      // Si está activo, desactivarlo
                      setFilterVisibility((prev) => ({
                        ...prev,
                        date: false,
                      }));
                      // Resetear completamente el filtro de fecha a valores por defecto
                      form.setValue("date", {
                        from: undefined,
                        to: undefined,
                      });
                      // También limpiar cualquier error de validación
                      form.clearErrors("date");
                      // Forzar la validación para asegurar que los valores sean correctos
                      form.trigger("date");
                    } else {
                      // Si está inactivo, activarlo
                      setFilterVisibility((prev) => ({ ...prev, date: true }));
                    }
                  }}
                  isActive={filterVisibility.date}
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
                    const isCurrentlyActive = filterVisibility.card;
                    if (isCurrentlyActive) {
                      // Si está activo, desactivarlo
                      setFilterVisibility((prev) => ({
                        ...prev,
                        card: false,
                      }));
                      // Limpiar completamente los campos del formulario
                      form.setValue("card", []);
                      // También limpiar cualquier error de validación
                      form.clearErrors("card");
                    } else {
                      // Si está inactivo, activarlo
                      setFilterVisibility((prev) => ({
                        ...prev,
                        card: true,
                      }));
                    }
                  }}
                  isActive={filterVisibility.card}
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
                    const isCurrentlyActive = filterVisibility.installments;
                    if (isCurrentlyActive) {
                      // Si está activo, desactivarlo
                      setFilterVisibility((prev) => ({
                        ...prev,
                        installments: false,
                      }));
                      // Limpiar completamente los campos del formulario
                      form.setValue("installments", []);
                      // También limpiar cualquier error de validación
                      form.clearErrors("installments");
                    } else {
                      // Si está inactivo, activarlo
                      setFilterVisibility((prev) => ({
                        ...prev,
                        installments: true,
                      }));
                    }
                  }}
                  isActive={filterVisibility.installments}
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
                    const isCurrentlyActive = filterVisibility.amount;
                    if (isCurrentlyActive) {
                      // Si está activo, desactivarlo
                      setFilterVisibility((prev) => ({
                        ...prev,
                        amount: false,
                      }));
                      // Resetear completamente el filtro de monto a valores por defecto
                      form.setValue("amount", {
                        min: undefined,
                        max: undefined,
                      });
                      // También limpiar cualquier error de validación
                      form.clearErrors("amount");
                      // Forzar la validación para asegurar que los valores sean correctos
                      form.trigger("amount");
                    } else {
                      // Si está inactivo, activarlo
                      setFilterVisibility((prev) => ({
                        ...prev,
                        amount: true,
                      }));
                    }
                  }}
                  isActive={filterVisibility.amount}
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
                    const isCurrentlyActive = filterVisibility.paymentMethods;
                    if (isCurrentlyActive) {
                      // Si está activo, desactivarlo
                      setFilterVisibility((prev) => ({
                        ...prev,
                        paymentMethods: false,
                      }));
                      // Limpiar completamente los campos del formulario
                      form.setValue("paymentMethods", []);
                      // También limpiar cualquier error de validación
                      form.clearErrors("paymentMethods");
                    } else {
                      // Si está inactivo, activarlo
                      setFilterVisibility((prev) => ({
                        ...prev,
                        paymentMethods: true,
                      }));
                    }
                  }}
                  isActive={filterVisibility.paymentMethods}
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
