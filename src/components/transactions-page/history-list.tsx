"use client";

import type { TransactionsResponse } from "@/app/api/me/transactions/types";
import EmptySearchSrc from "@/public/empty-search.png";
import LIMIT from "@/src/constants/listing-limit";
import { Skeleton } from "@/src/shadcn/components/ui/skeleton";
import fetcher from "@/src/utils/fetcher";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import HistoryListItem from "./history-list-item";

export default function HistoryList() {
  const searchParams = useSearchParams();

  // Construir la URL con los filtros actuales
  const queryString = searchParams.toString();
  const apiUrl = queryString
    ? `/api/me/transactions?${queryString}`
    : "/api/me/transactions";

  const { data, isLoading, error } = useSWR<TransactionsResponse>(
    apiUrl,
    fetcher
  );

  if (isLoading) {
    const skeletons = Array.from({ length: LIMIT });
    return (
      <div className="divide-y divide-[#DEE2EC]">
        {skeletons.map((_, index) => (
          <div
            className="flex items-center gap-2 w-full py-3 px-2 animate-pulse"
            key={`skeleton-${index}-${Date.now()}`}
          >
            <Skeleton className="size-8 rounded-xl flex-shrink-0" />
            <div className="flex flex-col gap-1 w-full">
              <Skeleton className="rounded-xl w-40 h-3.5" />
              <Skeleton className="rounded-xl w-30 h-3.5" />
            </div>
            <div className="flex flex-col gap-1 w-30">
              <Skeleton className="rounded-xl w-full h-3.5" />
              <Skeleton className="rounded-xl w-full h-3.5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <Image
          className="size-[72px] mx-auto"
          src={EmptySearchSrc}
          alt="Empty search"
        />
        <p className="text-red-500 mt-4 text-center text-sm">
          Hubo un error al cargar las transacciones.
        </p>
      </div>
    );
  }

  const emptyTransactions = data?.transactions.length === 0;
  if (emptyTransactions) {
    return (
      <div className="py-4">
        <Image
          className="size-[72px] mx-auto"
          src={EmptySearchSrc}
          alt="Empty search"
        />
        <p className="text-[#606882] mt-4 text-center text-sm">
          No hay resultados que mostrar. Podés probar usando los filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#DEE2EC]">
      {data?.transactions.map((transaction) => (
        <HistoryListItem transaction={transaction} key={transaction.id} />
      ))}
    </div>
  );
}
