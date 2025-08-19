import FiltersSidebar from "@/src/components/transactions-page/filters-sidebar/filters-sidebar";
import type { Filters } from "@/src/types/filters";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";

// Mock del hook useFilters
jest.mock("@/hooks/use-filters", () => ({
  useFilters: jest.fn(() => ({
    form: {
      getValues: jest.fn(() => ({
        paymentMethods: [],
        card: [],
        installments: [],
        date: { from: undefined, to: undefined },
        amount: { min: undefined, max: undefined },
      })),
      reset: jest.fn(),
      setValue: jest.fn(),
      clearErrors: jest.fn(),
      trigger: jest.fn(),
      watch: jest.fn(() => ({
        paymentMethods: [],
        card: [],
        installments: [],
        date: { from: undefined, to: undefined },
        amount: { min: undefined, max: undefined },
      })),
      register: jest.fn(() => ({
        onChange: jest.fn(),
        onBlur: jest.fn(),
        name: "test",
        ref: jest.fn(),
      })),
    },
    applyFilters: jest.fn(),
    clearAllFilters: jest.fn(),
    hasActiveFilters: jest.fn(() => false),
    currentFilters: {
      paymentMethods: [],
      card: [],
      installments: [],
      date: { from: undefined, to: undefined },
      amount: { min: undefined, max: undefined },
    },
  })),
}));

// Mock de las constantes
jest.mock("@/constants/filter-options", () => ({
  AMOUNT_FILTER_CONFIG: {
    min: 0,
    max: 10000,
  },
  CARD_OPTIONS: [
    { value: "visa", label: "Visa" },
    { value: "mastercard", label: "Mastercard" },
    { value: "amex", label: "American Express" },
  ],
  INSTALLMENT_OPTIONS: [
    { value: "1", label: "1 cuota" },
    { value: "3", label: "3 cuotas" },
    { value: "6", label: "6 cuotas" },
    { value: "12", label: "12 cuotas" },
  ],
  PAYMENT_METHOD_OPTIONS: [
    { value: "link", label: "Link de pago" },
    { value: "qr", label: "QR" },
    { value: "mpos", label: "MPOS" },
    { value: "pospro", label: "POS Pro" },
  ],
}));

