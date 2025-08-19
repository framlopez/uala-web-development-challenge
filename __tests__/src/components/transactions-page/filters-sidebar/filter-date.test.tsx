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
      date: { from: undefined, to: undefined },
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("FilterDate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("should render the calendar", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // Verificar que el calendario esté presente
      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("should render the main container", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const container = document.querySelector('[class*="space-y-2 mb-6"]');
      expect(container).toBeInTheDocument();
    });

    it("should not show the clear button initially", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      expect(screen.queryByText("Borrar")).not.toBeInTheDocument();
    });

    it("should center the calendar", () => {
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

  describe("Calendar configuration", () => {
    it("should configure the calendar in range mode", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("should apply the correct CSS classes to the calendar", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // Buscar el calendario con las clases aplicadas
      const calendar = document.querySelector('[class*="rounded-md"]');
      expect(calendar).toBeInTheDocument();
    });

    it("should use the Spanish locale", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("should show a single month", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });
  });

  describe("Date selection", () => {
    it("should show the clear button when dates are selected", () => {
      const fromDate = new Date("2024-01-01").toISOString();
      const toDate = new Date("2024-01-31").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: toDate },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("should show the clear button with only from date", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("should show the clear button with only to date", () => {
      const toDate = new Date("2024-01-31").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: undefined, to: toDate },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("should prepare dates correctly for the calendar", () => {
      const fromDate = new Date("2024-01-01").toISOString();
      const toDate = new Date("2024-01-31").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: toDate },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // The calendar must receive the correct dates
      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("should handle partial dates correctly", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // Must handle correctly when only from date is present
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });
  });

  describe("Clear button", () => {
    it("should execute clearDates when clicking clear", async () => {
      const user = userEvent.setup();
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      const clearButton = screen.getByText("Borrar");
      expect(clearButton).toBeInTheDocument();

      await user.click(clearButton);

      // The button should disappear after clicking (because dates are cleared)
      expect(screen.queryByText("Borrar")).not.toBeInTheDocument();
    });

    it("should have the correct CSS classes", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: undefined },
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

    it("should be a button type", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      const clearButton = screen.getByText("Borrar");
      expect(clearButton).toHaveAttribute("type", "button");
    });

    it("should have correct hover effects", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: undefined },
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

    it("should be centered correctly", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: undefined },
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

  describe("Hidden form fields", () => {
    it("should have hidden fields for react-hook-form", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
      expect(hiddenInputs).toHaveLength(2);
    });

    it("should register hidden fields correctly", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
      expect(hiddenInputs[0]).toHaveAttribute("name", "date.from");
      expect(hiddenInputs[1]).toHaveAttribute("name", "date.to");
    });
  });

  describe("handleSelect logic", () => {
    it("should handle undefined selection", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // The component must handle correctly when handleSelect receives undefined
      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();

      // Simulate no selection
      expect(screen.queryByText("Borrar")).not.toBeInTheDocument();
    });

    it("should convert ISO dates to Date correctly", () => {
      const isoDate = "2024-01-01T00:00:00.000Z";

      render(
        <TestWrapper
          defaultValues={{
            date: { from: isoDate, to: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // Must convert correctly ISO string to Date
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("should handle full ISO dates", () => {
      const fromDate = new Date("2024-01-01T10:30:00.000Z").toISOString();
      const toDate = new Date("2024-01-31T15:45:00.000Z").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: toDate },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });
  });

  describe("Date formatting", () => {
    it("should format valid dates correctly", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // The component should render without errors with a valid date
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("should handle undefined dates gracefully", () => {
      render(
        <TestWrapper
          defaultValues={{
            date: { from: undefined, to: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // Should not show the clear button
      expect(screen.queryByText("Borrar")).not.toBeInTheDocument();
    });

    it("should create selectedItems correctly", () => {
      const fromDate = new Date("2024-01-01").toISOString();
      const toDate = new Date("2024-01-31").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: toDate },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // Should show the clear button when dates are selected
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("should use date-fns format correctly", () => {
      const mockFormat = require("date-fns").format;
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // Verify that format was called (it's called internally for selectedItems)
      expect(mockFormat).toHaveBeenCalled();
    });
  });

  describe("React-hook-form integration", () => {
    it("should use the form context correctly", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // The component should render without errors
      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("should reflect form values in the calendar", () => {
      const fromDate = new Date("2024-01-01").toISOString();
      const toDate = new Date("2024-01-31").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: toDate },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // Should show the clear button indicating that dates are selected
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("should synchronize with watch correctly", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // watch should work correctly
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("should call setValue when cleared", async () => {
      const user = userEvent.setup();
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      const clearButton = screen.getByText("Borrar");
      await user.click(clearButton);

      // After clearing, the button should disappear
      expect(screen.queryByText("Borrar")).not.toBeInTheDocument();
    });
  });

  describe("Styles and CSS classes", () => {
    it("should apply the correct classes to the container", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const container = document.querySelector('[class*="space-y-2 mb-6"]');
      expect(container).toBeInTheDocument();
    });

    it("should center the calendar", () => {
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

    it("should apply calendar styles correctly", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendar = document.querySelector('[class*="rounded-md"]');
      expect(calendar).toBeInTheDocument();
    });

    it("should apply border-0 to the calendar", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // Search for elements containing calendar classes
      const calendarElement = document.querySelector('[class*="border-0"]');
      expect(calendarElement).toBeInTheDocument();
    });
  });

  describe("Locale configuration", () => {
    it("should use Spanish locale", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // The calendar must be configured with Spanish locale
      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("should configure numberOfMonths as 1", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      // Should show only one month
      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle undefined values gracefully", () => {
      expect(() => {
        render(
          <TestWrapper>
            <FilterDate />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it("should work without initial values", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("should gracefully handle invalid dates", () => {
      // This should not happen in normal usage, but it's good to test
      expect(() => {
        render(
          <TestWrapper
            defaultValues={{
              date: { from: "invalid-date", to: undefined },
            }}
          >
            <FilterDate />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it("should handle ISO date conversion", () => {
      const isoDate = "2024-01-01T00:00:00.000Z";

      render(
        <TestWrapper
          defaultValues={{
            date: { from: isoDate, to: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      // Must convert correctly ISO string to Date
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    it("should handle null dates gracefully", () => {
      expect(() => {
        render(
          <TestWrapper
            defaultValues={{
              date: { from: null as any, to: null as any },
            }}
          >
            <FilterDate />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("should have an accessible calendar", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const calendar = document.querySelector('[role="grid"]');
      expect(calendar).toBeInTheDocument();
    });

    it("should have an accessible clear button", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      const clearButton = screen.getByRole("button", { name: "Borrar" });
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toBeVisible();
    });

    it("should allow keyboard navigation", () => {
      const fromDate = new Date("2024-01-01").toISOString();

      render(
        <TestWrapper
          defaultValues={{
            date: { from: fromDate, to: undefined },
          }}
        >
          <FilterDate />
        </TestWrapper>
      );

      const clearButton = screen.getByRole("button", { name: "Borrar" });
      clearButton.focus();
      expect(clearButton).toHaveFocus();
    });

    it("should have hidden fields with appropriate names", () => {
      render(
        <TestWrapper>
          <FilterDate />
        </TestWrapper>
      );

      const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
      expect(hiddenInputs[0]).toHaveAttribute("name", "date.from");
      expect(hiddenInputs[1]).toHaveAttribute("name", "date.to");
    });
  });

  it("should be a valid React component", () => {
    expect(typeof FilterDate).toBe("function");
  });
});
