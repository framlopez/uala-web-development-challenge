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
      installments: [],
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("FilterInstallments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("should render the installments filter component", () => {
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      // Should render the container
      const container = document.querySelector('[class*="flex gap-3 mb-6"]');
      expect(container).toBeInTheDocument();
    });

    it("should render all installment options", () => {
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("should render filter buttons for each installment option", () => {
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      const filterButtons = document.querySelectorAll('[role="button"]');
      expect(filterButtons).toHaveLength(5);
    });
  });

  describe("Button functionality", () => {
    it("should select/deselect installment options when clicked", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      const oneButton = screen.getByText("1");
      const twoButton = screen.getByText("2");

      await user.click(oneButton);
      // Should show selected state
      expect(oneButton.closest("label")).toHaveClass("bg-[#E0EDFF]");

      await user.click(twoButton);
      expect(twoButton.closest("label")).toHaveClass("bg-[#E0EDFF]");

      await user.click(oneButton);
      // Should deselect
      expect(oneButton.closest("label")).not.toHaveClass("bg-[#E0EDFF]");
    });

    it("should allow multiple installment options to be selected", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      const oneButton = screen.getByText("1");
      const threeButton = screen.getByText("3");
      const sixButton = screen.getByText("6");

      await user.click(oneButton);
      await user.click(threeButton);
      await user.click(sixButton);

      expect(oneButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
      expect(threeButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
      expect(sixButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
    });
  });

  describe("Form integration", () => {
    it("should register with react-hook-form", () => {
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      const hiddenInputs = document.querySelectorAll('input[type="checkbox"]');
      expect(hiddenInputs[0]).toHaveAttribute("id", "installment-1");
      expect(hiddenInputs[1]).toHaveAttribute("id", "installment-2");
      expect(hiddenInputs[2]).toHaveAttribute("id", "installment-3");
      expect(hiddenInputs[3]).toHaveAttribute("id", "installment-6");
      expect(hiddenInputs[4]).toHaveAttribute("id", "installment-12");
    });

    it("should show initial values from form", () => {
      const defaultValues = {
        installments: ["1", "3"] as ("1" | "2" | "3" | "6" | "12")[],
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          <FilterInstallments />
        </TestWrapper>
      );

      const oneButton = screen.getByText("1");
      const twoButton = screen.getByText("2");
      const threeButton = screen.getByText("3");
      const sixButton = screen.getByText("6");
      const twelveButton = screen.getByText("12");

      expect(oneButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
      expect(twoButton.closest("label")).not.toHaveClass("bg-[#E0EDFF]");
      expect(threeButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
      expect(sixButton.closest("label")).not.toHaveClass("bg-[#E0EDFF]");
      expect(twelveButton.closest("label")).not.toHaveClass("bg-[#E0EDFF]");
    });
  });

  describe("Accessibility", () => {
    it("should have proper labels for screen readers", () => {
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("should have proper button attributes", () => {
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      const filterButtons = document.querySelectorAll('[role="button"]');
      filterButtons.forEach((button) => {
        expect(button).toHaveAttribute("role", "button");
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle empty initial values", () => {
      render(
        <TestWrapper>
          <FilterInstallments />
        </TestWrapper>
      );

      const filterButtons = document.querySelectorAll('[role="button"]');
      filterButtons.forEach((button) => {
        expect(button.closest("label")).not.toHaveClass("bg-[#E0EDFF]");
      });
    });

    it("should handle all installment options selected", () => {
      const defaultValues = {
        installments: ["1", "2", "3", "6", "12"] as (
          | "1"
          | "2"
          | "3"
          | "6"
          | "12"
        )[],
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          <FilterInstallments />
        </TestWrapper>
      );

      const filterButtons = document.querySelectorAll('[role="button"]');
      filterButtons.forEach((button) => {
        expect(button.closest("label")).toHaveClass("bg-[#E0EDFF]");
      });
    });
  });

  it("should be a valid React component", () => {
    expect(typeof FilterInstallments).toBe("function");
  });
});