// Componente wrapper para proporcionar el contexto del formulario
function TestWrapper({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: Partial<Filters>;
}) {
  const methods = useForm<Filters>({
    defaultValues: {
      date: { from: undefined, to: undefined },
      amount: { min: undefined, max: undefined },
      card: [],
      installments: [],
      paymentMethods: [],
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("FiltersSidebar", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderizado básico", () => {
    it("debe renderizar el sidebar cuando isOpen es true", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(screen.getByText("Filtros")).toBeInTheDocument();
    });

    it("no debe renderizar el sidebar cuando isOpen es false", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={false} onClose={mockOnClose} />
        </TestWrapper>
      );

      // El sidebar se renderiza pero está oculto con CSS transform
      const hiddenSidebar = document.querySelector(
        '[class*="translate-x-full"]'
      );
      expect(hiddenSidebar).toBeInTheDocument();
    });

    it("debe renderizar el título correcto", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(screen.getByText("Filtros")).toBeInTheDocument();
    });

    it("debe renderizar el botón de cerrar", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(
        screen.getByRole("button", { name: /arrow left/i })
      ).toBeInTheDocument();
    });
  });

  describe("Funcionalidad del botón cerrar", () => {
    it("debe llamar a onClose cuando se hace clic en cerrar", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const closeButton = screen.getByRole("button", { name: /arrow left/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("debe ser un botón accesible", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const closeButton = screen.getByRole("button", { name: /arrow left/i });
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toBeVisible();
    });
  });

  describe("Estructura del sidebar", () => {
    it("debe tener la estructura de overlay correcta", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const overlay = document.querySelector('[class*="fixed inset-0"]');
      expect(overlay).toBeInTheDocument();
    });

    it("debe tener el contenedor del sidebar con las clases correctas", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const sidebar = document.querySelector(
        '[class*="fixed w-full lg:w-xl top-0 right-0 h-full bg-[#fafafa]"]'
      );
      expect(sidebar).toBeInTheDocument();
    });

    it("debe tener el header con el título y botón de cerrar", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const header = document.querySelector(
        '[class*="flex items-center gap-6"]'
      );
      expect(header).toBeInTheDocument();
    });

    it("debe tener el contenido scrolleable", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const content = document.querySelector('[class*="overflow-y-auto"]');
      expect(content).toBeInTheDocument();
    });
  });

  describe("Integración con react-hook-form", () => {
    it("debe proporcionar el contexto del formulario a los componentes hijos", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      // Verificar que el formulario se renderiza correctamente
      expect(screen.getByText("Todos los filtros")).toBeInTheDocument();
    });

    it("debe manejar valores predeterminados del formulario", () => {
      render(
        <TestWrapper defaultValues={{ card: ["visa"] }}>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      // Verificar que el componente se renderiza correctamente con valores por defecto
      expect(screen.getByText("Todos los filtros")).toBeInTheDocument();
    });
  });

  describe("Accesibilidad", () => {
    it("debe tener un título accesible", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const title = screen.getByText("Filtros");
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe("SPAN");
    });

    it("debe permitir navegación por teclado", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const closeButton = screen.getByRole("button", { name: /arrow left/i });
      expect(closeButton).toBeInTheDocument();

      closeButton.focus();
      expect(closeButton).toHaveFocus();
    });
  });

  describe("Estilos y clases CSS", () => {
    it("debe aplicar las clases CSS correctas al overlay", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const overlay = document.querySelector(
        '[class*="fixed inset-0 bg-white/80"]'
      );
      expect(overlay).toBeInTheDocument();
    });

    it("debe aplicar las clases CSS correctas al sidebar", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const sidebar = document.querySelector(
        '[class*="fixed w-full lg:w-xl top-0 right-0 h-full bg-[#fafafa]"]'
      );
      expect(sidebar).toBeInTheDocument();
    });

    it("debe aplicar estilos al botón de cerrar", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const closeButton = screen.getByRole("button", { name: /arrow left/i });
      const svg = closeButton.querySelector("svg");
      expect(svg).toHaveClass("text-uala-primary");
    });
  });

  describe("Casos edge", () => {
    it("debe manejar onClose undefined sin errores", () => {
      expect(() => {
        render(
          <TestWrapper>
            <FiltersSidebar isOpen={true} onClose={undefined as any} />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it("debe funcionar con formulario sin valores iniciales", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(screen.getByText("Filtros")).toBeInTheDocument();
    });

    it("debe manejar múltiples aperturas y cierres", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <TestWrapper>
          <FiltersSidebar isOpen={false} onClose={mockOnClose} />
        </TestWrapper>
      );

      // Inicialmente cerrado - el sidebar está oculto con CSS transform
      const initiallyClosedSidebar = document.querySelector(
        '[class*="translate-x-full"]'
      );
      expect(initiallyClosedSidebar).toBeInTheDocument();

      // Abrir
      rerender(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );
      expect(screen.getByText("Filtros")).toBeInTheDocument();

      // Cerrar
      rerender(
        <TestWrapper>
          <FiltersSidebar isOpen={false} onClose={mockOnClose} />
        </TestWrapper>
      );
      // El sidebar se oculta con CSS transform, no se remueve del DOM
      const closedSidebar = document.querySelector(
        '[class*="translate-x-full"]'
      );
      expect(closedSidebar).toBeInTheDocument();
    });
  });

  describe("Manejo del scroll del body", () => {
    it("debe bloquear el scroll del body cuando el sidebar está abierto", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("debe desbloquear el scroll del body cuando el sidebar se cierra", () => {
      const { rerender } = render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(document.body.style.overflow).toBe("hidden");

      rerender(
        <TestWrapper>
          <FiltersSidebar isOpen={false} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(document.body.style.overflow).toBe("unset");
    });

    it("debe restaurar el scroll del body al desmontar el componente", () => {
      const { unmount } = render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(document.body.style.overflow).toBe("hidden");

      unmount();

      expect(document.body.style.overflow).toBe("unset");
    });
  });

  describe("Overlay y navegación", () => {
    it("debe cerrar el sidebar cuando se hace clic en el overlay", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const overlay = document.querySelector(
        '[class*="fixed inset-0 bg-white/80"]'
      );
      expect(overlay).toBeInTheDocument();

      if (overlay) {
        await user.click(overlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it("debe tener el z-index correcto para el overlay y sidebar", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const overlay = document.querySelector('[class*="z-40"]');
      const sidebar = document.querySelector('[class*="z-50"]');

      expect(overlay).toBeInTheDocument();
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe("Renderizado condicional", () => {
    it("debe renderizar el sidebar oculto cuando isOpen es false", () => {
      const { container } = render(
        <TestWrapper>
          <FiltersSidebar isOpen={false} onClose={mockOnClose} />
        </TestWrapper>
      );

      // El sidebar se renderiza pero está oculto con CSS transform
      const hiddenSidebar = document.querySelector(
        '[class*="translate-x-full"]'
      );
      expect(hiddenSidebar).toBeInTheDocument();
    });

    it("debe renderizar el contenido completo cuando isOpen es true", () => {
      render(
        <TestWrapper>
          <FiltersSidebar isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(screen.getByText("Filtros")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /arrow left/i })
      ).toBeInTheDocument();
      expect(screen.getByText("Todos los filtros")).toBeInTheDocument();
    });
  });

  it("debe ser un componente React válido", () => {
    expect(typeof FiltersSidebar).toBe("function");
  });
});
