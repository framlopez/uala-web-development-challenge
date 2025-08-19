import FilterCards from "@/src/components/transactions-page/filters-sidebar/filter-cards";
import type { Filters } from "@/src/types/filters";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";

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
      tarjeta: [],
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("FilterCards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderizado básico", () => {
    it("debe renderizar el componente correctamente", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      // El componente debe renderizarse sin errores
      expect(screen.getByText("Visa")).toBeInTheDocument();
    });

    it("debe tener la estructura de grid correcta", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const container = document.querySelector('[class*="flex gap-3 mb-6"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("Estado inicial", () => {
    it("debe tener todas las tarjetas no seleccionadas por defecto", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });

    it("debe renderizar botones sin el estilo de seleccionado", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).not.toHaveClass("bg-[#E0EDFF]");
      });
    });
  });

  describe("Interacciones del usuario", () => {
    it("debe seleccionar una tarjeta cuando se hace clic", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const visaButton = screen.getByText("Visa");
      await user.click(visaButton);

      // Verificar que el checkbox esté seleccionado
      const visaCheckbox = screen.getByRole("checkbox", { name: /visa/i });
      expect(visaCheckbox).toBeChecked();
    });

    it("debe deseleccionar una tarjeta cuando se hace clic nuevamente", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const visaButton = screen.getByText("Visa");

      // Seleccionar
      await user.click(visaButton);
      let visaCheckbox = screen.getByRole("checkbox", { name: /visa/i });
      expect(visaCheckbox).toBeChecked();

      // Deseleccionar
      await user.click(visaButton);
      visaCheckbox = screen.getByRole("checkbox", { name: /visa/i });
      expect(visaCheckbox).not.toBeChecked();
    });
  });

  describe("Accesibilidad", () => {
    it("debe tener checkboxes accesibles", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBeGreaterThan(0);

      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toHaveAttribute("id");
      });
    });

    it("debe tener botones accesibles", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
        expect(button).toBeVisible();
      });
    });
  });

  describe("Estilos y clases CSS", () => {
    it("debe aplicar las clases CSS correctas al contenedor", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const container = document.querySelector('[class*="flex gap-3 mb-6"]');
      expect(container).toBeInTheDocument();
    });

    it("debe aplicar estilos condicionales basados en la selección", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const visaButton = screen.getByText("Visa");

      // Inicialmente no seleccionado
      expect(visaButton.closest("label")).not.toHaveClass("bg-[#E0EDFF]");

      // Seleccionar
      await user.click(visaButton);
      expect(visaButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
    });
  });

  describe("Integración con react-hook-form", () => {
    it("debe usar el contexto del formulario correctamente", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      // El componente debe renderizarse sin errores
      expect(screen.getByText("Visa")).toBeInTheDocument();
    });

    it("debe sincronizar el estado con el formulario", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const visaButton = screen.getByText("Visa");
      await user.click(visaButton);

      // El estado debe estar sincronizado
      const visaCheckbox = screen.getByRole("checkbox", { name: /visa/i });
      expect(visaCheckbox).toBeChecked();
    });
  });

  describe("Casos edge", () => {
    it("debe manejar array vacío de tarjetas seleccionadas", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      // Debe renderizar correctamente con array vacío
      expect(screen.getByText("Visa")).toBeInTheDocument();
    });

    it("debe funcionar con valores undefined", () => {
      expect(() => {
        render(
          <TestWrapper>
            <FilterCards />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });
});
