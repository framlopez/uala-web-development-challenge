import { NextResponse } from "next/server";
import { GET } from "../../../../../app/api/me/summary/route";

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe("/api/me/summary route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("debe responder 200 con el resumen de montos", async () => {
      const mockResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockResponse);

      const result = await GET();

      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          daily: expect.objectContaining({
            totalAmount: expect.any(Number),
          }),
          weekly: expect.objectContaining({
            totalAmount: expect.any(Number),
          }),
          monthly: expect.objectContaining({
            totalAmount: expect.any(Number),
          }),
        })
      );
      expect(result).toBe(mockResponse);
    });

    it("debe manejar errores internos y responder 500", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const mockError = new Error("Test error");

      (NextResponse.json as jest.Mock)
        .mockImplementationOnce(() => {
          throw mockError;
        })
        .mockReturnValueOnce({ status: 500 });

      const result = await GET();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching data:",
        mockError
      );
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
      expect(result).toEqual({ status: 500 });

      consoleSpy.mockRestore();
    });
  });
});
