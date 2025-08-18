import type PaymentMethod from "@/src/types/payment-method";

export interface Transaction {
	id: string;
	amount: number;
	card: "visa" | "mastercard" | "amex";
	installments: number;
	createdAt: string;
	updatedAt: string;
	paymentMethod: PaymentMethod;
}

export interface CardOption {
	value: "visa" | "mastercard" | "amex";
	label: string;
}

export interface PaymentMethodOption {
	value: "link" | "qr" | "mpos" | "pospro";
	label: string;
}

export interface TransactionsMetadata {
	cards: CardOption[];
	paymentMethods: PaymentMethodOption[];
}

export interface TransactionsResponse {
	transactions: Transaction[];
	metadata: TransactionsMetadata;
}
