import { NextResponse } from "next/server";
import type { SummaryResponse } from "./types";

export async function GET() {
	try {
		// Datos hardcodeados según los requerimientos
		const summaryData: SummaryResponse = {
			daily: {
				totalAmount: 5000,
			},
			weekly: {
				totalAmount: 35000,
			},
			monthly: {
				totalAmount: 140000,
			},
		};

		return NextResponse.json(summaryData, { status: 200 });
	} catch (error) {
		console.error("Error generating summary:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
