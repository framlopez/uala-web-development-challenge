import { downloadTransactions } from "@/src/utils/download-transactions";

// Mock global fetch
global.fetch = jest.fn();

// Mock window.URL.createObjectURL
Object.defineProperty(window, "URL", {
  value: {
    createObjectURL: jest.fn(() => "mock-blob-url"),
    revokeObjectURL: jest.fn(),
  },
  writable: true,
});

// Mock document.createElement and appendChild
const mockLink = {
  href: "",
  download: "",
  click: jest.fn(),
};

document.createElement = jest.fn(() => mockLink) as any;
document.body.appendChild = jest.fn();
document.body.removeChild = jest.fn();

describe("downloadTransactions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (window.URL.createObjectURL as jest.Mock).mockClear();
    (window.URL.revokeObjectURL as jest.Mock).mockClear();
    mockLink.click.mockClear();
    mockLink.href = "";
    mockLink.download = "";
  });

  describe("Validaciones de fechas", () => {
    it("debe lanzar error si las fechas son inválidas", async () => {
      const invalidDate = new Date("fecha-invalida");

      await expect(
        downloadTransactions({
          from: invalidDate,
          to: new Date("2024-01-01"),
        })
      ).rejects.toThrow("Fechas inválidas");

      await expect(
        downloadTransactions({
          from: new Date("2024-01-01"),
          to: invalidDate,
        })
      ).rejects.toThrow("Fechas inválidas");
    });

    it("debe lanzar error si las fechas son futuras", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      await expect(
        downloadTransactions({
          from: new Date("2024-01-01"),
          to: futureDate,
        })
      ).rejects.toThrow(
        "No se puede descargar transacciones de fechas futuras"
      );

      await expect(
        downloadTransactions({
          from: futureDate,
          to: new Date("2024-01-01"),
        })
      ).rejects.toThrow(
        "No se puede descargar transacciones de fechas futuras"
      );
    });

    it("debe lanzar error si la fecha de inicio es posterior a la de fin", async () => {
      await expect(
        downloadTransactions({
          from: new Date("2024-01-15"),
          to: new Date("2024-01-01"),
        })
      ).rejects.toThrow(
        "La fecha de inicio no puede ser posterior a la fecha de fin"
      );
    });
  });

  describe("Llamada a la API", () => {
    it("debe construir la URL correcta con los parámetros de fecha", async () => {
      const mockResponse = {
        ok: true,
        headers: new Headers({ "content-type": "text/csv" }),
        blob: () => Promise.resolve(new Blob(["test"], { type: "text/csv" })),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await downloadTransactions({
        from: new Date("2024-01-01"),
        to: new Date("2024-01-31"),
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/me/transactions/download?dateFrom=2024-01-01&dateTo=2024-01-31",
        {
          signal: expect.any(AbortSignal),
          headers: { Accept: "text/csv" },
        }
      );
    });

    it("debe usar el timeout de 30 segundos", async () => {
      jest.useFakeTimers();

      const mockResponse = {
        ok: true,
        headers: new Headers({ "content-type": "text/csv" }),
        blob: () => Promise.resolve(new Blob(["test"], { type: "text/csv" })),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const downloadPromise = downloadTransactions({
        from: new Date("2024-01-01"),
        to: new Date("2024-01-31"),
      });

      // Avanzar el tiempo para simular timeout
      jest.advanceTimersByTime(30000);

      await downloadPromise;
      jest.useRealTimers();
    });
  });

  describe("Manejo de respuestas de la API", () => {
    it("debe manejar respuesta exitosa y descargar el archivo", async () => {
      const mockBlob = new Blob(["test,csv,data"], { type: "text/csv" });
      const mockResponse = {
        ok: true,
        headers: new Headers({ "content-type": "text/csv" }),
        blob: () => Promise.resolve(mockBlob),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      (window.URL.createObjectURL as jest.Mock).mockReturnValue(
        "mock-blob-url"
      );

      await downloadTransactions({
        from: new Date("2024-01-01"),
        to: new Date("2024-01-31"),
      });

      expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockLink.href).toBe("mock-blob-url");
      expect(mockLink.download).toBe(
        "transactions_2024-01-01_to_2024-01-31.csv"
      );
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith("mock-blob-url");
    });

    it("debe lanzar error si la respuesta no es exitosa", async () => {
      const mockResponse = { ok: false, status: 400 };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(
        downloadTransactions({
          from: new Date("2024-01-01"),
          to: new Date("2024-01-31"),
        })
      ).rejects.toThrow("Formato de fechas inválido");
    });

    it("debe manejar diferentes códigos de error HTTP", async () => {
      const errorCases = [
        { status: 400, expectedMessage: "Formato de fechas inválido" },
        {
          status: 404,
          expectedMessage:
            "No hay transacciones para el rango de fechas seleccionado",
        },
        {
          status: 503,
          expectedMessage: "Error de conexión. Por favor, intenta nuevamente",
        },
        {
          status: 500,
          expectedMessage: "Error del servidor. Por favor, intenta más tarde",
        },
        {
          status: 502,
          expectedMessage: "Error del servidor. Por favor, intenta más tarde",
        },
      ];

      for (const { status, expectedMessage } of errorCases) {
        const mockResponse = { ok: false, status };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        await expect(
          downloadTransactions({
            from: new Date("2024-01-01"),
            to: new Date("2024-01-31"),
          })
        ).rejects.toThrow(expectedMessage);
      }
    });

    it("debe manejar códigos de error no específicos", async () => {
      const mockResponse = { ok: false, status: 418 }; // I'm a teapot
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(
        downloadTransactions({
          from: new Date("2024-01-01"),
          to: new Date("2024-01-31"),
        })
      ).rejects.toThrow("Error al descargar las transacciones");
    });

    it("debe lanzar error si el contenido no es CSV", async () => {
      const mockResponse = {
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        blob: () =>
          Promise.resolve(new Blob(["test"], { type: "application/json" })),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(
        downloadTransactions({
          from: new Date("2024-01-01"),
          to: new Date("2024-01-31"),
        })
      ).rejects.toThrow("El archivo descargado no es un CSV válido");
    });

    it("debe lanzar error si el archivo está vacío", async () => {
      const mockResponse = {
        ok: true,
        headers: new Headers({ "content-type": "text/csv" }),
        blob: () => Promise.resolve(new Blob([], { type: "text/csv" })),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(
        downloadTransactions({
          from: new Date("2024-01-01"),
          to: new Date("2024-01-31"),
        })
      ).rejects.toThrow("El archivo descargado está vacío");
    });
  });

  describe("Manejo de errores", () => {
    it("debe manejar errores de fetch", async () => {
      const networkError = new Error("Network error");
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      await expect(
        downloadTransactions({
          from: new Date("2024-01-01"),
          to: new Date("2024-01-31"),
        })
      ).rejects.toThrow("Network error");
    });

    it("debe manejar errores desconocidos", async () => {
      (global.fetch as jest.Mock).mockRejectedValue("Unknown error");

      await expect(
        downloadTransactions({
          from: new Date("2024-01-01"),
          to: new Date("2024-01-31"),
        })
      ).rejects.toThrow("Error desconocido al descargar las transacciones");
    });
  });

  describe("Formato de fechas", () => {
    it("debe formatear correctamente las fechas en el nombre del archivo", async () => {
      const mockResponse = {
        ok: true,
        headers: new Headers({ "content-type": "text/csv" }),
        blob: () => Promise.resolve(new Blob(["test"], { type: "text/csv" })),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await downloadTransactions({
        from: new Date("2024-12-25"),
        to: new Date("2024-12-31"),
      });

      expect(mockLink.download).toBe(
        "transactions_2024-12-25_to_2024-12-31.csv"
      );
    });
  });
});
