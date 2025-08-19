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
      paymentMethods: [],
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("FilterMethods", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("should render the payment methods filter component", () => {
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      // Should render the container
      const container = document.querySelector('[class*="flex gap-3 mb-6"]');
      expect(container).toBeInTheDocument();
    });

    it("should render all payment method options", () => {
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      expect(screen.getByText("Link de pago")).toBeInTheDocument();
      expect(screen.getByText("Código QR")).toBeInTheDocument();
      expect(screen.getByText("mPOS")).toBeInTheDocument();
      expect(screen.getByText("POS Pro")).toBeInTheDocument();
    });

    it("should render filter buttons for each payment method", () => {
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      const filterButtons = document.querySelectorAll('[role="button"]');
      expect(filterButtons).toHaveLength(4);
    });
  });

  describe("Button functionality", () => {
    it("should select/deselect payment methods when clicked", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      const linkButton = screen.getByText("Link de pago");
      const qrButton = screen.getByText("Código QR");

      await user.click(linkButton);
      // Should show selected state
      expect(linkButton.closest("label")).toHaveClass("bg-[#E0EDFF]");

      await user.click(qrButton);
      expect(qrButton.closest("label")).toHaveClass("bg-[#E0EDFF]");

      await user.click(linkButton);
      // Should deselect
      expect(linkButton.closest("label")).not.toHaveClass("bg-[#E0EDFF]");
    });

    it("should allow multiple payment methods to be selected", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      const linkButton = screen.getByText("Link de pago");
      const qrButton = screen.getByText("Código QR");
      const mposButton = screen.getByText("mPOS");

      await user.click(linkButton);
      await user.click(qrButton);
      await user.click(mposButton);

      expect(linkButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
      expect(qrButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
      expect(mposButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
    });
  });

  describe("Form integration", () => {
    it("should register with react-hook-form", () => {
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      const hiddenInputs = document.querySelectorAll('input[type="checkbox"]');
      expect(hiddenInputs[0]).toHaveAttribute("id", "method-link");
      expect(hiddenInputs[1]).toHaveAttribute("id", "method-qr");
      expect(hiddenInputs[2]).toHaveAttribute("id", "method-mpos");
      expect(hiddenInputs[3]).toHaveAttribute("id", "method-pospro");
    });

    it("should show initial values from form", () => {
      const defaultValues = {
        paymentMethods: ["link", "qr"] as ("link" | "qr" | "mpos" | "pospro")[],
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          <FilterMethods />
        </TestWrapper>
      );

      const linkButton = screen.getByText("Link de pago");
      const qrButton = screen.getByText("Código QR");
      const mposButton = screen.getByText("mPOS");
      const posproButton = screen.getByText("POS Pro");

      expect(linkButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
      expect(qrButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
      expect(mposButton.closest("label")).not.toHaveClass("bg-[#E0EDFF]");
      expect(posproButton.closest("label")).not.toHaveClass("bg-[#E0EDFF]");
    });
  });

  describe("Accessibility", () => {
    it("should have proper labels for screen readers", () => {
      render(
        <TestWrapper>
          <FilterMethods />
        </TestWrapper>
      );

      expect(screen.getByText("Link de pago")).toBeInTheDocument();
      expect(screen.getByText("Código QR")).toBeInTheDocument();
      expect(screen.getByText("mPOS")).toBeInTheDocument();
      expect(screen.getByText("POS Pro")).toBeInTheDocument();
    });

    it("should have proper button attributes", () => {
      render(
        <TestWrapper>
          <FilterMethods />
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
          <FilterMethods />
        </TestWrapper>
      );

      const filterButtons = document.querySelectorAll('[role="button"]');
      filterButtons.forEach((button) => {
        expect(button.closest("label")).not.toHaveClass("bg-[#E0EDFF]");
      });
    });

    it("should handle all payment methods selected", () => {
      const defaultValues = {
        paymentMethods: ["link", "qr", "mpos", "pospro"] as (
          | "link"
          | "qr"
          | "mpos"
          | "pospro"
        )[],
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          <FilterMethods />
        </TestWrapper>
      );

      const filterButtons = document.querySelectorAll('[role="button"]');
      filterButtons.forEach((button) => {
        expect(button.closest("label")).toHaveClass("bg-[#E0EDFF]");
      });
    });
  });

  it("should be a valid React component", () => {
    expect(typeof FilterMethods).toBe("function");
  });
});
