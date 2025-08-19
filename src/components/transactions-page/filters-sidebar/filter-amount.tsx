"use client";

import { AMOUNT_FILTER_CONFIG } from "@/src/constants/filter-options";
import type { Filters } from "@/src/types/filters";
import { useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function FilterAmount() {
  const { register, setValue, watch } = useFormContext<Filters>();
  const amount = watch("amount") || { min: undefined, max: undefined };

  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Helper function to validate if a value is a valid number
  const isValidNumber = (value: unknown): value is number => {
    return typeof value === "number" && !isNaN(value) && isFinite(value);
  };

  const minValue = isValidNumber(amount.min)
    ? amount.min
    : AMOUNT_FILTER_CONFIG.min;
  const maxValue = isValidNumber(amount.max)
    ? amount.max
    : AMOUNT_FILTER_CONFIG.max;

  const leftPercent = useMemo(
    () =>
      isValidNumber(amount.min)
        ? ((amount.min - AMOUNT_FILTER_CONFIG.min) /
            (AMOUNT_FILTER_CONFIG.max - AMOUNT_FILTER_CONFIG.min)) *
          100
        : 0,
    [amount.min]
  );
  const rightPercent = useMemo(
    () =>
      isValidNumber(amount.max)
        ? 100 -
          ((amount.max - AMOUNT_FILTER_CONFIG.min) /
            (AMOUNT_FILTER_CONFIG.max - AMOUNT_FILTER_CONFIG.min)) *
            100
        : 0,
    [amount.max]
  );

  const handleMinChange = (value: number) => {
    const clamped = Math.min(
      Math.max(value, AMOUNT_FILTER_CONFIG.min),
      maxValue
    );
    setValue("amount", { ...amount, min: clamped });
  };

  const handleMaxChange = (value: number) => {
    const clamped = Math.max(
      Math.min(value, AMOUNT_FILTER_CONFIG.max),
      minValue
    );
    setValue("amount", { ...amount, max: clamped });
  };

  const resetMin = () => setValue("amount", { ...amount, min: undefined });
  const resetMax = () => setValue("amount", { ...amount, max: undefined });

  const handleMouseDown = (handle: "min" | "max") => {
    setIsDragging(handle);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    const value = Math.round(
      (percent / 100) * (AMOUNT_FILTER_CONFIG.max - AMOUNT_FILTER_CONFIG.min) +
        AMOUNT_FILTER_CONFIG.min
    );

    if (isDragging === "min") {
      handleMinChange(value);
    } else {
      handleMaxChange(value);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  return (
    <div className="space-y-2 mb-6">
      {/* Double range slider */}
      <div
        ref={sliderRef}
        className="relative w-full pt-8 pb-2"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="h-2 rounded-full bg-blue-100" />
        <div
          className="absolute left-0 right-0 top-8 h-2 rounded-full bg-uala-primary"
          style={{
            clipPath: `inset(0 ${rightPercent}% 0 ${leftPercent}%)`,
            display:
              isValidNumber(amount.min) || isValidNumber(amount.max)
                ? "block"
                : "none",
          }}
        />

        {/* Min handle */}
        <div
          className="absolute top-6 size-5 bg-uala-primary border-2 border-uala-primary rounded-full cursor-pointer transform -translate-x-2"
          style={{ left: `${leftPercent}%` }}
          onMouseDown={() => handleMouseDown("min")}
        />

        {/* Max handle */}
        <div
          className="absolute top-6 size-5 bg-uala-primary border-2 border-uala-primary rounded-full cursor-pointer transform -translate-x-2"
          style={{
            left: `${isValidNumber(amount.max) ? 100 - rightPercent : 100}%`,
          }}
          onMouseDown={() => handleMouseDown("max")}
        />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-uala-primary font-semibold">
          ${maxValue}
        </div>
      </div>

      {/* Min and max amount inputs */}
      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-2xl px-4 py-1 outline-1 outline-uala-primary">
          <label className="block text-[10px] text-[#606882]">
            Monto mínimo
          </label>
          <div className="flex items-center">
            <span>$</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={isValidNumber(amount.min) ? amount.min.toString() : ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") return resetMin();
                const numVal = Number(val);
                if (!isNaN(numVal)) {
                  handleMinChange(numVal);
                }
              }}
              placeholder="0"
              className="block w-full focus:outline-none"
            />
          </div>
        </div>

        <div />

        <div className="rounded-2xl px-4 py-1 outline-1 outline-uala-primary">
          <label className="block text-[10px] text-[#606882]">
            Monto máximo
          </label>
          <div className="flex items-center">
            <span>$</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={isValidNumber(amount.max) ? amount.max.toString() : ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") return resetMax();
                const numVal = Number(val);
                if (!isNaN(numVal)) {
                  handleMaxChange(numVal);
                }
              }}
              placeholder="0"
              className="block w-full focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Hidden fields for RHF */}
      <input
        type="hidden"
        {...register("amount.min", { valueAsNumber: true })}
      />
      <input
        type="hidden"
        {...register("amount.max", { valueAsNumber: true })}
      />
    </div>
  );
}
