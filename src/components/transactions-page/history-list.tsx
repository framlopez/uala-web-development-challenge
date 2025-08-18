"use client";

import type { TransactionsResponse } from "@/app/api/me/transactions/types";
import EmptySearchSrc from "@/public/empty-search.png";
import LIMIT from "@/src/constants/listing-limit";
import fetcher from "@/src/utils/fetcher";
import Image from "next/image";
import useSWR from "swr";
import HistoryListItem from "./history-list-item";
import HistoryListItemSkeleton from "./history-list-item-skeleton";

export default function HistoryList() {
	const { data, isLoading, error } = useSWR<TransactionsResponse>(
		"/api/me/transactions",
		fetcher,
	);

	if (isLoading) {
		const skeletons = Array.from({ length: LIMIT });
		return (
			<div className="divide-y divide-[#DEE2EC]">
				{skeletons.map((_, index) => (
					<HistoryListItemSkeleton key={`skeleton-${index}-${Date.now()}`} />
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
