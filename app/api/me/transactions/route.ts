import LIMIT from "@/src/constants/listing-limit";
import TransactionsResponse from "@/src/types/responses/transactions-response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Obtengo los filtros de selección múltiple
    const metodosCobro = searchParams.getAll("metodosCobro");
    const tarjeta = searchParams.getAll("tarjeta");
    const cuotas = searchParams.getAll("cuotas");

    // Obtengo los filtros de fecha
    const fechaDesde = searchParams.get("fechaDesde");
    const fechaHasta = searchParams.get("fechaHasta");

    // Obtengo los filtros de precio
    const montoMin = searchParams.get("montoMin");
    const montoMax = searchParams.get("montoMax");

    // NTH: Falta validar que el formato de los filtros sea correcto
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

    // Filtro por métodos de cobro
    if (metodosCobro.length > 0) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        metodosCobro.includes(transaction.paymentMethod)
      );
    }

    // Filtro por tarjeta
    if (tarjeta.length > 0) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        tarjeta.includes(transaction.card)
      );
    }

    // Filtro por cuotas
    if (cuotas.length > 0) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        cuotas.includes(transaction.installments.toString())
      );
    }

    // Filtro por monto
    if (montoMin || montoMax) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const min = montoMin ? parseFloat(montoMin) : 0;
        const max = montoMax ? parseFloat(montoMax) : Infinity;
        return transaction.amount >= min && transaction.amount <= max;
      });
    }

    // Filtro por fecha
    if (fechaDesde || fechaHasta) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        const desde = fechaDesde ? new Date(fechaDesde) : new Date(0);
        const hasta = fechaHasta ? new Date(fechaHasta) : new Date();
        return transactionDate >= desde && transactionDate <= hasta;
      });
    }

    // Limito las transacciones a un máximo de 25
    const limitedTransactions = filteredTransactions.slice(0, LIMIT);

    return NextResponse.json<TransactionsResponse>({
      transactions: limitedTransactions,
      metadata: data.metadata,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
