import Transaction from "../../../src/types/entities/transaction";
import PaymentMethod from "../../../src/types/payment-method";
import {
  CSVGenerator,
  CSVGeneratorOptions,
} from "../../../src/utils/csv-generator";

// Mock de datos de prueba
const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 1000,
    card: "visa",
    installments: 1,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    paymentMethod: PaymentMethod.POSPRO,
  },
  {
    id: "2",
    amount: 2500,
    card: "mastercard",
    installments: 3,
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
    paymentMethod: PaymentMethod.LINK,
  },
  {
    id: "3",
    amount: 500,
    card: "amex",
    installments: 1,
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
    paymentMethod: PaymentMethod.MPOS,
  },
];

describe("CSVGenerator", () => {
  describe("getCSV", () => {
    it("debe generar CSV con transacciones válidas", () => {
      const csv = CSVGenerator.getCSV(mockTransactions);

      expect(csv).toContain(
        "ID,Monto,Tarjeta,Cuotas,Método de Pago,Fecha de Creación,Última Actualización"
      );
      expect(csv).toContain("1,1000,visa,1,pospro");
      expect(csv).toContain("2,2500,mastercard,3,link");
      expect(csv).toContain("3,500,amex,1,mpos");
    });

    it("debe generar CSV con transacciones vacías", () => {
      const csv = CSVGenerator.getCSV([]);

      expect(csv).toBe(
        "ID,Monto,Tarjeta,Cuotas,Método de Pago,Fecha de Creación,Última Actualización"
      );
    });

    it("debe generar CSV con una sola transacción", () => {
      const singleTransaction = [mockTransactions[0]];
      const csv = CSVGenerator.getCSV(singleTransaction);

      expect(csv).toContain(
        "ID,Monto,Tarjeta,Cuotas,Método de Pago,Fecha de Creación,Última Actualización"
      );
      expect(csv).toContain("1,1000,visa,1,pospro");
      expect(csv.split("\n")).toHaveLength(2);
    });

    it("debe manejar campos con comas correctamente", () => {
      const transactionWithComma = {
        ...mockTransactions[0],
        card: "visa, premium" as any,
      };
      const csv = CSVGenerator.getCSV([transactionWithComma]);

      expect(csv).toContain('"visa, premium"');
    });

    it("debe manejar campos con comillas dobles correctamente", () => {
      const transactionWithQuotes = {
        ...mockTransactions[0],
        card: 'visa "premium"' as any,
      };
      const csv = CSVGenerator.getCSV([transactionWithQuotes]);

      expect(csv).toContain('"visa ""premium"""');
    });

    it("debe manejar campos con saltos de línea correctamente", () => {
      const transactionWithNewline = {
        ...mockTransactions[0],
        card: "visa\npremium" as any,
      };
      const csv = CSVGenerator.getCSV([transactionWithNewline]);

      expect(csv).toContain('"visa\npremium"');
    });

    it("debe manejar campos null y undefined", () => {
      const transactionWithNulls = {
        ...mockTransactions[0],
        card: null as any,
        installments: undefined as any,
      };
      const csv = CSVGenerator.getCSV([transactionWithNulls]);

      expect(csv).toContain("1,1000,,,pospro");
    });

    it("debe usar formato de fecha por defecto", () => {
      const csv = CSVGenerator.getCSV([mockTransactions[0]]);

      // Verificar que las fechas estén en formato español argentino
      expect(csv).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("debe usar formato de fecha personalizado", () => {
      const customOptions: CSVGeneratorOptions = {
        dateFormat: {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      };
      const csv = CSVGenerator.getCSV([mockTransactions[0]], customOptions);

      // Verificar que las fechas estén en formato personalizado
      expect(csv).toMatch(
        /enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/
      );
    });
  });

  describe("getHeaders", () => {
    it("debe generar headers con nombre de archivo por defecto", () => {
      const headers = CSVGenerator.getHeaders();

      expect(headers.get("Content-Type")).toBe("text/csv; charset=utf-8");
      expect(headers.get("Content-Disposition")).toMatch(
        /attachment; filename="transacciones_\d{4}-\d{2}-\d{2}\.csv"/
      );
      expect(headers.get("Cache-Control")).toBe(
        "no-cache, no-store, must-revalidate"
      );
      expect(headers.get("Pragma")).toBe("no-cache");
      expect(headers.get("Expires")).toBe("0");
    });

    it("debe generar headers con nombre de archivo personalizado", () => {
      const customFilename = "mis_transacciones";
      const headers = CSVGenerator.getHeaders(customFilename);

      expect(headers.get("Content-Disposition")).toMatch(
        /attachment; filename="mis_transacciones_\d{4}-\d{2}-\d{2}\.csv"/
      );
    });

    it("debe generar headers con nombre de archivo personalizado y timestamp", () => {
      const customFilename = "reporte";
      const headers = CSVGenerator.getHeaders(customFilename, "reporte_final");

      expect(headers.get("Content-Disposition")).toMatch(
        /attachment; filename="reporte_final_\d{4}-\d{2}-\d{2}\.csv"/
      );
    });

    it("debe incluir timestamp en el nombre del archivo", () => {
      const headers = CSVGenerator.getHeaders();
      const contentDisposition = headers.get("Content-Disposition");
      const timestamp = new Date().toISOString().split("T")[0];

      expect(contentDisposition).toContain(timestamp);
    });

    it("debe manejar filename undefined con customFilename", () => {
      const headers = CSVGenerator.getHeaders(undefined, "custom_name");

      expect(headers.get("Content-Disposition")).toMatch(
        /attachment; filename="custom_name_\d{4}-\d{2}-\d{2}\.csv"/
      );
    });

    it("debe priorizar customFilename sobre filename", () => {
      const headers = CSVGenerator.getHeaders("ignored_name", "priority_name");

      expect(headers.get("Content-Disposition")).toMatch(
        /attachment; filename="priority_name_\d{4}-\d{2}-\d{2}\.csv"/
      );
    });

    it("debe usar filename cuando customFilename es undefined", () => {
      const headers = CSVGenerator.getHeaders("used_name", undefined);

      expect(headers.get("Content-Disposition")).toMatch(
        /attachment; filename="used_name_\d{4}-\d{2}-\d{2}\.csv"/
      );
    });

    it("debe tener todos los headers de cache correctos", () => {
      const headers = CSVGenerator.getHeaders();

      expect(headers.get("Cache-Control")).toBe(
        "no-cache, no-store, must-revalidate"
      );
      expect(headers.get("Pragma")).toBe("no-cache");
      expect(headers.get("Expires")).toBe("0");
      expect(headers.get("Content-Type")).toBe("text/csv; charset=utf-8");
    });
  });

  describe("escapeCSVField", () => {
    it("debe escapar campos con comas", () => {
      const csv = CSVGenerator.getCSV([
        {
          ...mockTransactions[0],
          card: "visa, premium" as any,
        },
      ]);

      expect(csv).toContain('"visa, premium"');
    });

    it("debe escapar campos con comillas dobles", () => {
      const csv = CSVGenerator.getCSV([
        {
          ...mockTransactions[0],
          card: 'visa "premium"' as any,
        },
      ]);

      expect(csv).toContain('"visa ""premium"""');
    });

    it("debe escapar campos con saltos de línea", () => {
      const csv = CSVGenerator.getCSV([
        {
          ...mockTransactions[0],
          card: "visa\npremium" as any,
        },
      ]);

      expect(csv).toContain('"visa\npremium"');
    });

    it("debe manejar campos null", () => {
      const csv = CSVGenerator.getCSV([
        {
          ...mockTransactions[0],
          card: null as any,
        },
      ]);

      expect(csv).toContain("1,1000,,1,pospro");
    });

    it("debe manejar campos undefined", () => {
      const csv = CSVGenerator.getCSV([
        {
          ...mockTransactions[0],
          card: undefined as any,
        },
      ]);

      expect(csv).toContain("1,1000,,1,pospro");
    });

    it("debe manejar campos numéricos", () => {
      const csv = CSVGenerator.getCSV([mockTransactions[0]]);

      expect(csv).toContain("1000");
      expect(csv).toContain("1");
    });

    it("debe manejar campos de string simples", () => {
      const csv = CSVGenerator.getCSV([mockTransactions[0]]);

      expect(csv).toContain("visa");
      expect(csv).toContain("pospro");
    });
  });

  describe("formatDate", () => {
    it("debe formatear fechas string correctamente", () => {
      const csv = CSVGenerator.getCSV([mockTransactions[0]]);

      // Verificar que las fechas estén formateadas
      expect(csv).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("debe formatear fechas Date correctamente", () => {
      const transactionWithDate = {
        ...mockTransactions[0],
        createdAt: new Date("2024-01-15T10:30:00Z").toISOString(),
        updatedAt: new Date("2024-01-15T10:30:00Z").toISOString(),
      };
      const csv = CSVGenerator.getCSV([transactionWithDate]);

      expect(csv).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("debe formatear objetos Date directamente", () => {
      // Para cubrir la rama del ternario en la línea 47, necesitamos que el método formatDate
      // reciba directamente un objeto Date. Esto pasa cuando modificamos el tipo Transaction
      // para que createdAt/updatedAt sean Date en lugar de string
      const transactionWithDateObjects = {
        ...mockTransactions[0],
        createdAt: new Date("2024-01-15T10:30:00Z") as any, // Forzamos Date object
        updatedAt: new Date("2024-01-15T10:30:00Z") as any, // Forzamos Date object
      };

      const csv = CSVGenerator.getCSV([transactionWithDateObjects]);

      expect(csv).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(csv).toContain("15/01/2024");
    });

    it("debe usar formato de fecha personalizado", () => {
      const customOptions: CSVGeneratorOptions = {
        dateFormat: {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        },
      };
      const csv = CSVGenerator.getCSV([mockTransactions[0]], customOptions);

      expect(csv).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe("Integración completa", () => {
    it("debe generar CSV completo con todas las funcionalidades", () => {
      const complexTransactions = [
        {
          ...mockTransactions[0],
          card: 'visa "premium"' as any,
        },
        {
          ...mockTransactions[1],
          card: "mastercard, gold" as any,
        },
        {
          ...mockTransactions[2],
          card: "amex\nplatinum" as any,
        },
      ];

      const csv = CSVGenerator.getCSV(complexTransactions);
      const lines = csv.split("\n");

      // Verificar header
      expect(lines[0]).toBe(
        "ID,Monto,Tarjeta,Cuotas,Método de Pago,Fecha de Creación,Última Actualización"
      );

      // Verificar que todas las transacciones estén incluidas (header + 3 transacciones + posible línea vacía)
      expect(lines.length).toBeGreaterThanOrEqual(4);

      // Verificar escape de campos especiales
      expect(csv).toContain('"visa ""premium"""');
      expect(csv).toContain('"mastercard, gold"');
      expect(csv).toContain('"amex\nplatinum"');
    });

    it("debe generar headers y CSV compatibles", () => {
      const csv = CSVGenerator.getCSV(mockTransactions);
      const headers = CSVGenerator.getHeaders("test");

      expect(headers.get("Content-Type")).toBe("text/csv; charset=utf-8");
      expect(csv).toContain(
        "ID,Monto,Tarjeta,Cuotas,Método de Pago,Fecha de Creación,Última Actualización"
      );
    });
  });

  describe("Casos edge", () => {
    it("debe manejar transacciones con campos muy largos", () => {
      const longTransaction = {
        ...mockTransactions[0],
        card: "a".repeat(1000) as any,
      };
      const csv = CSVGenerator.getCSV([longTransaction]);

      // El campo largo no se escapa porque no contiene caracteres especiales
      expect(csv).toContain("a".repeat(1000));
    });

    it("debe manejar transacciones con caracteres especiales", () => {
      const specialTransaction = {
        ...mockTransactions[0],
        card: "visa@#$%^&*()_+-=[]{}|;':\",./<>?" as any,
      };
      const csv = CSVGenerator.getCSV([specialTransaction]);

      // Los caracteres especiales se escapan porque contienen comillas y comas
      expect(csv).toContain('"visa@#$%^&*()_+-=[]{}|;\':"",./<>?"');
    });

    it("debe manejar fechas inválidas", () => {
      const invalidDateTransaction = {
        ...mockTransactions[0],
        createdAt: "fecha-invalida",
        updatedAt: "otra-fecha-invalida",
      };
      const csv = CSVGenerator.getCSV([invalidDateTransaction]);

      // Debe generar el CSV aunque las fechas sean inválidas
      expect(csv).toContain("1,1000,visa,1,pospro");
    });

    it("debe manejar campos con solo comas", () => {
      const commaTransaction = {
        ...mockTransactions[0],
        card: "," as any,
      };
      const csv = CSVGenerator.getCSV([commaTransaction]);

      expect(csv).toContain('","');
    });

    it("debe manejar campos con solo comillas", () => {
      const quoteTransaction = {
        ...mockTransactions[0],
        card: '"' as any,
      };
      const csv = CSVGenerator.getCSV([quoteTransaction]);

      expect(csv).toContain('""""');
    });

    it("debe manejar campos con solo saltos de línea", () => {
      const newlineTransaction = {
        ...mockTransactions[0],
        card: "\n" as any,
      };
      const csv = CSVGenerator.getCSV([newlineTransaction]);

      expect(csv).toContain('"\n"');
    });

    it("debe manejar campos con valores booleanos", () => {
      const booleanTransaction = {
        ...mockTransactions[0],
        card: true as any,
        installments: false as any,
      };
      const csv = CSVGenerator.getCSV([booleanTransaction]);

      expect(csv).toContain("1,1000,true,false,pospro");
    });

    it("debe manejar campos con números como strings", () => {
      const stringNumberTransaction = {
        ...mockTransactions[0],
        amount: "2500.50" as any,
        installments: "12" as any,
      };
      const csv = CSVGenerator.getCSV([stringNumberTransaction]);

      expect(csv).toContain("1,2500.50,visa,12,pospro");
    });

    it("debe manejar objetos Date con formato personalizado", () => {
      // Test indirecto usando formato personalizado
      const transaction = {
        ...mockTransactions[0],
        createdAt: "2024-12-25T15:30:00Z",
        updatedAt: "2024-12-25T15:30:00Z",
      };

      const customOptions: CSVGeneratorOptions = {
        dateFormat: {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      };

      const csv = CSVGenerator.getCSV([transaction], customOptions);

      expect(csv).toContain("diciembre");
      expect(csv).toContain("2024");
    });
  });
});
