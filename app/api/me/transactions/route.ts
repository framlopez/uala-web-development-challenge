import LIMIT from "@/src/constants/listing-limit";
import TransactionsResponse from "@/src/types/responses/transactions-response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Obtengo los filtros de selección múltiple
    const paymentMethods = searchParams.getAll("paymentMethods");
    const card = searchParams.getAll("card");
    const installments = searchParams.getAll("installments");

    // Obtengo los filtros de fecha
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Obtengo los filtros de precio
    const amountMin = searchParams.get("amountMin");
    const amountMax = searchParams.get("amountMax");

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
    if (paymentMethods.length > 0) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        paymentMethods.includes(transaction.paymentMethod)
      );
    }

    // Filtro por tarjeta
    if (card.length > 0) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        card.includes(transaction.card)
      );
    }

    // Filtro por cuotas
    if (installments.length > 0) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        installments.includes(transaction.installments.toString())
      );
    }

    // Filtro por monto
    if (amountMin || amountMax) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const min = amountMin ? parseFloat(amountMin) : 0;
        const max = amountMax ? parseFloat(amountMax) : Infinity;
        return transaction.amount >= min && transaction.amount <= max;
      });
    }

    // Filtro por fecha
    if (dateFrom || dateTo) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        const from = dateFrom ? new Date(dateFrom) : new Date(0);
        const to = dateTo ? new Date(dateTo) : new Date();
        return transactionDate >= from && transactionDate <= to;
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
