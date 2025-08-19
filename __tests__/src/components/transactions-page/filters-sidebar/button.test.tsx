import FiltersSidebarButton from "@/src/components/transactions-page/filters-sidebar/button";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("FiltersSidebarButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderizado básico", () => {
    it("debe renderizar el componente correctamente", () => {
      render(<FiltersSidebarButton />);

      // Buscar el botón principal por su SVG específico
      const filterIcon = document.querySelector('svg[viewBox="0 0 24 24"]');
      expect(filterIcon).toBeInTheDocument();
    });

    it("debe tener las clases CSS correctas en el botón", () => {
      render(<FiltersSidebarButton />);

      const button = document.querySelector(
        'button[class*="text-uala-primary"]'
      );
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("text-uala-primary");
    });

    it("no debe mostrar el sidebar inicialmente", () => {
      render(<FiltersSidebarButton />);

      // El sidebar debe estar cerrado (transform translate-x-full)
      const sidebar = document.querySelector('[class*="translate-x-full"]');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe("Funcionalidad", () => {
    it("debe abrir el sidebar cuando se hace clic", async () => {
      const user = userEvent.setup();
      render(<FiltersSidebarButton />);

      // Buscar y hacer clic en el botón principal
      const button = document.querySelector(
        'button[class*="text-uala-primary"]'
      );
      expect(button).toBeInTheDocument();

      await user.click(button!);

      // Verificar que el sidebar se abre (ya no tiene translate-x-full)
      await waitFor(() => {
        const openSidebar = document.querySelector('[class*="translate-x-0"]');
        expect(openSidebar).toBeInTheDocument();
      });
    });

    it("debe cerrar el sidebar cuando se hace clic en cerrar", async () => {
      const user = userEvent.setup();
      render(<FiltersSidebarButton />);

      // Abrir el sidebar
      const button = document.querySelector(
        'button[class*="text-uala-primary"]'
      );
      await user.click(button!);

      // Esperar a que se abra
      await waitFor(() => {
        const openSidebar = document.querySelector('[class*="translate-x-0"]');
        expect(openSidebar).toBeInTheDocument();
      });

      // Buscar el botón de cerrar (flecha hacia la izquierda)
      const closeButton = document
        .querySelector('svg[viewBox="0 0 9 16"]')
        ?.closest("button");
      expect(closeButton).toBeInTheDocument();

      await user.click(closeButton!);

      // Verificar que se cierra
      await waitFor(() => {
        const closedSidebar = document.querySelector(
          '[class*="translate-x-full"]'
        );
        expect(closedSidebar).toBeInTheDocument();
      });
    });
  });

  describe("Contenido del sidebar", () => {
    it("debe mostrar el título 'Filtros' cuando está abierto", async () => {
      const user = userEvent.setup();
      render(<FiltersSidebarButton />);

      const button = document.querySelector(
        'button[class*="text-uala-primary"]'
      );
      await user.click(button!);

      await waitFor(() => {
        expect(screen.getByText("Filtros")).toBeInTheDocument();
      });
    });

    it("debe mostrar el botón 'Aplicar filtros' cuando está abierto", async () => {
      const user = userEvent.setup();
      render(<FiltersSidebarButton />);

      const button = document.querySelector(
        'button[class*="text-uala-primary"]'
      );
      await user.click(button!);

      await waitFor(() => {
        expect(screen.getByText("Aplicar filtros")).toBeInTheDocument();
      });
    });
  });

  describe("Estado del componente", () => {
    it("debe manejar múltiples aperturas y cierres", async () => {
      const user = userEvent.setup();
      render(<FiltersSidebarButton />);

      const button = document.querySelector(
        'button[class*="text-uala-primary"]'
      );

      // Primera apertura
      await user.click(button!);
      await waitFor(() => {
        expect(screen.getByText("Filtros")).toBeInTheDocument();
      });

      // Cerrar
      const closeButton = document
        .querySelector('svg[viewBox="0 0 9 16"]')
        ?.closest("button");
      await user.click(closeButton!);
      await waitFor(() => {
        // Verificar que el sidebar se oculta con CSS transform
        const closedSidebar = document.querySelector(
          '[class*="translate-x-full"]'
        );
        expect(closedSidebar).toBeInTheDocument();
      });

      // Segunda apertura
      await user.click(button!);
      await waitFor(() => {
        expect(screen.getByText("Filtros")).toBeInTheDocument();
      });
    });
  });

  describe("Accesibilidad", () => {
    it("debe tener botones accesibles", () => {
      render(<FiltersSidebarButton />);

      const button = document.querySelector(
        'button[class*="text-uala-primary"]'
      );
      expect(button).toBeInTheDocument();
      expect(button).toBeVisible();
    });
  });

  describe("Casos edge", () => {
    it("debe renderizar sin errores", () => {
      expect(() => render(<FiltersSidebarButton />)).not.toThrow();
    });
  });

  it("debe ser un componente React válido", () => {
    expect(typeof FiltersSidebarButton).toBe("function");
  });
});
