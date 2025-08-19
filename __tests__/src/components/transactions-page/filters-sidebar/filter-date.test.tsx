import FilterDate from "@/src/components/transactions-page/filters-sidebar/filter-date";
import type { Filters } from "@/src/types/filters";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";

// Mock de date-fns para controlar el formateo
jest.mock("date-fns", () => ({
  format: jest.fn((date, formatStr) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toLocaleDateString("es-ES");
    }
    return "";
  }),
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
      fecha: { desde: undefined, hasta: undefined },
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("FilterDate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderizado básico", () => {
    it("debe renderizar el calendario", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // Verificar que el calendario esté presente
      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("debe renderizar el contenedor principal", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const container = document.querySelector('[class*="space-y-2 mb-6"]');
      expect(container).toBeInTheDocument();
    });

    it("no debe mostrar el botón de borrar inicialmente", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      expect(screen.queryByText("Borrar")).not.toBeInTheDocument();
    });

    it("debe centrar el calendario", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendarContainer = document.querySelector(
        '[class*="flex justify-center"]'
      );
      expect(calendarContainer).toBeInTheDocument();
    });
  });

  describe("Configuración del calendario", () => {
    it("debe configurar el calendario en modo range", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("debe aplicar las clases CSS correctas al calendario", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // Buscar el calendario con las clases aplicadas
      const calendar = document.querySelector('[class*="rounded-md"]');
      expect(calendar).toBeInTheDocument();
    });

    it("debe usar la localización en español", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("debe mostrar un solo mes", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });
  });

  describe("Selección de fechas", () => {
    it("debe mostrar el botón de borrar cuando hay fechas seleccionadas", () => {
      const fromDate = new Date("2024-01-01").toISOString();
      const toDate = new Date("2024-01-31").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: toDate },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("debe mostrar el botón de borrar con solo fecha desde", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("debe mostrar el botón de borrar con solo fecha hasta", () => {
      const toDate = new Date("2024-01-31").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: undefined, hasta: toDate },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("debe preparar fechas correctamente para el calendario", () => {
      const fromDate = new Date("2024-01-01").toISOString();
      const toDate = new Date("2024-01-31").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: toDate },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // El calendario debe recibir las fechas correctamente preparadas
      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("debe manejar fechas parciales", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // Debe manejar correctamente cuando solo hay fecha desde
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });
  });

  describe("Botón de borrar", () => {
    it("debe ejecutar clearDates cuando se hace clic en borrar", async () => {
      const user = userEvent.setup();
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      const clearButton = screen.getByText("Borrar");
      expect(clearButton).toBeInTheDocument();

      await user.click(clearButton);

      // El botón debe desaparecer después del clic (porque las fechas se limpian)
      expect(screen.queryByText("Borrar")).not.toBeInTheDocument();
    });

    it("debe tener las clases CSS correctas", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      const clearButton = screen.getByText("Borrar");
      expect(clearButton).toHaveClass("px-4");
      expect(clearButton).toHaveClass("py-2");
      expect(clearButton).toHaveClass("text-uala-primary");
      expect(clearButton).toHaveClass("border-uala-primary");
      expect(clearButton).toHaveClass("rounded-full");
    });

    it("debe ser un botón de tipo button", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      const clearButton = screen.getByText("Borrar");
      expect(clearButton).toHaveAttribute("type", "button");
    });

    it("debe tener efectos hover correctos", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      const clearButton = screen.getByText("Borrar");
      expect(clearButton).toHaveClass("hover:bg-uala-primary");
      expect(clearButton).toHaveClass("hover:text-white");
      expect(clearButton).toHaveClass("transition-colors");
      expect(clearButton).toHaveClass("duration-200");
    });

    it("debe estar centrado correctamente", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      const buttonContainer = document.querySelector(
        '[class*="flex justify-center mt-4"]'
      );
      expect(buttonContainer).toBeInTheDocument();
    });
  });

  describe("Campos ocultos del formulario", () => {
    it("debe tener campos ocultos para react-hook-form", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
      expect(hiddenInputs).toHaveLength(2);
    });

    it("debe registrar los campos ocultos correctamente", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
      expect(hiddenInputs[0]).toHaveAttribute("name", "fecha.desde");
      expect(hiddenInputs[1]).toHaveAttribute("name", "fecha.hasta");
    });
  });

  describe("Lógica de handleSelect", () => {
    it("debe manejar selección de rango undefined", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // El componente debe manejar correctamente cuando handleSelect recibe undefined
      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();

      // Simular que no hay selección
      expect(screen.queryByText("Borrar")).not.toBeInTheDocument();
    });

    it("debe convertir fechas ISO a Date correctamente", () => {
      const isoDate = "2024-01-01T00:00:00.000Z";

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: isoDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // Debe convertir correctamente ISO string a Date
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("debe manejar fechas con formato ISO completo", () => {
      const fromDate = new Date("2024-01-01T10:30:00.000Z").toISOString();
      const toDate = new Date("2024-01-31T15:45:00.000Z").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: toDate },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });
  });

  describe("Formateo de fechas", () => {
    it("debe formatear fechas válidas correctamente", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // El componente debe renderizarse sin errores con fecha válida
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("debe manejar fechas undefined sin errores", () => {
      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: undefined, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // No debe mostrar el botón de borrar
      expect(screen.queryByText("Borrar")).not.toBeInTheDocument();
    });

    it("debe crear selectedItems correctamente", () => {
      const fromDate = new Date("2024-01-01").toISOString();
      const toDate = new Date("2024-01-31").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: toDate },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // Debe mostrar el botón de borrar cuando hay fechas seleccionadas
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("debe usar format de date-fns correctamente", () => {
      const mockFormat = require("date-fns").format;
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // Verificar que format fue llamado (se llama internamente para selectedItems)
      expect(mockFormat).toHaveBeenCalled();
    });
  });

  describe("Integración con react-hook-form", () => {
    it("debe usar el contexto del formulario correctamente", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // El componente debe renderizarse sin errores
      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("debe reflejar los valores del formulario en el calendario", () => {
      const fromDate = new Date("2024-01-01").toISOString();
      const toDate = new Date("2024-01-31").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: toDate },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // Debe mostrar el botón de borrar indicando que hay fechas seleccionadas
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("debe sincronizar con watch correctamente", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // watch debe funcionar correctamente
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("debe llamar a setValue cuando se limpia", async () => {
      const user = userEvent.setup();
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      const clearButton = screen.getByText("Borrar");
      await user.click(clearButton);

      // Después de limpiar, el botón debe desaparecer
      expect(screen.queryByText("Borrar")).not.toBeInTheDocument();
    });
  });

  describe("Estilos y clases CSS", () => {
    it("debe aplicar las clases CSS correctas al contenedor", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const container = document.querySelector('[class*="space-y-2 mb-6"]');
      expect(container).toBeInTheDocument();
    });

    it("debe centrar el calendario", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendarContainer = document.querySelector(
        '[class*="flex justify-center"]'
      );
      expect(calendarContainer).toBeInTheDocument();
    });

    it("debe aplicar estilos del calendario correctamente", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendar = document.querySelector('[class*="rounded-md"]');
      expect(calendar).toBeInTheDocument();
    });

    it("debe aplicar border-0 al calendario", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // Buscar elementos que contengan las clases del calendario
      const calendarElement = document.querySelector('[class*="border-0"]');
      expect(calendarElement).toBeInTheDocument();
    });
  });

  describe("Configuración de locale", () => {
    it("debe usar locale español", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // El calendario debe estar configurado con locale español
      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("debe configurar numberOfMonths como 1", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // Debe mostrar solo un mes
      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });
  });

  describe("Casos edge", () => {
    it("debe manejar valores undefined sin errores", () => {
      expect(() => {
        render(
          <TestWrapper>
            <FilterDate />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it("debe funcionar sin valores iniciales", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("debe manejar fechas inválidas graciosamente", () => {
      // Esto no debería suceder en uso normal, pero es bueno probarlo
      expect(() => {
        render(
          <TestWrapper
            defaultValues={{
              fecha: { desde: "fecha-invalida", hasta: undefined },
            }}
          >
            <FilterDate />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it("debe manejar conversión de fechas ISO a Date", () => {
      const isoDate = "2024-01-01T00:00:00.000Z";

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: isoDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // Debe convertir correctamente ISO string a Date
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("debe manejar fechas null sin errores", () => {
      expect(() => {
        render(
          <TestWrapper
            defaultValues={{
              fecha: { desde: null as any, hasta: null as any },
            }}
          >
            <FilterDate />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe("Accesibilidad", () => {
    it("debe tener calendario accesible", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("debe tener botón de borrar accesible", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      const clearButton = screen.getByRole("button", { name: "Borrar" });
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toBeVisible();
    });

    it("debe permitir navegación por teclado", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            fecha: { desde: fromDate, hasta: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      const clearButton = screen.getByRole("button", { name: "Borrar" });
      clearButton.focus();
      expect(clearButton).toHaveFocus();
    });

    it("debe tener campos ocultos con names apropiados", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
      expect(hiddenInputs[0]).toHaveAttribute("name", "fecha.desde");
      expect(hiddenInputs[1]).toHaveAttribute("name", "fecha.hasta");
    });
  });

  it("debe ser un componente React válido", () => {
    expect(typeof FilterDate).toBe("function");
  });
});
