import { useFilters } from "@/src/hooks/use-filters";
import { defaultFilters } from "@/src/types/filters";
import { act, renderHook } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock SWR
jest.mock("swr", () => ({
  useSWRConfig: jest.fn(),
}));

// Mock window.location
const originalLocation = window.location;
beforeAll(() => {
  delete (window as any).location;
  (window as any).location = {
    pathname: "/test",
  };
});

afterAll(() => {
  (window as any).location = originalLocation;
});

describe("useFilters", () => {
  const mockRouter = {
    replace: jest.fn(),
  };

  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSWRConfig as jest.Mock).mockReturnValue({ mutate: mockMutate });
  });

  describe("URL update functionality", () => {
    it("should update URL with all active filters", () => {
      const mockSearchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      const testFilters = {
        ...defaultFilters,
        paymentMethods: ["link", "qr"] as ("link" | "qr" | "mpos" | "pospro")[],
        date: { from: "2024-01-01", to: "2024-01-31" },
        card: ["visa", "mastercard"] as ("visa" | "mastercard" | "amex")[],
        installments: ["1", "3"] as ("1" | "2" | "3" | "6" | "12")[],
        amount: { min: 100, max: 1000 },
      };

      act(() => {
        result.current.applyFilters(testFilters);
      });

      expect(mockRouter.replace).toHaveBeenCalledWith(
        "?paymentMethods=link&paymentMethods=qr&dateFrom=2024-01-01&dateTo=2024-01-31&card=visa&card=mastercard&installments=1&installments=3&amountMin=100&amountMax=1000",
        { scroll: false }
      );
    });

    it("should clear URL when no active filters", () => {
      const mockSearchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.applyFilters(defaultFilters);
      });

      expect(mockRouter.replace).toHaveBeenCalledWith("/", { scroll: false });
    });

    it("should handle partial filters correctly", () => {
      const mockSearchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      const partialFilters = {
        ...defaultFilters,
        paymentMethods: ["link"] as ("link" | "qr" | "mpos" | "pospro")[],
        date: { from: "2024-01-01", to: undefined },
        amount: { min: 100, max: undefined },
      };

      act(() => {
        result.current.applyFilters(partialFilters);
      });

      expect(mockRouter.replace).toHaveBeenCalledWith(
        "?paymentMethods=link&dateFrom=2024-01-01&amountMin=100",
        { scroll: false }
      );
    });
  });

  describe("URL loading functionality", () => {
    it("should load filters from URL correctly", () => {
      const mockSearchParams = {
        getAll: jest.fn(),
        get: jest.fn(),
      };

      mockSearchParams.getAll
        .mockReturnValueOnce(["link", "qr"]) // paymentMethods
        .mockReturnValueOnce(["visa"]) // card
        .mockReturnValueOnce([]); // installments

      mockSearchParams.get
        .mockReturnValueOnce("2024-01-01") // dateFrom
        .mockReturnValueOnce("2024-01-31") // dateTo
        .mockReturnValueOnce("1") // installments
        .mockReturnValueOnce("100") // amountMin
        .mockReturnValueOnce("1000"); // amountMax

      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      expect(result.current.currentFilters.paymentMethods).toEqual([
        "link",
        "qr",
      ]);
      expect(result.current.currentFilters.card).toEqual(["visa"]);
      expect(result.current.currentFilters.installments).toEqual(["1"]);
      expect(result.current.currentFilters.date.from).toBe("2024-01-01");
      expect(result.current.currentFilters.date.to).toBe("2024-01-31");
      expect(result.current.currentFilters.amount.min).toBe(100);
      expect(result.current.currentFilters.amount.max).toBe(1000);
    });

    it("should handle invalid amount values", () => {
      const mockSearchParams = {
        getAll: jest.fn(),
        get: jest.fn(),
      };

      mockSearchParams.getAll.mockReturnValue([]);
      mockSearchParams.get
        .mockReturnValueOnce(undefined) // dateFrom
        .mockReturnValueOnce(undefined) // dateTo
        .mockReturnValueOnce(undefined) // installments
        .mockReturnValueOnce("invalid") // amountMin
        .mockReturnValueOnce("NaN"); // amountMax

      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      expect(result.current.currentFilters.amount.min).toBeUndefined();
      expect(result.current.currentFilters.amount.max).toBeUndefined();
    });

    it("should handle valid amount values", () => {
      const mockSearchParams = {
        getAll: jest.fn(),
        get: jest.fn(),
      };

      mockSearchParams.getAll.mockReturnValue([]);
      mockSearchParams.get
        .mockReturnValueOnce(undefined) // dateFrom
        .mockReturnValueOnce(undefined) // dateTo
        .mockReturnValueOnce(undefined) // installments
        .mockReturnValueOnce("100.50") // amountMin
        .mockReturnValueOnce("999.99"); // amountMax

      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      expect(result.current.currentFilters.amount.min).toBe(100.5);
      expect(result.current.currentFilters.amount.max).toBe(999.99);
    });

    it("should handle amount values with Infinity", () => {
      const mockSearchParams = {
        getAll: jest.fn(),
        get: jest.fn(),
      };

      mockSearchParams.getAll.mockReturnValue([]);
      mockSearchParams.get
        .mockReturnValueOnce(undefined) // dateFrom
        .mockReturnValueOnce(undefined) // dateTo
        .mockReturnValueOnce(undefined) // installments
        .mockReturnValueOnce("Infinity") // amountMin
        .mockReturnValueOnce("-Infinity"); // amountMax

      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      expect(result.current.currentFilters.amount.min).toBeUndefined();
      expect(result.current.currentFilters.amount.max).toBeUndefined();
    });
  });

  describe("Filter application", () => {
    it("should apply filters and call mutate", async () => {
      const mockSearchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      const testFilters = {
        ...defaultFilters,
        paymentMethods: ["link"] as ("link" | "qr" | "mpos" | "pospro")[],
      };

      await act(async () => {
        await result.current.applyFilters(testFilters);
      });

      expect(mockMutate).toHaveBeenCalledWith("/api/me/transactions");
    });

    it("should clear all filters and call mutate", () => {
      const mockSearchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.clearAllFilters();
      });

      expect(mockMutate).toHaveBeenCalledWith("/api/me/transactions");
    });
  });

  describe("Active filters detection", () => {
    it("should return true when there are active filters", () => {
      const mockSearchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      const testFilters = {
        ...defaultFilters,
        paymentMethods: ["link"] as ("link" | "qr" | "mpos" | "pospro")[],
      };

      const hasActive = result.current.hasActiveFilters(testFilters);
      expect(hasActive).toBe(true);
    });

    it("should return false when no active filters", () => {
      const mockSearchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      const hasActive = result.current.hasActiveFilters(defaultFilters);
      expect(hasActive).toBe(false);
    });
  });

  describe("Initialization", () => {
    it("should initialize filters from URL on mount", () => {
      const mockSearchParams = {
        getAll: jest.fn().mockReturnValue([]),
        get: jest.fn().mockReturnValue(null),
      };
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      renderHook(() => useFilters());

      // Should not throw any errors during initialization
      expect(mockSearchParams.getAll).toHaveBeenCalled();
    });

    it("should handle empty arrays correctly", () => {
      const mockSearchParams = {
        getAll: jest.fn().mockReturnValue([]),
        get: jest.fn().mockReturnValue(null),
      };
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      expect(result.current.currentFilters.paymentMethods).toEqual([]);
      expect(result.current.currentFilters.card).toEqual([]);
      expect(result.current.currentFilters.installments).toEqual([]);
    });
  });

  describe("Edge cases", () => {
    it("should handle undefined values in amount", () => {
      const mockSearchParams = {
        getAll: jest.fn().mockReturnValue([]),
        get: jest.fn().mockReturnValue(null),
      };
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      const testFilters = {
        ...defaultFilters,
        amount: { min: undefined, max: undefined },
      };

      expect(() => {
        result.current.hasActiveFilters(testFilters);
      }).not.toThrow();
    });

    it("should handle null values in amount", () => {
      const mockSearchParams = {
        getAll: jest.fn().mockReturnValue([]),
        get: jest.fn().mockReturnValue(null),
      };
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useFilters());

      const testFilters = {
        ...defaultFilters,
        amount: { min: null as any, max: null as any },
      };

      expect(() => {
        result.current.hasActiveFilters(testFilters);
      }).not.toThrow();
    });
  });
});
