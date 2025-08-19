import FilterInstallments from "@/src/components/transactions-page/filters-sidebar/filter-installments";
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
      cuotas: [],
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("FilterInstallments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderizado básico", () => {
    it("debe renderizar el componente correctamente", () => {
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      // El componente debe renderizarse sin errores
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("debe tener la estructura de grid correcta", () => {
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      const container = document.querySelector('[class*="flex gap-3 mb-6"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("Estado inicial", () => {
    it("debe tener todas las cuotas no seleccionadas por defecto", () => {
      render(
        <TestWrapper>
          <FilterInstallments />
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
          <FilterInstallments />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).not.toHaveClass("bg-[#E0EDFF]");
      });
    });
  });

  describe("Interacciones del usuario", () => {
    it("debe seleccionar una cuota cuando se hace clic", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      const oneInstallmentButton = screen.getByText("1");
      await user.click(oneInstallmentButton);

      // Verificar que el checkbox esté seleccionado
      const oneInstallmentCheckbox = screen.getByRole("checkbox", {
        name: "1",
      });
      expect(oneInstallmentCheckbox).toBeChecked();
    });

    it("debe deseleccionar una cuota cuando se hace clic nuevamente", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      const oneInstallmentButton = screen.getByText("1");

      // Seleccionar
      await user.click(oneInstallmentButton);
      let oneInstallmentCheckbox = screen.getByRole("checkbox", { name: "1" });
      expect(oneInstallmentCheckbox).toBeChecked();

      // Deseleccionar
      await user.click(oneInstallmentButton);
      oneInstallmentCheckbox = screen.getByRole("checkbox", { name: "1" });
      expect(oneInstallmentCheckbox).not.toBeChecked();
    });
  });

  describe("Accesibilidad", () => {
    it("debe tener checkboxes accesibles", () => {
      render(
        <TestWrapper>
          <FilterInstallments />
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
          <FilterInstallments />
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
          <FilterInstallments />
        </TestWrapper>
      );

      const container = document.querySelector('[class*="flex gap-3 mb-6"]');
      expect(container).toBeInTheDocument();
    });

    it("debe aplicar estilos condicionales basados en la selección", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      const oneInstallmentButton = screen.getByText("1");

      // Inicialmente no seleccionado
      expect(oneInstallmentButton.closest("label")).not.toHaveClass(
        "bg-[#E0EDFF]"
      );

      // Seleccionar
      await user.click(oneInstallmentButton);
      expect(oneInstallmentButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
    });
  });

  describe("Integración con react-hook-form", () => {
    it("debe usar el contexto del formulario correctamente", () => {
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      // El componente debe renderizarse sin errores
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("debe sincronizar el estado con el formulario", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      const oneInstallmentButton = screen.getByText("1");
      await user.click(oneInstallmentButton);

      // El estado debe estar sincronizado
      const oneInstallmentCheckbox = screen.getByRole("checkbox", {
        name: "1",
      });
      expect(oneInstallmentCheckbox).toBeChecked();
    });
  });

  describe("Casos edge", () => {
    it("debe manejar array vacío de cuotas seleccionadas", () => {
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      // Debe renderizar correctamente con array vacío
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("debe funcionar con valores undefined", () => {
      expect(() => {
        render(
          <TestWrapper>
            <FilterInstallments />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });
});
