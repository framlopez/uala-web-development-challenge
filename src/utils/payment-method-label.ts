import PaymentMethod from "../types/payment-method";

const paymentMethodLabels = {
	[PaymentMethod.POSPRO]: "POS Pro",
	[PaymentMethod.LINK]: "Link de pago",
	[PaymentMethod.MPOS]: "mPOS",
	[PaymentMethod.QR]: "Código QR",
};

export default function getPaymentMethodLabel(paymentMethod: PaymentMethod) {
	return paymentMethodLabels[paymentMethod] || paymentMethod;
}
