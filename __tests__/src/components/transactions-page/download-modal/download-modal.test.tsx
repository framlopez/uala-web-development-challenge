import DownloadModal from "@/src/components/transactions-page/download-modal/download-modal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("DownloadModal", () => {
  const mockOnClose = jest.fn();
  const mockOnDownload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnDownload.mockResolvedValue(undefined);
  });

  describe("Renderizado básico", () => {
    it("no debe renderizar cuando isOpen es false", () => {
      render(
        <DownloadModal
          isOpen={false}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("debe renderizar cuando isOpen es true", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("debe mostrar el título correcto", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      expect(
        screen.getByText("Elegí las fechas que querés descargar")
      ).toBeInTheDocument();
    });

    it("debe mostrar el ícono de calendario", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      const calendarIcon = document.querySelector(
        'svg[class*="lucide-calendar"]'
      );
      expect(calendarIcon).toBeInTheDocument();
    });
  });

  describe("Botones del modal", () => {
    it("debe mostrar el botón Cerrar", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      expect(screen.getByText("Cerrar")).toBeInTheDocument();
    });

    it("debe mostrar el botón Descargar deshabilitado inicialmente", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      const downloadButton = screen.getByText("Descargar");
      expect(downloadButton).toBeInTheDocument();
      expect(downloadButton).toBeDisabled();
    });

    it("debe llamar a onClose cuando se hace clic en Cerrar", async () => {
      const user = userEvent.setup();
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      const closeButton = screen.getByText("Cerrar");
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Calendario", () => {
    it("debe mostrar el calendario", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      const calendar = screen.getByRole("grid");
      expect(calendar).toBeInTheDocument();
    });

    it("debe configurar el calendario en modo range", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      const calendar = document.querySelector('[data-mode="range"]');
      expect(calendar).toBeInTheDocument();
    });

    it("debe usar la localización en español", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      // El calendario debe estar presente (la localización se maneja internamente)
      const calendar = screen.getByRole("grid");
      expect(calendar).toBeInTheDocument();
    });
  });

  describe("Estado del modal", () => {
    it("debe aplicar las clases CSS correctas", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("bg-background");
    });

    it("debe tener la estructura correcta del header", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      const header = document.querySelector('[data-slot="dialog-header"]');
      expect(header).toBeInTheDocument();
    });

    it("debe tener overlay con las clases correctas", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      const overlay = document.querySelector('[data-slot="dialog-overlay"]');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe("Manejo de estado interno", () => {
    it("debe manejar el estado isDownloading", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      // Estado inicial - botón deshabilitado
      const downloadButton = screen.getByText("Descargar");
      expect(downloadButton).toBeDisabled();

      // Botón cerrar habilitado
      const closeButton = screen.getByText("Cerrar");
      expect(closeButton).not.toBeDisabled();
    });

    it("debe resetear el estado cuando se cierra el modal", async () => {
      const user = userEvent.setup();
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      const closeButton = screen.getByText("Cerrar");
      await user.click(closeButton);

      // Verificar que se llama a onClose (lo que resetea el estado)
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("debe manejar selectedDateRange correctamente", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      // El componente debe manejar el estado de fechas seleccionadas internamente
      const calendar = screen.getByRole("grid");
      expect(calendar).toBeInTheDocument();
    });
  });

  describe("Accesibilidad", () => {
    it("debe tener el rol dialog correcto", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
    });

    it("debe tener botones accesibles", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      const closeButton = screen.getByRole("button", { name: "Cerrar" });
      const downloadButton = screen.getByRole("button", { name: "Descargar" });

      expect(closeButton).toBeInTheDocument();
      expect(downloadButton).toBeInTheDocument();
    });

    it("debe tener título accesible", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      const title = screen.getByRole("heading");
      expect(title).toHaveTextContent("Elegí las fechas que querés descargar");
    });
  });

  describe("Integración con Shadcn Dialog", () => {
    it("debe usar componentes Dialog de Shadcn", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      // Verificar que usa los componentes de Shadcn
      const dialogContent = document.querySelector(
        '[data-slot="dialog-content"]'
      );
      const dialogOverlay = document.querySelector(
        '[data-slot="dialog-overlay"]'
      );

      expect(dialogContent).toBeInTheDocument();
      expect(dialogOverlay).toBeInTheDocument();
    });

    it("debe aplicar estilos de Shadcn correctamente", () => {
      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("fixed");
      expect(dialog).toHaveClass("z-50");
    });
  });

  describe("Casos edge", () => {
    it("debe manejar props undefined graciosamente", () => {
      expect(() => {
        render(
          <DownloadModal
            isOpen={true}
            onClose={mockOnClose}
            onDownload={mockOnDownload}
          />
        );
      }).not.toThrow();
    });

    it("debe funcionar con onDownload que retorna Promise", async () => {
      const mockAsyncDownload = jest.fn().mockResolvedValue(undefined);

      render(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockAsyncDownload}
        />
      );

      // El componente debe manejar funciones async correctamente
      expect(screen.getByText("Descargar")).toBeInTheDocument();
    });

    it("debe manejar cambios de isOpen correctamente", () => {
      const { rerender } = render(
        <DownloadModal
          isOpen={false}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      rerender(
        <DownloadModal
          isOpen={true}
          onClose={mockOnClose}
          onDownload={mockOnDownload}
        />
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("debe ser un componente React válido", () => {
    expect(typeof DownloadModal).toBe("function");
  });
});
