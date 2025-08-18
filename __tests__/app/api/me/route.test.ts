import { NextResponse } from "next/server";
import { GET } from "../../../../app/api/me/route";

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe("/api/me route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("debe responder 200 con el payload de usuario", async () => {
      const mockResponse = { status: 200 };
      (NextResponse.json as jest.Mock).mockReturnValue(mockResponse);

      const result = await GET();

      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            id: expect.any(String),
            firstname: expect.any(String),
            lastname: expect.any(String),
            email: expect.any(String),
            avatarUrl: expect.any(String),
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
