import { NextRequest, NextResponse } from "next/server";
import { GET } from "../../../../../app/api/me/transactions/route";

// Mock NextResponse y fetch
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

// Mock global fetch
global.fetch = jest.fn();

// Mock NextRequest
const createMockRequest = (url: string): NextRequest => {
  const mockRequest = {
    url,
  } as NextRequest;
  return mockRequest;
};

describe("/api/me/transactions route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe("GET", () => {
    it("debe responder 200 con transacciones sin filtros", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          card: "visa",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "link",
        },
      ];

      const mockResponse = {
        transactions: mockTransactions,
        metadata: {
          cards: [],
          paymentMethods: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockNextResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions"
      );
      const result = await GET(request);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://uala-dev-challenge.s3.us-east-1.amazonaws.com/transactions.json"
      );
      expect(NextResponse.json).toHaveBeenCalledWith({
        transactions: mockTransactions,
        metadata: mockResponse.metadata,
      });
      expect(result).toBe(mockNextResponse);
    });

    it("debe aplicar filtro por métodos de cobro", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          card: "visa",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "link",
        },
        {
          id: "2",
          amount: 2000,
          card: "mastercard",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "qr",
        },
      ];

      const mockResponse = {
        transactions: mockTransactions,
        metadata: {
          cards: [],
          paymentMethods: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockNextResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions?paymentMethods=link"
      );
      const result = await GET(request);

      expect(NextResponse.json).toHaveBeenCalledWith({
        transactions: [mockTransactions[0]], // Solo la transacción con paymentMethod "link"
        metadata: mockResponse.metadata,
      });
      expect(result).toBe(mockNextResponse);
    });

    it("debe aplicar filtro por múltiples métodos de cobro", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          card: "visa",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "link",
        },
        {
          id: "2",
          amount: 2000,
          card: "mastercard",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "qr",
        },
        {
          id: "3",
          amount: 3000,
          card: "amex",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "mpos",
        },
      ];

      const mockResponse = {
        transactions: mockTransactions,
        metadata: {
          cards: [],
          paymentMethods: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockNextResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions?paymentMethods=link&paymentMethods=qr"
      );
      const result = await GET(request);

      expect(NextResponse.json).toHaveBeenCalledWith({
        transactions: [mockTransactions[0], mockTransactions[1]], // Solo link y qr
        metadata: mockResponse.metadata,
      });
      expect(result).toBe(mockNextResponse);
    });

    it("debe aplicar filtro por card", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          card: "visa",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "link",
        },
        {
          id: "2",
          amount: 2000,
          card: "mastercard",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "qr",
        },
      ];

      const mockResponse = {
        transactions: mockTransactions,
        metadata: {
          cards: [],
          paymentMethods: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockNextResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions?card=visa"
      );
      const result = await GET(request);

      expect(NextResponse.json).toHaveBeenCalledWith({
        transactions: [mockTransactions[0]], // Solo la transacción con card "visa"
        metadata: mockResponse.metadata,
      });
      expect(result).toBe(mockNextResponse);
    });

    it("debe aplicar filtro por múltiples cards", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          card: "visa",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "link",
        },
        {
          id: "2",
          amount: 2000,
          card: "mastercard",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "qr",
        },
        {
          id: "3",
          amount: 3000,
          card: "amex",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "mpos",
        },
      ];

      const mockResponse = {
        transactions: mockTransactions,
        metadata: {
          cards: [],
          paymentMethods: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockNextResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions?card=visa&card=mastercard"
      );
      const result = await GET(request);

      expect(NextResponse.json).toHaveBeenCalledWith({
        transactions: [mockTransactions[0], mockTransactions[1]], // Solo visa y mastercard
        metadata: mockResponse.metadata,
      });
      expect(result).toBe(mockNextResponse);
    });

    it("debe aplicar filtro por installments", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          card: "visa",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "link",
        },
        {
          id: "2",
          amount: 2000,
          card: "mastercard",
          installments: 3,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "qr",
        },
        {
          id: "3",
          amount: 3000,
          card: "amex",
          installments: 6,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "mpos",
        },
      ];

      const mockResponse = {
        transactions: mockTransactions,
        metadata: {
          cards: [],
          paymentMethods: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockNextResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions?installments=3&installments=6"
      );
      const result = await GET(request);

      expect(NextResponse.json).toHaveBeenCalledWith({
        transactions: [mockTransactions[1], mockTransactions[2]], // Solo cuotas 3 y 6
        metadata: mockResponse.metadata,
      });
      expect(result).toBe(mockNextResponse);
    });

    it("debe aplicar filtro por monto mínimo y máximo", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          card: "visa",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "link",
        },
        {
          id: "2",
          amount: 5000,
          card: "mastercard",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "qr",
        },
        {
          id: "3",
          amount: 8000,
          card: "amex",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "mpos",
        },
      ];

      const mockResponse = {
        transactions: mockTransactions,
        metadata: {
          cards: [],
          paymentMethods: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockNextResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions?amountMin=2000&amountMax=6000"
      );
      const result = await GET(request);

      expect(NextResponse.json).toHaveBeenCalledWith({
        transactions: [mockTransactions[1]], // Solo la transacción con amount 5000
        metadata: mockResponse.metadata,
      });
      expect(result).toBe(mockNextResponse);
    });

    it("debe aplicar filtro solo por monto mínimo", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          card: "visa",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "link",
        },
        {
          id: "2",
          amount: 5000,
          card: "mastercard",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "qr",
        },
      ];

      const mockResponse = {
        transactions: mockTransactions,
        metadata: {
          cards: [],
          paymentMethods: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockNextResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions?amountMin=3000"
      );
      const result = await GET(request);

      expect(NextResponse.json).toHaveBeenCalledWith({
        transactions: [mockTransactions[1]], // Solo la transacción con amount >= 3000
        metadata: mockResponse.metadata,
      });
      expect(result).toBe(mockNextResponse);
    });

    it("debe aplicar filtro solo por monto máximo", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          card: "visa",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "link",
        },
        {
          id: "2",
          amount: 5000,
          card: "mastercard",
          installments: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          paymentMethod: "qr",
        },
      ];

      const mockResponse = {
        transactions: mockTransactions,
        metadata: {
          cards: [],
          paymentMethods: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockNextResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions?amountMax=3000"
      );
      const result = await GET(request);

      expect(NextResponse.json).toHaveBeenCalledWith({
        transactions: [mockTransactions[0]], // Solo la transacción con amount <= 3000
        metadata: mockResponse.metadata,
      });
      expect(result).toBe(mockNextResponse);
    });

    it("debe aplicar filtro por fecha", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          card: "visa",
          installments: 1,
          createdAt: "2024-06-01T00:00:00Z",
          updatedAt: "2024-06-01T00:00:00Z",
          paymentMethod: "link",
        },
        {
          id: "2",
          amount: 2000,
          card: "mastercard",
          installments: 1,
          createdAt: "2024-08-01T00:00:00Z",
          updatedAt: "2024-08-01T00:00:00Z",
          paymentMethod: "qr",
        },
        {
          id: "3",
          amount: 3000,
          card: "amex",
          installments: 1,
          createdAt: "2024-10-01T00:00:00Z",
          updatedAt: "2024-10-01T00:00:00Z",
          paymentMethod: "mpos",
        },
      ];

      const mockResponse = {
        transactions: mockTransactions,
        metadata: {
          cards: [],
          paymentMethods: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockNextResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions?dateFrom=2024-07-01&dateTo=2024-09-30"
      );
      const result = await GET(request);

      expect(NextResponse.json).toHaveBeenCalledWith({
        transactions: [mockTransactions[1]], // Solo la transacción del 1 de agosto
        metadata: mockResponse.metadata,
      });
      expect(result).toBe(mockNextResponse);
    });

    it("debe aplicar filtro solo por fecha desde", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          card: "visa",
          installments: 1,
          createdAt: "2024-06-01T00:00:00Z",
          updatedAt: "2024-06-01T00:00:00Z",
          paymentMethod: "link",
        },
        {
          id: "2",
          amount: 2000,
          card: "mastercard",
          installments: 1,
          createdAt: "2024-08-01T00:00:00Z",
          updatedAt: "2024-08-01T00:00:00Z",
          paymentMethod: "qr",
        },
      ];

      const mockResponse = {
        transactions: mockTransactions,
        metadata: {
          cards: [],
          paymentMethods: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockNextResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions?dateFrom=2024-07-01"
      );
      const result = await GET(request);

      expect(NextResponse.json).toHaveBeenCalledWith({
        transactions: [mockTransactions[1]], // Solo la transacción del 1 de agosto
        metadata: mockResponse.metadata,
      });
      expect(result).toBe(mockNextResponse);
    });

    it("debe aplicar filtro solo por fecha hasta", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          card: "visa",
          installments: 1,
          createdAt: "2024-06-01T00:00:00Z",
          updatedAt: "2024-06-01T00:00:00Z",
          paymentMethod: "link",
        },
        {
          id: "2",
          amount: 2000,
          card: "mastercard",
          installments: 1,
          createdAt: "2024-08-01T00:00:00Z",
          updatedAt: "2024-08-01T00:00:00Z",
          paymentMethod: "qr",
        },
      ];

      const mockResponse = {
        transactions: mockTransactions,
        metadata: {
          cards: [],
          paymentMethods: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockNextResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions?dateTo=2024-07-31"
      );
      const result = await GET(request);

      expect(NextResponse.json).toHaveBeenCalledWith({
        transactions: [mockTransactions[0]], // Solo la transacción del 1 de junio
        metadata: mockResponse.metadata,
      });
      expect(result).toBe(mockNextResponse);
    });

    it("debe aplicar múltiples filtros combinados", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          card: "visa",
          installments: 1,
          createdAt: "2024-06-01T00:00:00Z",
          updatedAt: "2024-06-01T00:00:00Z",
          paymentMethod: "link",
        },
        {
          id: "2",
          amount: 2000,
          card: "mastercard",
          installments: 3,
          createdAt: "2024-08-01T00:00:00Z",
          updatedAt: "2024-08-01T00:00:00Z",
          paymentMethod: "qr",
        },
        {
          id: "3",
          amount: 3000,
          card: "visa",
          installments: 6,
          createdAt: "2024-10-01T00:00:00Z",
          updatedAt: "2024-10-01T00:00:00Z",
          paymentMethod: "link",
        },
      ];

      const mockResponse = {
        transactions: mockTransactions,
        metadata: {
          cards: [],
          paymentMethods: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockNextResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions?card=visa&amountMin=2000&dateFrom=2024-09-01"
      );
      const result = await GET(request);

      expect(NextResponse.json).toHaveBeenCalledWith({
        transactions: [mockTransactions[2]], // Solo la transacción que cumple todos los filtros
        metadata: mockResponse.metadata,
      });
      expect(result).toBe(mockNextResponse);
    });

    it("debe manejar errores de fetch y responder 500", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const mockNextResponse = { status: 500 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions"
      );
      const result = await GET(request);

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching data:",
        expect.any(Error)
      );
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
      expect(result).toBe(mockNextResponse);

      consoleSpy.mockRestore();
    });

    it("debe manejar errores de excepción y responder 500", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const mockNextResponse = { status: 500 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);

      const request = createMockRequest(
        "http://localhost:3000/api/me/transactions"
      );
      const result = await GET(request);

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching data:",
        expect.any(Error)
      );
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
      expect(result).toBe(mockNextResponse);

      consoleSpy.mockRestore();
    });
  });
});
