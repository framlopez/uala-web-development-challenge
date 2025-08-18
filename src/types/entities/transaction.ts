import PaymentMethod from "../payment-method";

interface Transaction {
  id: string;
  amount: number;
  card: "visa" | "mastercard" | "amex";
  installments: number;
  createdAt: string;
  updatedAt: string;
  paymentMethod: PaymentMethod;
}

export default Transaction;
