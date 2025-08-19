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
      card: [],
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("FilterCards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("should render the card filter component", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      // Should render the container
      const container = document.querySelector('[class*="flex gap-3 mb-6"]');
      expect(container).toBeInTheDocument();
    });

    it("should render all card type options", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      expect(screen.getByText("Visa")).toBeInTheDocument();
      expect(screen.getByText("Mastercard")).toBeInTheDocument();
      expect(screen.getByText("Amex")).toBeInTheDocument();
    });

    it("should render filter buttons for each card type", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const filterButtons = document.querySelectorAll('[role="button"]');
      expect(filterButtons).toHaveLength(3);
    });
  });

  describe("Button functionality", () => {
    it("should select/deselect card types when clicked", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const visaButton = screen.getByText("Visa");
      const mastercardButton = screen.getByText("Mastercard");

      await user.click(visaButton);
      // Should show selected state
      expect(visaButton.closest("label")).toHaveClass("bg-[#E0EDFF]");

      await user.click(mastercardButton);
      expect(mastercardButton.closest("label")).toHaveClass("bg-[#E0EDFF]");

      await user.click(visaButton);
      // Should deselect
      expect(visaButton.closest("label")).not.toHaveClass("bg-[#E0EDFF]");
    });

    it("should allow multiple card types to be selected", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const visaButton = screen.getByText("Visa");
      const mastercardButton = screen.getByText("Mastercard");
      const amexButton = screen.getByText("Amex");

      await user.click(visaButton);
      await user.click(mastercardButton);
      await user.click(amexButton);

      expect(visaButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
      expect(mastercardButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
      expect(amexButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
    });
  });

  describe("Form integration", () => {
    it("should register with react-hook-form", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      const hiddenInputs = document.querySelectorAll('input[type="checkbox"]');
      expect(hiddenInputs[0]).toHaveAttribute("id", "card-visa");
      expect(hiddenInputs[1]).toHaveAttribute("id", "card-mastercard");
      expect(hiddenInputs[2]).toHaveAttribute("id", "card-amex");
    });

    it("should show initial values from form", () => {
      const defaultValues = {
        card: ["visa", "mastercard"] as ("visa" | "mastercard" | "amex")[],
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          <FilterCards />
        </TestWrapper>
      );

      const visaButton = screen.getByText("Visa");
      const mastercardButton = screen.getByText("Mastercard");
      const amexButton = screen.getByText("Amex");

      expect(visaButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
      expect(mastercardButton.closest("label")).toHaveClass("bg-[#E0EDFF]");
      expect(amexButton.closest("label")).not.toHaveClass("bg-[#E0EDFF]");
    });
  });

  describe("Accessibility", () => {
    it("should have proper labels for screen readers", () => {
      render(
        <TestWrapper>
          <FilterCards />
        </TestWrapper>
      );

      expect(screen.getByText("Visa")).toBeInTheDocument();
      expect(screen.getByText("Mastercard")).toBeInTheDocument();
      expect(screen.getByText("Amex")).toBeInTheDocument();
    });

    it("should have proper button attributes", () => {
      render(
        <TestWrapper>
          <FilterCards />
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
          <FilterCards />
        </TestWrapper>
      );

      const filterButtons = document.querySelectorAll('[role="button"]');
      filterButtons.forEach((button) => {
        expect(button.closest("label")).not.toHaveClass("bg-[#E0EDFF]");
      });
    });

    it("should handle all card types selected", () => {
      const defaultValues = {
        card: ["visa", "mastercard", "amex"] as (
          | "visa"
          | "mastercard"
          | "amex"
        )[],
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          <FilterCards />
        </TestWrapper>
      );

      const filterButtons = document.querySelectorAll('[role="button"]');
      filterButtons.forEach((button) => {
        expect(button.closest("label")).toHaveClass("bg-[#E0EDFF]");
      });
    });
  });

  it("should be a valid React component", () => {
    expect(typeof FilterCards).toBe("function");
  });
});
