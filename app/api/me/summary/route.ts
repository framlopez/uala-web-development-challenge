import SummaryResponse from "@/src/types/responses/summary-response";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // NTH: Obtener la información desde la base de datos
    const mockData = {
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

    return NextResponse.json<SummaryResponse>(mockData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
