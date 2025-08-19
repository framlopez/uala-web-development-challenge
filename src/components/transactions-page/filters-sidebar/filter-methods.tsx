"use client";

import { PAYMENT_METHOD_OPTIONS } from "@/src/constants/filter-options";
import type { Filters } from "@/src/types/filters";
import { useFormContext } from "react-hook-form";
import FilterButton from "./filter-button";

export default function FilterMethods() {
  const { watch, setValue } = useFormContext<Filters>();
  const selectedMethods = watch("paymentMethods");

  // Ensure selectedMethods is always an array
  const safeSelectedMethods = Array.isArray(selectedMethods)
    ? selectedMethods
    : [];

  const toggleMethod = (
    method: (typeof PAYMENT_METHOD_OPTIONS)[number]["value"]
  ) => {
    const currentMethods = [...safeSelectedMethods];
    const methodIndex = currentMethods.indexOf(method);

    if (methodIndex > -1) {
      currentMethods.splice(methodIndex, 1);
    } else {
      currentMethods.push(method);
    }

    setValue("paymentMethods", currentMethods);
  };

  return (
    <div className="flex gap-3 mb-6">
      {PAYMENT_METHOD_OPTIONS.map((option) => {
        const isSelected = safeSelectedMethods.includes(option.value);

        return (
          <FilterButton
            id={`method-${option.value}`}
            checked={isSelected}
            onCheckedChange={() => toggleMethod(option.value)}
            label={option.label}
            value={option.value}
            key={option.value}
          />
        );
      })}
    </div>
  );
}
