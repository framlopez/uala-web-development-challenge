import Transaction from "../entities/transaction";

interface TransactionsResponse {
  transactions: Transaction[];
  metadata: {
    cards: {
      value: "visa" | "mastercard" | "amex";
      label: string;
    }[];
    paymentMethods: {
      value: "link" | "qr" | "mpos" | "pospro";
      label: string;
    }[];
  };
}

export default TransactionsResponse;
