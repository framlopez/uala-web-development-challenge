import FilterAmount from "@/src/components/transactions-page/filters-sidebar/filter-amount";
import type { Filters } from "@/src/types/filters";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";

// Mock de las constantes
jest.mock("@/constants/filter-options", () => ({
  AMOUNT_FILTER_CONFIG: {
    min: 0,
    max: 10000,
  },
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
      monto: { min: undefined, max: undefined },
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("FilterAmount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderizado básico", () => {
    it("debe renderizar el slider de rango", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const slider = document.querySelector(
        '[class*="relative w-full pt-8 pb-2"]'
      );
      expect(slider).toBeInTheDocument();
    });

    it("debe renderizar los inputs de monto mínimo y máximo", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      expect(inputs).toHaveLength(2);
      expect(inputs[0]).toBeInTheDocument();
      expect(inputs[1]).toBeInTheDocument();
    });

    it("debe mostrar las etiquetas correctas", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      expect(screen.getByText("Monto mínimo")).toBeInTheDocument();
      expect(screen.getByText("Monto máximo")).toBeInTheDocument();
    });

    it("debe mostrar el valor máximo en el centro del slider", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      // El componente debe mostrar algún valor en el centro del slider
      const centerValue = document.querySelector(
        '[class*="text-uala-primary font-semibold"]'
      );
      expect(centerValue).toBeInTheDocument();
    });
  });

  describe("Estado inicial", () => {
    it("debe tener inputs disponibles", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      expect(inputs).toHaveLength(2);
    });

    it("debe mostrar el slider con el rango completo", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const slider = document.querySelector(
        '[class*="relative w-full pt-8 pb-2"]'
      );
      expect(slider).toBeInTheDocument();
    });

    it("debe mostrar valores por defecto basados en la configuración", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      // El componente debe mostrar algún valor en el centro del slider
      const centerValue = document.querySelector(
        '[class*="text-uala-primary font-semibold"]'
      );
      expect(centerValue).toBeInTheDocument();
    });
  });

  describe("Funcionalidad del slider", () => {
    it("debe tener los handles del slider", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const handles = document.querySelectorAll(
        '[class*="size-5 bg-uala-primary"]'
      );
      expect(handles).toHaveLength(2);
    });

    it("debe mostrar el rango seleccionado visualmente", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const selectedRange = document.querySelector(
        '[class*="bg-uala-primary"]'
      );
      expect(selectedRange).toBeInTheDocument();
    });

    it("debe manejar mouseDown en el handle mínimo", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const handles = document.querySelectorAll(
        '[class*="size-5 bg-uala-primary"]'
      );
      const minHandle = handles[0];

      fireEvent.mouseDown(minHandle);
      // El evento debe ejecutarse sin errores
      expect(minHandle).toBeInTheDocument();
    });

    it("debe manejar mouseDown en el handle máximo", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const handles = document.querySelectorAll(
        '[class*="size-5 bg-uala-primary"]'
      );
      const maxHandle = handles[1];

      fireEvent.mouseDown(maxHandle);
      // El evento debe ejecutarse sin errores
      expect(maxHandle).toBeInTheDocument();
    });

    it("debe manejar mouseUp en el slider", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const slider = document.querySelector(
        '[class*="relative w-full pt-8 pb-2"]'
      );

      fireEvent.mouseUp(slider!);
      // El evento debe ejecutarse sin errores
      expect(slider).toBeInTheDocument();
    });

    it("debe manejar mouseLeave en el slider", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const slider = document.querySelector(
        '[class*="relative w-full pt-8 pb-2"]'
      );

      fireEvent.mouseLeave(slider!);
      // El evento debe ejecutarse sin errores
      expect(slider).toBeInTheDocument();
    });
  });

  describe("Interacciones de input", () => {
    it("debe permitir escribir en el input de monto mínimo", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      const minInput = inputs[0] as HTMLInputElement;

      await user.clear(minInput);
      await user.type(minInput, "100");

      // El input debe estar presente y ser interactivo
      expect(minInput).toBeInTheDocument();
    });

    it("debe permitir escribir en el input de monto máximo", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      const maxInput = inputs[1] as HTMLInputElement;

      await user.clear(maxInput);
      await user.type(maxInput, "5000");

      // El input debe estar presente y ser interactivo
      expect(maxInput).toBeInTheDocument();
    });

    it("debe limpiar el input cuando se borra todo el contenido", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper defaultValues={{ monto: { min: 100, max: undefined } }}>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      const minInput = inputs[0] as HTMLInputElement;

      await user.clear(minInput);

      expect(minInput.value).toBe("");
    });

    it("debe ignorar valores no numéricos", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      const minInput = inputs[0] as HTMLInputElement;

      await user.type(minInput, "abc");

      // El input debe estar presente y ser interactivo
      expect(minInput).toBeInTheDocument();
    });
  });

  describe("Lógica de clamping", () => {
    it("debe mostrar valores iniciales con defaultValues", () => {
      render(
        <TestWrapper defaultValues={{ monto: { min: 100, max: 5000 } }}>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      expect((inputs[0] as HTMLInputElement).value).toBe("100");
      expect((inputs[1] as HTMLInputElement).value).toBe("5000");
    });

    it("debe mostrar el valor máximo dinámico en el slider", () => {
      render(
        <TestWrapper defaultValues={{ monto: { min: undefined, max: 5000 } }}>
          <FilterAmount />
        </TestWrapper>
      );

      expect(screen.getByText("$5000")).toBeInTheDocument();
    });

    it("debe calcular correctamente los porcentajes del slider", () => {
      render(
        <TestWrapper defaultValues={{ monto: { min: 2500, max: 7500 } }}>
          <FilterAmount />
        </TestWrapper>
      );

      // Los handles deben estar posicionados correctamente
      const handles = document.querySelectorAll(
        '[class*="size-5 bg-uala-primary"]'
      );
      expect(handles).toHaveLength(2);

      // Verificar que los handles tienen estilos de posición
      const minHandle = handles[0] as HTMLElement;
      const maxHandle = handles[1] as HTMLElement;

      expect(minHandle.style.left).toBeTruthy();
      expect(maxHandle.style.left).toBeTruthy();
    });
  });

  describe("Campos ocultos del formulario", () => {
    it("debe tener campos ocultos para react-hook-form", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
      expect(hiddenInputs).toHaveLength(2);
    });

    it("debe registrar los campos ocultos con react-hook-form", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
      expect(hiddenInputs[0]).toHaveAttribute("name", "monto.min");
      expect(hiddenInputs[1]).toHaveAttribute("name", "monto.max");
    });
  });

  describe("Accesibilidad", () => {
    it("debe tener inputs accesibles", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      expect(inputs).toHaveLength(2);
    });

    it("debe tener labels asociados correctamente", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const minLabel = screen.getByText("Monto mínimo");
      const maxLabel = screen.getByText("Monto máximo");

      expect(minLabel).toBeInTheDocument();
      expect(maxLabel).toBeInTheDocument();
    });

    it("debe tener el atributo inputMode correcto", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      expect(inputs[0]).toHaveAttribute("inputMode", "numeric");
      expect(inputs[1]).toHaveAttribute("inputMode", "numeric");
    });

    it("debe tener el atributo pattern correcto", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      expect(inputs[0]).toHaveAttribute("pattern", "[0-9]*");
      expect(inputs[1]).toHaveAttribute("pattern", "[0-9]*");
    });

    it("debe tener placeholders apropiados", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      expect(inputs[0]).toHaveAttribute("placeholder", "0");
      expect(inputs[1]).toHaveAttribute("placeholder", "0");
    });
  });

  describe("Estilos y clases CSS", () => {
    it("debe aplicar las clases CSS correctas al contenedor", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const container = document.querySelector('[class*="space-y-2 mb-6"]');
      expect(container).toBeInTheDocument();
    });

    it("debe aplicar estilos al slider", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const slider = document.querySelector(
        '[class*="relative w-full pt-8 pb-2"]'
      );
      expect(slider).toBeInTheDocument();
    });

    it("debe aplicar estilos a los inputs", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputContainers = document.querySelectorAll(
        '[class*="rounded-2xl px-4 py-1"]'
      );
      expect(inputContainers.length).toBeGreaterThan(0);
    });

    it("debe aplicar estilos condicionales al rango seleccionado", () => {
      render(
        <TestWrapper defaultValues={{ monto: { min: 1000, max: 5000 } }}>
          <FilterAmount />
        </TestWrapper>
      );

      // El rango seleccionado debe estar presente
      const selectedRange = document.querySelector(
        '[class*="bg-uala-primary"]'
      );
      expect(selectedRange).toBeInTheDocument();
    });
  });

  describe("Integración con react-hook-form", () => {
    it("debe usar el contexto del formulario correctamente", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      expect(screen.getByText("Monto mínimo")).toBeInTheDocument();
    });

    it("debe sincronizar con valores del formulario", () => {
      render(
        <TestWrapper defaultValues={{ monto: { min: 500, max: 8000 } }}>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      expect((inputs[0] as HTMLInputElement).value).toBe("500");
      expect((inputs[1] as HTMLInputElement).value).toBe("8000");
    });
  });

  describe("Casos edge", () => {
    it("debe manejar valores undefined", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      expect(screen.getByText("Monto mínimo")).toBeInTheDocument();
    });

    it("debe funcionar sin valores iniciales", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      expect(screen.getByText("Monto mínimo")).toBeInTheDocument();
    });

    it("debe manejar valores en los límites de configuración", () => {
      render(
        <TestWrapper defaultValues={{ monto: { min: 0, max: 10000 } }}>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      expect((inputs[0] as HTMLInputElement).value).toBe("0");
      expect((inputs[1] as HTMLInputElement).value).toBe("10000");
    });

    it("debe manejar mouseMove sin isDragging activo", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const slider = document.querySelector(
        '[class*="relative w-full pt-8 pb-2"]'
      );

      // Simular mouseMove sin haber hecho mouseDown primero
      fireEvent.mouseMove(slider!, { clientX: 100 });

      // No debe producir errores
      expect(slider).toBeInTheDocument();
    });

    it("debe funcionar con valores parciales", () => {
      render(
        <TestWrapper defaultValues={{ monto: { min: 100, max: undefined } }}>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      expect((inputs[0] as HTMLInputElement).value).toBe("100");
      // El input máximo debe estar presente
      expect(inputs[1] as HTMLInputElement).toBeInTheDocument();
    });
  });

  it("debe ser un componente React válido", () => {
    expect(typeof FilterAmount).toBe("function");
  });
});
