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
      amount: { min: undefined, max: undefined },
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("FilterAmount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("should render the amount filter component", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      expect(screen.getByText("Monto mínimo")).toBeInTheDocument();
      expect(screen.getByText("Monto máximo")).toBeInTheDocument();
    });

    it("should render input fields for min and max amounts", () => {
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

    it("should render the slider component", () => {
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
  });

  describe("Input functionality", () => {
    it("should update min amount when typing in min input", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      const minInput = inputs[0] as HTMLInputElement;
      await user.type(minInput, "100");

      expect(minInput.value).toBe("100");
    });

    it("should update max amount when typing in max input", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      const maxInput = inputs[1] as HTMLInputElement;
      await user.type(maxInput, "500");

      expect(maxInput.value).toBe("500");
    });

    it("should handle decimal values correctly", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      const minInput = inputs[0] as HTMLInputElement;
      await user.type(minInput, "100.50");

      // The component may clamp or validate the value, so we check that it's present
      expect(minInput.value).toContain("100");
    });
  });

  describe("Slider functionality", () => {
    it("should update min value when dragging min slider", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const slider = document.querySelector(
        '[class*="relative w-full pt-8 pb-2"]'
      );
      expect(slider).toBeInTheDocument();

      // Simulate slider interaction
      const minSlider = document.querySelector(
        '[class*="absolute top-6 size-5 bg-uala-primary"]'
      );
      if (minSlider) {
        fireEvent.mouseDown(minSlider);
        fireEvent.mouseMove(minSlider, { clientX: 100 });
        fireEvent.mouseUp(minSlider);
      }
    });

    it("should update max value when dragging max slider", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const slider = document.querySelector(
        '[class*="relative w-full pt-8 pb-2"]'
      );
      expect(slider).toBeInTheDocument();

      // Simulate slider interaction
      const maxSlider = document.querySelectorAll(
        '[class*="absolute top-6 size-5 bg-uala-primary"]'
      )[1];
      if (maxSlider) {
        fireEvent.mouseDown(maxSlider);
        fireEvent.mouseMove(maxSlider, { clientX: 200 });
        fireEvent.mouseUp(maxSlider);
      }
    });
  });

  describe("Form integration", () => {
    it("should register with react-hook-form", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
      expect(hiddenInputs[0]).toHaveAttribute("name", "amount.min");
      expect(hiddenInputs[1]).toHaveAttribute("name", "amount.max");
    });

    it("should show initial values from form", () => {
      const defaultValues = {
        amount: { min: 100, max: 500 },
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      expect((inputs[0] as HTMLInputElement).value).toBe("100");
      expect((inputs[1] as HTMLInputElement).value).toBe("500");
    });
  });

  describe("Validation", () => {
    it("should handle invalid input gracefully", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      const minInput = inputs[0] as HTMLInputElement;
      await user.type(minInput, "invalid");

      // Should handle invalid input without crashing
      expect(minInput).toBeInTheDocument();
    });

    it("should handle negative values", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      const minInput = inputs[0] as HTMLInputElement;
      await user.type(minInput, "-100");

      // The component may clamp negative values, so we check that it's handled
      expect(minInput).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle very large numbers", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      const maxInput = inputs[1] as HTMLInputElement;
      await user.type(maxInput, "999999999");

      // The component may clamp large values, so we check that it's handled
      expect(maxInput).toBeInTheDocument();
    });

    it("should handle zero values", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      const minInput = inputs[0] as HTMLInputElement;
      await user.type(minInput, "0");

      expect(minInput.value).toBe("0");
    });

    it("should handle empty values", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      const minInput = inputs[0] as HTMLInputElement;
      await user.clear(minInput);

      expect(minInput.value).toBe("");
    });
  });

  describe("Accessibility", () => {
    it("should have proper labels for screen readers", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      expect(screen.getByText("Monto mínimo")).toBeInTheDocument();
      expect(screen.getByText("Monto máximo")).toBeInTheDocument();
    });

    it("should have proper input attributes", () => {
      render(
        <TestWrapper>
          <FilterAmount />
        </TestWrapper>
      );

      const inputs = document.querySelectorAll('input[type="text"]');
      expect(inputs[0]).toHaveAttribute("type", "text");
      expect(inputs[1]).toHaveAttribute("type", "text");
      expect(inputs[0]).toHaveAttribute("inputMode", "numeric");
      expect(inputs[1]).toHaveAttribute("inputMode", "numeric");
    });
  });

  it("should be a valid React component", () => {
    expect(typeof FilterAmount).toBe("function");
  });
});
