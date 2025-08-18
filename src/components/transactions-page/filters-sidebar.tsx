"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useState } from "react";
import Button from "../cross/button";
import ArrowLeft from "../icons/arrow-left";
import CalendarIcon from "../icons/calendar";
import CardIcon from "../icons/card";
import CategoriesIcon from "../icons/categories";
import CommissionIcon from "../icons/commission";
import ProgramDepositIcon from "../icons/program-deposit";

function FilterItem({
  icon: Icon,
  text,
  isActive,
  onClick,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Disclosure>
      <div className="flex items-center justify-between py-3 px-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Icon className="size-6" />
          <span>{text}</span>
        </div>
        <DisclosureButton>
          <button
            onClick={onClick}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isActive ? "bg-gray-800" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </DisclosureButton>
      </div>
      <DisclosurePanel>{children}</DisclosurePanel>
    </Disclosure>
  );
}

export default function FiltersSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [filters, setFilters] = useState({
    fecha: false,
    tarjeta: false,
    cuotas: false,
    monto: false,
    metodosCobro: false,
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearAllFilters = () => {
    setFilters({
      fecha: false,
      tarjeta: false,
      cuotas: false,
      monto: false,
      metodosCobro: false,
    });
  };

  const applyFilters = () => {
    // Aquí implementarías la lógica para aplicar los filtros
    console.log("Aplicando filtros:", filters);
    onClose();
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
        className={`fixed p-12 w-xl top-0 right-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 text-primary" />
          </button>
          <span className="font-bold text-lg text-[#3A3A3A]">Filtros</span>
        </div>

        {/* Contenido de filtros */}
        <div className="mt-12 flex-1">
          <div className="flex items-center justify-between py-4 mb-4">
            <span className="font-bold text-lg text-[#3A3A3A]">
              Todos los filtros
            </span>
            <Button
              className="text-[#B7BFD3] text-lg"
              onClick={clearAllFilters}
              disabled={true}
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
              isActive={filters.fecha}
              onClick={() => toggleFilter("fecha")}
            >
              Contenido!!
            </FilterItem>

            {/* Filtro de Tarjeta */}
            <FilterItem
              icon={CardIcon}
              text="Tarjeta"
              isActive={filters.tarjeta}
              onClick={() => toggleFilter("tarjeta")}
            >
              Contenido!!
            </FilterItem>

            {/* Filtro de Cuotas */}
            <FilterItem
              icon={ProgramDepositIcon}
              text="Cuotas"
              isActive={filters.cuotas}
              onClick={() => toggleFilter("cuotas")}
            >
              Contenido!!
            </FilterItem>

            {/* Filtro de Monto */}
            <FilterItem
              icon={CommissionIcon}
              text="Monto"
              isActive={filters.monto}
              onClick={() => toggleFilter("monto")}
            >
              Contenido!!
            </FilterItem>

            {/* Filtro de Métodos de Cobro */}
            <FilterItem
              icon={CategoriesIcon}
              text="Métodos de cobro"
              isActive={filters.metodosCobro}
              onClick={() => toggleFilter("metodosCobro")}
            >
              Contenido!!
            </FilterItem>
          </div>
        </div>

        {/* Footer con botón de aplicar */}
        <div className="mt-auto">
          <Button
            className="w-full bg-primary text-white rounded-full text-lg justify-center hover:bg-primary/90"
            onClick={applyFilters}
          >
            Aplicar filtros
          </Button>
        </div>
      </div>
    </>
  );
}
