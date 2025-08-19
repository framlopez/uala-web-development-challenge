"use client";

import { INSTALLMENT_OPTIONS } from "@/src/constants/filter-options";
import type { Filters } from "@/src/types/filters";
import { useFormContext } from "react-hook-form";
import FilterButton from "./filter-button";

export default function FilterInstallments() {
  const { watch, setValue } = useFormContext<Filters>();
  const selectedInstallments = watch("cuotas");

  // Asegurar que selectedInstallments siempre sea un array
  const safeSelectedInstallments = Array.isArray(selectedInstallments)
    ? selectedInstallments
    : [];

  const toggleInstallment = (
    installment: (typeof INSTALLMENT_OPTIONS)[number]["value"]
  ) => {
    const currentInstallments = [...safeSelectedInstallments];
    const installmentIndex = currentInstallments.indexOf(installment);

    if (installmentIndex > -1) {
      currentInstallments.splice(installmentIndex, 1);
    } else {
      currentInstallments.push(installment);
    }

    setValue("cuotas", currentInstallments);
  };

  return (
    <div className="flex gap-3 mb-6">
      {INSTALLMENT_OPTIONS.map((option) => {
        const isSelected = safeSelectedInstallments.includes(option.value);

        return (
          <FilterButton
            id={`installment-${option.value}`}
            checked={isSelected}
            onCheckedChange={() => toggleInstallment(option.value)}
            label={option.label}
            value={option.value}
            key={option.value}
          />
        );
      })}
    </div>
  );
}
