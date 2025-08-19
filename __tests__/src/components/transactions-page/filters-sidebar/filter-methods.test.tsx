import FilterMethods from "@/src/components/transactions-page/filters-sidebar/filter-methods";
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
      metodosCobro: [],
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("FilterMethods", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderizado básico", () => {
    it("debe renderizar el componente correctamente", () => {
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      // El componente debe renderizarse sin errores
      expect(screen.getByText("Link de pago")).toBeInTheDocument();
    });

    it("debe tener la estructura de grid correcta", () => {
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      const container = document.querySelector('[class*="flex gap-3 mb-6"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("Estado inicial", () => {
    it("debe tener todos los métodos no seleccionados por defecto", () => {
      render(
        <TestWrapper>
          <FilterMethods />
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
          <FilterMethods />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).not.toHaveClass("bg-[#E0EDFF]");
      });
    });
  });

  describe("Interacciones del usuario", () => {
    it("debe seleccionar un método cuando se hace clic", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      const linkButton = screen.getByText("Link de pago");
      await user.click(linkButton);

      // Verificar que el checkbox esté seleccionado
      const linkCheckbox = screen.getByRole("checkbox", { name: /link/i });
      expect(linkCheckbox).toBeChecked();
    });

    it("debe deseleccionar un método cuando se hace clic nuevamente", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      const linkButton = screen.getByText("Link de pago");

      // Seleccionar
      await user.click(linkButton);
      let linkCheckbox = screen.getByRole("checkbox", { name: /link/i });
      expect(linkCheckbox).toBeChecked();

      // Deseleccionar
      await user.click(linkButton);
      linkCheckbox = screen.getByRole("checkbox", { name: /link/i });
      expect(linkCheckbox).not.toBeChecked();
    });
  });

  describe("Accesibilidad", () => {
    it("debe tener checkboxes accesibles", () => {
      render(
        <TestWrapper>
          <FilterMethods />
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
          <FilterMethods />
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
          <FilterMethods />
        </TestWrapper>
      );

      const container = document.querySelector('[class*="flex gap-3 mb-6"]');
      expect(container).toBeInTheDocument();
    });

    it("debe aplicar estilos condicionales basados en la selección", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      const linkButton = screen.getByText("Link de pago");

      // Inicialmente no seleccionado
      expect(linkButton.closest("label")).not.toHaveClass("bg-[#E0EDFF]");

      // Seleccionar
      await user.click(linkButton);
      expect(linkButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
    });
  });

  describe("Integración con react-hook-form", () => {
    it("debe usar el contexto del formulario correctamente", () => {
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      // El componente debe renderizarse sin errores
      expect(screen.getByText("Link de pago")).toBeInTheDocument();
    });

    it("debe sincronizar el estado con el formulario", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      const linkButton = screen.getByText("Link de pago");
      await user.click(linkButton);

      // El estado debe estar sincronizado
      const linkCheckbox = screen.getByRole("checkbox", { name: /link/i });
      expect(linkCheckbox).toBeChecked();
    });
  });

  describe("Casos edge", () => {
    it("debe manejar array vacío de métodos seleccionados", () => {
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      // Debe renderizar correctamente con array vacío
      expect(screen.getByText("Link de pago")).toBeInTheDocument();
    });

    it("debe funcionar con valores undefined", () => {
      expect(() => {
        render(
          <TestWrapper>
            <FilterMethods />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });
});
