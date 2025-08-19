// Opciones para filtros de métodos de cobro
export const PAYMENT_METHOD_OPTIONS = [
  { value: "link", label: "Link de pago" },
  { value: "qr", label: "Código QR" },
  { value: "mpos", label: "mPOS" },
  { value: "pospro", label: "POS Pro" },
] as const;

// Opciones para filtros de tarjeta
export const CARD_OPTIONS = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex", label: "Amex" },
] as const;

// Opciones para filtros de cuotas
export const INSTALLMENT_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "6", label: "6" },
  { value: "12", label: "12" },
] as const;

// Configuración para filtros de monto
export const AMOUNT_FILTER_CONFIG = {
  min: 0,
  max: 10000,
};

export const DATE_FILTER_CONFIG = {
  minDate: new Date(2020, 0, 1),
  maxDate: new Date(),
};

export const INSTALLMENTS_FILTER_CONFIG = {
  min: 1,
  max: 24,
};

export const PAYMENT_METHODS = [
  "credit_card",
  "debit_card",
  "transfer",
  "cash",
  "digital_wallet",
] as const;

export const CATEGORIES = [
  "food",
  "transport",
  "entertainment",
  "shopping",
  "health",
  "education",
  "utilities",
  "other",
] as const;

// Días de la semana en español
export const WEEKDAYS_ES = [
  "Dom",
  "Lu",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
] as const;

// Tipos derivados de las opciones
export type PaymentMethodValue =
  (typeof PAYMENT_METHOD_OPTIONS)[number]["value"];
export type CardValue = (typeof CARD_OPTIONS)[number]["value"];
export type InstallmentValue = (typeof INSTALLMENT_OPTIONS)[number]["value"];
