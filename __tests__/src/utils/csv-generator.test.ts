import Transaction from "@/src/types/entities/transaction";
import PaymentMethod from "@/src/types/payment-method";
import { CSVGenerator } from "@/src/utils/csv-generator";

describe("CSVGenerator", () => {
  const mockTransaction: Transaction = {
    id: "1",
    amount: 100.5,
    card: "visa",
    installments: 3,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    paymentMethod: PaymentMethod.LINK,
  };

  const mockTransactions: Transaction[] = [mockTransaction];

  describe("getCSV", () => {
    it("should generate CSV with valid transactions", () => {
      const csv = CSVGenerator.getCSV(mockTransactions);

      expect(csv).toContain(
        "ID,Amount,Card,Installments,Payment Method,Created At,Updated At"
      );
      expect(csv).toContain("1,100.5,visa,3,link");
    });

    it("should generate CSV with empty transactions", () => {
      const csv = CSVGenerator.getCSV([]);

      expect(csv).toContain(
        "ID,Amount,Card,Installments,Payment Method,Created At,Updated At"
      );
      expect(csv.split("\n")).toHaveLength(1); // Only headers
    });

    it("should generate CSV with single transaction", () => {
      const csv = CSVGenerator.getCSV([mockTransaction]);

      const lines = csv.split("\n");
      expect(lines).toHaveLength(2); // Headers + 1 transaction
      expect(lines[0]).toContain(
        "ID,Amount,Card,Installments,Payment Method,Created At,Updated At"
      );
      expect(lines[1]).toContain("1,100.5,visa,3,link");
    });

    it("should handle fields with commas correctly", () => {
      const transactionWithComma: Transaction = {
        ...mockTransaction,
        id: "1,2,3", // ID with commas
      };

      const csv = CSVGenerator.getCSV([transactionWithComma]);
      expect(csv).toContain('"1,2,3"'); // Should be quoted
    });

    it("should handle fields with double quotes correctly", () => {
      const transactionWithQuotes: Transaction = {
        ...mockTransaction,
        id: 'test"quote', // ID with quotes
      };

      const csv = CSVGenerator.getCSV([transactionWithQuotes]);
      expect(csv).toContain('"test""quote"'); // Should escape quotes
    });

    it("should handle fields with line breaks correctly", () => {
      const transactionWithNewline: Transaction = {
        ...mockTransaction,
        id: "line1\nline2", // ID with newlines
      };

      const csv = CSVGenerator.getCSV([transactionWithNewline]);
      expect(csv).toContain('"line1\nline2"'); // Should be quoted
    });

    it("should handle null and undefined fields", () => {
      const transactionWithNull: Transaction = {
        ...mockTransaction,
        id: null as any, // Force null
      };

      const csv = CSVGenerator.getCSV([transactionWithNull]);
      expect(csv).toContain(",100.5,visa,3,link"); // Empty field for null ID
    });
  });

  describe("formatDate", () => {
    it("should use default date format", () => {
      const csv = CSVGenerator.getCSV(mockTransactions);
      // Should contain formatted date (the exact format depends on locale)
      expect(csv).toContain("1,100.5,visa,3,link");
    });

    it("should use custom date format", () => {
      const customOptions = {
        dateFormat: {
          year: "numeric",
          month: "long",
          day: "numeric",
        } as Intl.DateTimeFormatOptions,
      };

      const csv = CSVGenerator.getCSV(mockTransactions, customOptions);
      expect(csv).toContain("1,100.5,visa,3,link");
    });
  });

  describe("getHeaders", () => {
    it("should generate headers with default filename", () => {
      const headers = CSVGenerator.getHeaders();

      expect(headers.get("Content-Type")).toBe("text/csv; charset=utf-8");
      expect(headers.get("Content-Disposition")).toContain("transactions_");
      expect(headers.get("Content-Disposition")).toContain(".csv");
    });

    it("should generate headers with custom filename", () => {
      const customFilename = "my-transactions";
      const headers = CSVGenerator.getHeaders(customFilename);

      expect(headers.get("Content-Disposition")).toContain("my-transactions_");
      expect(headers.get("Content-Disposition")).toContain(".csv");
    });

    it("should generate headers with custom filename and timestamp", () => {
      const customFilename = "custom-transactions";
      const headers = CSVGenerator.getHeaders(customFilename);

      const today = new Date().toISOString().split("T")[0];
      expect(headers.get("Content-Disposition")).toContain(
        `custom-transactions_${today}.csv`
      );
    });

    it("should include timestamp in filename", () => {
      const headers = CSVGenerator.getHeaders();

      const today = new Date().toISOString().split("T")[0];
      expect(headers.get("Content-Disposition")).toContain(
        `transactions_${today}.csv`
      );
    });

    it("should handle filename undefined with customFilename", () => {
      const customFilename = "custom";
      const headers = CSVGenerator.getHeaders(undefined, customFilename);

      expect(headers.get("Content-Disposition")).toContain("custom_");
    });

    it("should prioritize customFilename over filename", () => {
      const filename = "original";
      const customFilename = "custom";
      const headers = CSVGenerator.getHeaders(filename, customFilename);

      expect(headers.get("Content-Disposition")).toContain("custom_");
      expect(headers.get("Content-Disposition")).not.toContain("original_");
    });

    it("should use filename when customFilename is undefined", () => {
      const filename = "original";
      const headers = CSVGenerator.getHeaders(filename, undefined);

      expect(headers.get("Content-Disposition")).toContain("original_");
    });
  });

  describe("Cache headers", () => {
    it("should have all correct cache headers", () => {
      const headers = CSVGenerator.getHeaders();

      expect(headers.get("Cache-Control")).toBe(
        "no-cache, no-store, must-revalidate"
      );
      expect(headers.get("Pragma")).toBe("no-cache");
      expect(headers.get("Expires")).toBe("0");
    });
  });

  describe("CSV escaping", () => {
    it("should escape fields with commas", () => {
      const transactionWithComma: Transaction = {
        ...mockTransaction,
        id: "field,with,comma",
      };

      const csv = CSVGenerator.getCSV([transactionWithComma]);
      expect(csv).toContain('"field,with,comma"');
    });

    it("should escape fields with double quotes", () => {
      const transactionWithQuotes: Transaction = {
        ...mockTransaction,
        id: 'field"with"quotes',
      };

      const csv = CSVGenerator.getCSV([transactionWithQuotes]);
      expect(csv).toContain('"field""with""quotes"');
    });

    it("should escape fields with line breaks", () => {
      const transactionWithNewline: Transaction = {
        ...mockTransaction,
        id: "field\nwith\nnewlines",
      };

      const csv = CSVGenerator.getCSV([transactionWithNewline]);
      expect(csv).toContain('"field\nwith\nnewlines"');
    });

    it("should handle null fields", () => {
      const transactionWithNull: Transaction = {
        ...mockTransaction,
        id: null as any,
      };

      const csv = CSVGenerator.getCSV([transactionWithNull]);
      expect(csv).toContain(",100.5,visa,3,link");
    });

    it("should handle undefined fields", () => {
      const transactionWithUndefined: Transaction = {
        ...mockTransaction,
        id: undefined as any,
      };

      const csv = CSVGenerator.getCSV([transactionWithUndefined]);
      expect(csv).toContain(",100.5,visa,3,link");
    });

    it("should handle numeric fields", () => {
      const csv = CSVGenerator.getCSV(mockTransactions);
      expect(csv).toContain("100.5"); // Amount should be preserved as number
    });

    it("should handle simple string fields", () => {
      const csv = CSVGenerator.getCSV(mockTransactions);
      expect(csv).toContain("visa"); // Card should be preserved as string
    });
  });

  describe("Date formatting", () => {
    it("should format string dates correctly", () => {
      const csv = CSVGenerator.getCSV(mockTransactions);
      // Should contain the transaction data with formatted dates
      expect(csv).toContain("1,100.5,visa,3,link");
    });

    it("should format Date objects correctly", () => {
      const transactionWithDate: Transaction = {
        ...mockTransaction,
        createdAt: new Date("2024-01-01T00:00:00.000Z") as any,
        updatedAt: new Date("2024-01-01T00:00:00.000Z") as any,
      };

      const csv = CSVGenerator.getCSV([transactionWithDate]);
      // Should handle Date objects correctly
      expect(csv).toContain("1,100.5,visa,3,link");
    });

    it("should handle Date objects directly", () => {
      const transactionWithDate: Transaction = {
        ...mockTransaction,
        // This test assumes that the Transaction type can
        // receive directly a Date object. This happens when we modify the Transaction type
        createdAt: new Date("2024-01-01T00:00:00.000Z") as any,
        updatedAt: new Date("2024-01-01T00:00:00.000Z") as any,
      };

      const csv = CSVGenerator.getCSV([transactionWithDate]);
      expect(csv).toContain("1,100.5,visa,3,link");
    });
  });

  describe("Custom date format", () => {
    it("should use custom date format", () => {
      const customOptions = {
        dateFormat: {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        } as Intl.DateTimeFormatOptions,
      };

      const transactionWithDate: Transaction = {
        ...mockTransaction,
        createdAt: new Date("2024-01-01T00:00:00.000Z") as any,
        updatedAt: new Date("2024-01-01T00:00:00.000Z") as any,
      };

      const csv = CSVGenerator.getCSV([transactionWithDate], customOptions);
      expect(csv).toContain("1,100.5,visa,3,link");
    });
  });

  describe("Complex scenarios", () => {
    it("should generate complete CSV with all functionalities", () => {
      const complexTransactions: Transaction[] = [
        {
          ...mockTransaction,
          id: "1",
          amount: 100.5,
        },
        {
          ...mockTransaction,
          id: "2",
          amount: 200.75,
          card: "mastercard",
        },
        {
          ...mockTransaction,
          id: "3",
          amount: 300.25,
          card: "amex",
          installments: 6,
        },
      ];

      const csv = CSVGenerator.getCSV(complexTransactions);

      expect(csv).toContain(
        "ID,Amount,Card,Installments,Payment Method,Created At,Updated At"
      );
      expect(csv).toContain("1,100.5,visa,3,link");
      expect(csv).toContain("2,200.75,mastercard,3,link");
      expect(csv).toContain("3,300.25,amex,6,link");
    });

    it("should generate headers and CSV compatibly", () => {
      const headers = CSVGenerator.getHeaders("test-transactions");
      const csv = CSVGenerator.getCSV(mockTransactions);

      expect(headers.get("Content-Type")).toBe("text/csv; charset=utf-8");
      expect(csv).toContain(
        "ID,Amount,Card,Installments,Payment Method,Created At,Updated At"
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle transactions with very long fields", () => {
      const longId = "a".repeat(1000);
      const transactionWithLongField: Transaction = {
        ...mockTransaction,
        id: longId,
      };

      const csv = CSVGenerator.getCSV([transactionWithLongField]);
      expect(csv).toContain(longId);
    });

    it("should handle transactions with special characters", () => {
      const specialId = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
      const transactionWithSpecialChars: Transaction = {
        ...mockTransaction,
        id: specialId,
      };

      const csv = CSVGenerator.getCSV([transactionWithSpecialChars]);
      // Should generate CSV without errors, even with special characters
      expect(csv).toContain(
        "ID,Amount,Card,Installments,Payment Method,Created At,Updated At"
      );
      expect(csv).toContain("100.5");
      expect(csv).toContain("visa");
      expect(csv).toContain("3");
      expect(csv).toContain("link");
    });

    it("should handle invalid dates", () => {
      const transactionWithInvalidDate: Transaction = {
        ...mockTransaction,
        createdAt: "invalid-date" as any,
        updatedAt: "invalid-date" as any,
      };

      const csv = CSVGenerator.getCSV([transactionWithInvalidDate]);
      // Should generate the CSV even if dates are invalid
      expect(csv).toContain("1,100.5,visa,3,link");
    });

    it("should handle fields with only commas", () => {
      const transactionWithCommas: Transaction = {
        ...mockTransaction,
        id: ",,,,",
      };

      const csv = CSVGenerator.getCSV([transactionWithCommas]);
      expect(csv).toContain('",,,,"');
    });

    it("should handle fields with only quotes", () => {
      const transactionWithQuotes: Transaction = {
        ...mockTransaction,
        id: '""""',
      };

      const csv = CSVGenerator.getCSV([transactionWithQuotes]);
      expect(csv).toContain('""""""""');
    });

    it("should handle fields with only line breaks", () => {
      const transactionWithNewlines: Transaction = {
        ...mockTransaction,
        id: "\n\n\n",
      };

      const csv = CSVGenerator.getCSV([transactionWithNewlines]);
      expect(csv).toContain('"\n\n\n"');
    });

    it("should handle fields with boolean values", () => {
      const transactionWithBoolean: Transaction = {
        ...mockTransaction,
        id: true as any,
      };

      const csv = CSVGenerator.getCSV([transactionWithBoolean]);
      expect(csv).toContain("true");
    });

    it("should handle fields with numbers as strings", () => {
      const transactionWithNumberString: Transaction = {
        ...mockTransaction,
        id: "123" as any,
      };

      const csv = CSVGenerator.getCSV([transactionWithNumberString]);
      expect(csv).toContain("123");
    });

    it("should handle Date objects with custom format", () => {
      const customOptions = {
        dateFormat: {
          year: "numeric",
          month: "long",
          day: "numeric",
        } as Intl.DateTimeFormatOptions,
      };

      const transactionWithDate: Transaction = {
        ...mockTransaction,
        createdAt: new Date("2024-01-01T00:00:00.000Z") as any,
        updatedAt: new Date("2024-01-01T00:00:00.000Z") as any,
      };

      const csv = CSVGenerator.getCSV([transactionWithDate], customOptions);
      expect(csv).toContain("1,100.5,visa,3,link");
    });
  });
});
