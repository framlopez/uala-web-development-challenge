import Currency from "@/src/types/currency";
import formatPrice from "@/src/utils/format-price";

describe("formatPrice", () => {
  describe("Basic formatting", () => {
    it("should format positive price in USD", () => {
      const result = formatPrice(1234.56, Currency.USD, "en-US");
      expect(result.prefix).toBe("+");
      expect(result.symbol).toBe("U$S");
      expect(result.amount).toBe("1,235");
      expect(result.decimals).toBe("56");
    });

    it("should format positive price in ARS", () => {
      const result = formatPrice(1234.56, Currency.ARS, "es-AR");
      expect(result.prefix).toBe("+");
      expect(result.symbol).toBe("$");
      expect(result.amount).toBe("1.235");
      expect(result.decimals).toBe("56");
    });

    it("should format negative price in USD", () => {
      const result = formatPrice(-1234.56, Currency.USD, "en-US");
      expect(result.prefix).toBe("-");
      expect(result.symbol).toBe("U$S");
      expect(result.amount).toBe("1,235");
      expect(result.decimals).toBe("56");
    });

    it("should format negative price in ARS", () => {
      const result = formatPrice(-1234.56, Currency.ARS, "es-AR");
      expect(result.prefix).toBe("-");
      expect(result.symbol).toBe("$");
      expect(result.amount).toBe("1.235");
      expect(result.decimals).toBe("56");
    });

    it("should format zero price", () => {
      const result = formatPrice(0, Currency.USD, "en-US");
      expect(result.prefix).toBe("");
      expect(result.symbol).toBe("U$S");
      expect(result.amount).toBe("0");
      expect(result.decimals).toBe("00");
    });
  });

  describe("Decimal handling", () => {
    it("should handle prices without decimals", () => {
      const result = formatPrice(1000, Currency.USD, "en-US");
      expect(result.amount).toBe("1,000");
      expect(result.decimals).toBe("00");
    });

    it("should handle prices with exact decimals", () => {
      const result = formatPrice(1000.5, Currency.USD, "en-US");
      expect(result.amount).toBe("1,001");
      expect(result.decimals).toBe("50");
    });

    it("should round decimals correctly", () => {
      const result = formatPrice(1000.567, Currency.USD, "en-US");
      expect(result.amount).toBe("1,001");
      expect(result.decimals).toBe("57");
    });

    it("should handle very small decimals", () => {
      const result = formatPrice(1000.001, Currency.USD, "en-US");
      expect(result.amount).toBe("1,000");
      expect(result.decimals).toBe("00");
    });
  });

  describe("Locale-specific formatting", () => {
    it("should use commas for thousands separators in English", () => {
      const result = formatPrice(1234567, Currency.USD, "en-US");
      expect(result.amount).toBe("1,234,567");
    });

    it("should use dots for thousands separators in Argentine Spanish", () => {
      const result = formatPrice(1234567, Currency.ARS, "es-AR");
      expect(result.amount).toBe("1.234.567");
    });

    it("should use spaces for thousands separators in French", () => {
      const result = formatPrice(1234567, Currency.USD, "fr-FR");
      // The actual separator might be a non-breaking space (U+00A0) or regular space
      expect(result.amount).toMatch(/1[\s\u00A0]234[\s\u00A0]567/);
    });
  });

  describe("Currency symbols", () => {
    it("should use U$S for USD", () => {
      const result = formatPrice(100, Currency.USD, "en-US");
      expect(result.symbol).toBe("U$S");
    });

    it("should use $ for ARS", () => {
      const result = formatPrice(100, Currency.ARS, "es-AR");
      expect(result.symbol).toBe("$");
    });

    it("should use default symbol for undefined currencies", () => {
      const result = formatPrice(100, 999 as Currency, "en-US");
      expect(result.symbol).toBe("$");
    });
  });

  describe("Sign handling", () => {
    it("should use + for positive prices", () => {
      const result = formatPrice(100, Currency.USD, "en-US");
      expect(result.prefix).toBe("+");
    });

    it("should use - for negative prices", () => {
      const result = formatPrice(-100, Currency.USD, "en-US");
      expect(result.prefix).toBe("-");
    });

    it("should use empty string for zero price", () => {
      const result = formatPrice(0, Currency.USD, "en-US");
      expect(result.prefix).toBe("");
    });
  });

  describe("Edge cases", () => {
    it("should handle very large numbers", () => {
      const result = formatPrice(999999999.99, Currency.USD, "en-US");
      expect(result.amount).toBe("1,000,000,000");
      expect(result.decimals).toBe("99");
    });

    it("should handle very small numbers", () => {
      const result = formatPrice(0.001, Currency.USD, "en-US");
      expect(result.amount).toBe("0");
      expect(result.decimals).toBe("00");
    });

    it("should handle very small negative numbers", () => {
      const result = formatPrice(-0.001, Currency.USD, "en-US");
      expect(result.amount).toBe("0");
      expect(result.decimals).toBe("00");
    });
  });

  describe("Return object structure", () => {
    it("should return object with correct properties", () => {
      const result = formatPrice(1234.56, Currency.USD, "en-US");
      expect(result).toHaveProperty("prefix");
      expect(result).toHaveProperty("symbol");
      expect(result).toHaveProperty("amount");
      expect(result).toHaveProperty("decimals");
    });

    it("should return all properties as strings", () => {
      const result = formatPrice(1234.56, Currency.USD, "en-US");
      expect(typeof result.prefix).toBe("string");
      expect(typeof result.symbol).toBe("string");
      expect(typeof result.amount).toBe("string");
      expect(typeof result.decimals).toBe("string");
    });
  });
});
