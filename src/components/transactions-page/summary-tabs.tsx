"use client";

import { Skeleton } from "@/src/shadcn/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/src/shadcn/components/ui/tabs";
import Currency from "@/src/types/currency";
import fetcher from "@/src/utils/fetcher";
import formatPrice from "@/src/utils/format-price";
import { useState } from "react";
import useSWR from "swr";

enum Tab {
  Monthly = "monthly",
  Weekly = "weekly",
  Daily = "daily",
}

const TABS = [
  {
    id: "daily",
    label: "Diario",
    value: "daily",
  },
  {
    id: "weekly",
    label: "Semanal",
    value: "weekly",
  },
  {
    id: "monthly",
    label: "Mensual",
    value: "monthly",
  },
];

export default function SummaryTabs() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Weekly);

  const { data, isLoading, error } = useSWR("/api/me/summary", fetcher);

  // Obtener el totalAmount del tab seleccionado
  const selectedTotalAmount = data?.[activeTab]?.totalAmount || 0;

  // Formatear el precio
  const formattedTotalAmount = formatPrice(
    selectedTotalAmount,
    Currency.ARS,
    "es-AR"
  );

  return (
    <Tabs
      className="w-full"
      defaultValue={activeTab}
      onValueChange={(value) => setActiveTab(value as Tab)}
    >
      <TabsList className="grid grid-cols-3 w-full gap-2 items-start bg-transparent h-auto">
        {TABS.map((tab) => (
          <TabsTrigger
            className="w-full data-[state=active]:shadow-none flex flex-col data-[state=active]:bg-transparent data-[state=active]:text-uala-primary p-3 text-foreground hover:text-uala-primary transition-colors relative cursor-pointer"
            value={tab.value}
            key={tab.id}
          >
            {tab.label}
            {activeTab === tab.value && (
              <div className="size-2 rounded-full bg-uala-primary mx-auto mt-2.5" />
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="flex items-center justify-center">
        {isLoading ? (
          <Skeleton className="h-[34px] rounded-xl w-1/2" />
        ) : error ? (
          <div className="text-red-500 text-xs flex items-center h-[34px]">
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
      </div>
    </Tabs>
  );
}
