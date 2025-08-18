"use client";

import Currency from "@/src/types/currency";
import fetcher from "@/src/utils/fetcher";
import formatPrice from "@/src/utils/format-price";
import { useState } from "react";
import useSWR from "swr";
import ButtonTab from "../cross/button-tab";

export default function SummaryTabs() {
  const { data, isLoading, error } = useSWR("/api/me/summary", fetcher);

  const [selectedTab, setSelectedTab] = useState<
    "daily" | "weekly" | "monthly"
  >("weekly");

  // Obtener el totalAmount del tab seleccionado
  const selectedTotalAmount = data?.[selectedTab]?.totalAmount || 0;

  // Formatear el precio
  const formattedTotalAmount = formatPrice(
    selectedTotalAmount,
    Currency.ARS,
    "es-AR"
  );

  const isMonthlyActive = selectedTab === "monthly";
  const isWeeklyActive = selectedTab === "weekly";
  const isDailyActive = selectedTab === "daily";

  return (
    <>
      <div className="grid grid-cols-3 w-full gap-2 items-start">
        <ButtonTab
          isActive={isDailyActive}
          onClick={() => setSelectedTab("daily")}
        >
          Diario
          {isDailyActive && (
            <div className="size-2 rounded-full bg-primary mx-auto mt-2.5" />
          )}
        </ButtonTab>
        <ButtonTab
          isActive={isWeeklyActive}
          onClick={() => setSelectedTab("weekly")}
        >
          Semanal
          {isWeeklyActive && (
            <div className="size-2 rounded-full bg-primary mx-auto mt-2.5" />
          )}
        </ButtonTab>
        <ButtonTab
          isActive={isMonthlyActive}
          onClick={() => setSelectedTab("monthly")}
        >
          Mensual
          {isMonthlyActive && (
            <div className="size-2 rounded-full bg-primary mx-auto mt-2.5" />
          )}
        </ButtonTab>
      </div>

      {isLoading ? (
        <div className="h-[34px] bg-[#DEE2EC] rounded-xl w-1/2 animate-pulse" />
      ) : error ? (
        <div className="text-red-500 text-xs leading-none flex items-center h-[34px]">
          <p>Hubo un error al cargar los datos</p>
        </div>
      ) : (
        <div className="flex items-baseline gap-1 text-[34px] leading-none font-extralight text-[#313643]">
          <span>{formattedTotalAmount.prefix}</span>
          <span>{formattedTotalAmount.symbol}</span>
          <span>
            {formattedTotalAmount.amount},
            <span className="text-[22px] font-normal">
              {formattedTotalAmount.decimals}
            </span>
          </span>
        </div>
      )}
    </>
  );
}
