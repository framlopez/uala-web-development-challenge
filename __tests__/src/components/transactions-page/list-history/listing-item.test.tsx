import HistoryListItem from "@/src/components/transactions-page/list-history/listing-item";
import { render, screen } from "@testing-library/react";

// Mock de formatPrice
jest.mock("@/utils/format-price", () => {
  return {
    __esModule: true,
    default: (amount: number, currency: any, locale: string) => ({
      prefix: "ARS",
      symbol: "$",
      amount: `${Math.abs(amount)}`,
      decimals: "00",
    }),
  };
});

// Mock de getPaymentMethodLabel
jest.mock("@/utils/payment-method-label", () => {
  return {
    __esModule: true,
    default: (paymentMethod: string) => {
      const labels: { [key: string]: string } = {
        POSPRO: "POS Pro",
        LINK: "Link de pago",
        MPOS: "mPOS",
        QR: "Código QR",
      };
      return labels[paymentMethod] || paymentMethod;
    },
  };
});

// Mock de CategoryStoresInIcon
jest.mock("@/components/icons/category-stores-in", () => {
  return function MockCategoryStoresInIcon({ className }: any) {
    return <div data-testid="category-icon" className={className} />;
  };
});

// Mock de cn utility
jest.mock("@/shadcn/lib/utils", () => ({
  cn: (...classes: any[]) => {
    return classes
      .map((cls) => {
        if (typeof cls === "string") return cls;
        if (typeof cls === "object" && cls !== null) {
          return Object.entries(cls)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(" ");
        }
        return "";
      })
      .filter(Boolean)
      .join(" ");
  },
}));

describe("HistoryListItem", () => {
  const mockTransaction = {
    id: "1",
    paymentMethod: "POSPRO",
    amount: 1000,
    createdAt: "2024-01-15T10:30:00Z",
  };

  it("debe renderizar el ícono de categoría con las clases correctas", () => {
    render(<HistoryListItem transaction={mockTransaction} />);

    const categoryIcon = screen.getByTestId("category-icon");
    expect(categoryIcon).toBeInTheDocument();
    expect(categoryIcon).toHaveClass(
      "size-8",
      "text-uala-success",
      "flex-shrink-0"
    );
  });

  it("debe renderizar el título del método de pago", () => {
    render(<HistoryListItem transaction={mockTransaction} />);

    expect(screen.getByText("POS Pro")).toBeInTheDocument();
  });

  it("debe renderizar 'Venta' como subtítulo", () => {
    render(<HistoryListItem transaction={mockTransaction} />);

    expect(screen.getByText("Venta")).toBeInTheDocument();
  });

  it("debe renderizar el monto formateado", () => {
    render(<HistoryListItem transaction={mockTransaction} />);

    // El monto se renderiza como texto concatenado
    expect(screen.getByText("ARS$1000,00")).toBeInTheDocument();
  });

  it("debe renderizar la fecha formateada", () => {
    render(<HistoryListItem transaction={mockTransaction} />);

    // La fecha se formatea como DD/MM/YYYY en español
    expect(screen.getByText("15/01/2024")).toBeInTheDocument();
  });

  it("debe aplicar estilos correctos para monto positivo", () => {
    const positiveTransaction = { ...mockTransaction, amount: 500 };
    render(<HistoryListItem transaction={positiveTransaction} />);

    const amountElement = screen.getByText("ARS$500,00");
    expect(amountElement).toHaveClass("text-uala-success");
  });

  it("debe aplicar estilos correctos para monto negativo", () => {
    const negativeTransaction = { ...mockTransaction, amount: -300 };
    render(<HistoryListItem transaction={negativeTransaction} />);

    const amountElement = screen.getByText("ARS$300,00");
    expect(amountElement).toHaveClass("text-red-500");
  });

  it("debe aplicar estilos correctos para monto cero", () => {
    const zeroTransaction = { ...mockTransaction, amount: 0 };
    render(<HistoryListItem transaction={zeroTransaction} />);

    const amountElement = screen.getByText("ARS$0,00");
    expect(amountElement).toHaveClass("text-[#606882]");
  });

  it("debe renderizar diferentes métodos de pago correctamente", () => {
    const linkTransaction = { ...mockTransaction, paymentMethod: "LINK" };
    render(<HistoryListItem transaction={linkTransaction} />);

    expect(screen.getByText("Link de pago")).toBeInTheDocument();
  });

  it("debe mantener la estructura del layout", () => {
    render(<HistoryListItem transaction={mockTransaction} />);

    // Verificar que el contenedor principal tenga las clases correctas
    const container = screen.getByText("POS Pro").closest("div")?.parentElement;
    expect(container).toHaveClass(
      "flex",
      "items-center",
      "gap-2",
      "w-full",
      "py-3",
      "px-2"
    );
  });

  it("debe formatear fechas en diferentes formatos", () => {
    const decemberTransaction = {
      ...mockTransaction,
      createdAt: "2024-12-25T15:45:00Z",
    };
    render(<HistoryListItem transaction={decemberTransaction} />);

    expect(screen.getByText("25/12/2024")).toBeInTheDocument();
  });
});
