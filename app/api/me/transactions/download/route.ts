import TransactionsResponse from "@/src/types/responses/transactions-response";
import { CSVGenerator } from "@/src/utils/csv-generator";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Obtengo los filtros de fecha
    const fechaDesde = searchParams.get("fechaDesde");
    const fechaHasta = searchParams.get("fechaHasta");

    if (!fechaDesde || !fechaHasta) {
      return NextResponse.json(
        { error: "Fecha desde y hasta requeridas" },
        { status: 400 }
      );
    }

    // Validar formato de fecha
    // NTH: Hacer esto con zod
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fechaDesde) || !fechaRegex.test(fechaHasta)) {
      return NextResponse.json(
        { error: "Formato de fecha inválido. Formato: YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // NTH: Obtener la información filtrada desde la base de datos
    const response = await fetch(
      "https://uala-dev-challenge.s3.us-east-1.amazonaws.com/transactions.json"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TransactionsResponse = await response.json();

    // Aplicar filtros
    let filteredTransactions = data.transactions;

    // Filtro por fecha - ambas fechas están garantizadas por la validación anterior
    filteredTransactions = filteredTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const desde = new Date(fechaDesde);
      const hasta = new Date(fechaHasta);
      return transactionDate >= desde && transactionDate <= hasta;
    });

    // NTH: Falta aplicar un LIMIT para no sobrecargar el servidor

    // Preparo el contneido para la descarga
    const responseData = CSVGenerator.getCSV(filteredTransactions);

    return new NextResponse(responseData, {
      headers: CSVGenerator.getHeaders(),
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
