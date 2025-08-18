import LIMIT from "@/src/constants/listing-limit";
import { NextResponse } from "next/server";
import type { TransactionsResponse } from "./types";

export async function GET() {
	try {
		const response = await fetch(
			"https://uala-dev-challenge.s3.us-east-1.amazonaws.com/transactions.json",
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: TransactionsResponse = await response.json();

		// Limitar las transacciones a un máximo de 25
		const limitedTransactions = data.transactions.slice(0, LIMIT);

		const limitedResponse: TransactionsResponse = {
			...data,
			transactions: limitedTransactions,
		};

		return NextResponse.json(limitedResponse, { status: 200 });
	} catch (error) {
		console.error("Error fetching transactions:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
