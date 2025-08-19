import Currency from "../../../src/types/currency";
import formatPrice from "../../../src/utils/format-price";

describe("formatPrice", () => {
  describe("formateo básico de precios", () => {
    it("debe formatear precio positivo en USD", () => {
      const result = formatPrice(1234.56, Currency.USD, "en-US");

      expect(result).toEqual({
        prefix: "+",
        symbol: "U$S",
        amount: "1,235",
        decimals: "56",
      });
    });

    it("debe formatear precio positivo en ARS", () => {
      const result = formatPrice(5678.9, Currency.ARS, "es-AR");

      expect(result).toEqual({
        prefix: "+",
        symbol: "$",
        amount: "5.679",
        decimals: "90",
      });
    });

    it("debe formatear precio negativo en USD", () => {
      const result = formatPrice(-987.65, Currency.USD, "en-US");

      expect(result).toEqual({
        prefix: "-",
        symbol: "U$S",
        amount: "988",
        decimals: "65",
      });
    });

    it("debe formatear precio negativo en ARS", () => {
      const result = formatPrice(-123.45, Currency.ARS, "es-AR");

      expect(result).toEqual({
        prefix: "-",
        symbol: "$",
        amount: "123",
        decimals: "45",
      });
    });

    it("debe formatear precio cero", () => {
      const result = formatPrice(0, Currency.USD, "en-US");

      expect(result).toEqual({
        prefix: "",
        symbol: "U$S",
        amount: "0",
        decimals: "00",
      });
    });
  });

  describe("manejo de decimales", () => {
    it("debe manejar precios sin decimales", () => {
      const result = formatPrice(1000, Currency.USD, "en-US");

      expect(result).toEqual({
        prefix: "+",
        symbol: "U$S",
        amount: "1,000",
        decimals: "00",
      });
    });

    it("debe manejar precios con decimales exactos", () => {
      const result = formatPrice(99.99, Currency.ARS, "es-AR");

      expect(result).toEqual({
        prefix: "+",
        symbol: "$",
        amount: "100",
        decimals: "99",
      });
    });

    it("debe redondear decimales correctamente", () => {
      const result = formatPrice(123.456, Currency.USD, "en-US");

      expect(result).toEqual({
        prefix: "+",
        symbol: "U$S",
        amount: "123",
        decimals: "46",
      });
    });

    it("debe manejar decimales muy pequeños", () => {
      const result = formatPrice(0.01, Currency.ARS, "es-AR");

      expect(result).toEqual({
        prefix: "+",
        symbol: "$",
        amount: "0",
        decimals: "01",
      });
    });
  });

  describe("separadores de miles según locale", () => {
    it("debe usar comas para separadores de miles en inglés", () => {
      const result = formatPrice(1234567, Currency.USD, "en-US");

      expect(result.amount).toBe("1,234,567");
    });

    it("debe usar puntos para separadores de miles en español argentino", () => {
      const result = formatPrice(1234567, Currency.ARS, "es-AR");

      expect(result.amount).toBe("1.234.567");
    });

    it("debe usar espacios para separadores de miles en francés", () => {
      const result = formatPrice(1234567, Currency.USD, "fr-FR");

      // El locale francés usa un espacio no-breaking ( ) que es diferente del espacio normal
      expect(result.amount).toBe("1 234 567");
    });
  });

  describe("símbolos de moneda", () => {
    it("debe usar U$S para USD", () => {
      const result = formatPrice(100, Currency.USD, "en-US");
      expect(result.symbol).toBe("U$S");
    });

    it("debe usar $ para ARS", () => {
      const result = formatPrice(100, Currency.ARS, "es-AR");
      expect(result.symbol).toBe("$");
    });

    it("debe usar símbolo por defecto para monedas no definidas", () => {
      // Usando un valor que no está en el enum Currency
      const result = formatPrice(100, 999 as Currency, "en-US");
      expect(result.symbol).toBe("$");
    });
  });

  describe("prefijos según el signo", () => {
    it("debe usar + para precios positivos", () => {
      const result = formatPrice(100, Currency.USD, "en-US");
      expect(result.prefix).toBe("+");
    });

    it("debe usar - para precios negativos", () => {
      const result = formatPrice(-100, Currency.USD, "en-US");
      expect(result.prefix).toBe("-");
    });

    it("debe usar string vacío para precio cero", () => {
      const result = formatPrice(0, Currency.USD, "en-US");
      expect(result.prefix).toBe("");
    });
  });

  describe("casos edge y límites", () => {
    it("debe manejar números muy grandes", () => {
      const result = formatPrice(999999999.99, Currency.USD, "en-US");

      expect(result).toEqual({
        prefix: "+",
        symbol: "U$S",
        amount: "1,000,000,000",
        decimals: "99",
      });
    });

    it("debe manejar números muy pequeños", () => {
      const result = formatPrice(0.001, Currency.ARS, "es-AR");

      expect(result).toEqual({
        prefix: "+",
        symbol: "$",
        amount: "0",
        decimals: "00",
      });
    });

    it("debe manejar números negativos muy pequeños", () => {
      const result = formatPrice(-0.001, Currency.USD, "en-US");

      expect(result).toEqual({
        prefix: "-",
        symbol: "U$S",
        amount: "0",
        decimals: "00",
      });
    });
  });

  describe("estructura del objeto retornado", () => {
    it("debe retornar un objeto con las propiedades correctas", () => {
      const result = formatPrice(100.5, Currency.USD, "en-US");

      expect(result).toHaveProperty("prefix");
      expect(result).toHaveProperty("symbol");
      expect(result).toHaveProperty("amount");
      expect(result).toHaveProperty("decimals");
    });

    it("debe retornar todas las propiedades como strings", () => {
      const result = formatPrice(100.5, Currency.USD, "en-US");

      expect(typeof result.prefix).toBe("string");
      expect(typeof result.symbol).toBe("string");
      expect(typeof result.amount).toBe("string");
      expect(typeof result.decimals).toBe("string");
    });
  });
});
