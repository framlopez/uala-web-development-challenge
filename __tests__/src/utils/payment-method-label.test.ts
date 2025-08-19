import PaymentMethod from "../../../src/types/payment-method";
import getPaymentMethodLabel from "../../../src/utils/payment-method-label";

describe("getPaymentMethodLabel", () => {
  it("debe retornar 'POS Pro' para PaymentMethod.POSPRO", () => {
    const result = getPaymentMethodLabel(PaymentMethod.POSPRO);
    expect(result).toBe("POS Pro");
  });

  it("debe retornar 'Link de pago' para PaymentMethod.LINK", () => {
    const result = getPaymentMethodLabel(PaymentMethod.LINK);
    expect(result).toBe("Link de pago");
  });

  it("debe retornar 'mPOS' para PaymentMethod.MPOS", () => {
    const result = getPaymentMethodLabel(PaymentMethod.MPOS);
    expect(result).toBe("mPOS");
  });

  it("debe retornar 'Código QR' para PaymentMethod.QR", () => {
    const result = getPaymentMethodLabel(PaymentMethod.QR);
    expect(result).toBe("Código QR");
  });

  it("debe retornar el valor original cuando no hay etiqueta definida", () => {
    // Simular un PaymentMethod que no está en el mapping
    const unknownPaymentMethod = "UNKNOWN_METHOD" as PaymentMethod;
    const result = getPaymentMethodLabel(unknownPaymentMethod);
    expect(result).toBe("UNKNOWN_METHOD");
  });

  it("debe retornar el valor original para PaymentMethod vacío", () => {
    const emptyPaymentMethod = "" as PaymentMethod;
    const result = getPaymentMethodLabel(emptyPaymentMethod);
    expect(result).toBe("");
  });
});
