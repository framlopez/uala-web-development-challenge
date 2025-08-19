import { render, screen } from "@testing-library/react";
import Summary from "../../../../src/components/transactions-page/summary";

// Mock de SummaryTabs para enfocarnos en Summary
jest.mock("../../../../src/components/transactions-page/summary/tabs", () => {
  return function MockSummaryTabs() {
    return <div data-testid="summary-tabs">Summary Tabs</div>;
  };
});

// Mock de next/link
jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) {
    return (
      <a data-testid="link" href={href}>
        {children}
      </a>
    );
  };
});

describe("Summary", () => {
  it("debe renderizar el título principal", () => {
    render(<Summary />);
    expect(screen.getByText("Tus cobros")).toBeInTheDocument();
  });

  it("debe renderizar SummaryTabs", () => {
    render(<Summary />);
    expect(screen.getByTestId("summary-tabs")).toBeInTheDocument();
  });

  it("debe renderizar el botón 'Ver métricas' con su ícono y el link", () => {
    render(<Summary />);

    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("href", "#");

    const button = screen.getByRole("button", { name: /ver métricas/i });
    expect(button).toBeInTheDocument();

    // Verifica que el ícono (svg) esté presente dentro del botón
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
