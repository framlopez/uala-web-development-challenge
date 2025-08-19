import { render, screen } from "@testing-library/react";
import Home from "../../app/page";

// Mock de los componentes hijos
jest.mock("../../src/components/transactions-page/summary", () => {
  return function MockSummary() {
    return <div data-testid="summary-component">Resumen de transacciones</div>;
  };
});

jest.mock("../../src/components/transactions-page/list-history", () => {
  return function MockHistory() {
    return (
      <div data-testid="history-component">Historial de transacciones</div>
    );
  };
});

// Mock de React.Suspense
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  Suspense: ({
    children,
    fallback,
  }: {
    children: React.ReactNode;
    fallback: React.ReactNode;
  }) => (
    <div data-testid="suspense-wrapper">
      {fallback}
      {children}
    </div>
  ),
}));

describe("Home Page", () => {
  it("debe renderizar el componente Summary", () => {
    render(<Home />);

    expect(screen.getByTestId("summary-component")).toBeInTheDocument();
    expect(screen.getByText("Resumen de transacciones")).toBeInTheDocument();
  });

  it("debe renderizar el componente History dentro de Suspense", () => {
    render(<Home />);

    expect(screen.getByTestId("suspense-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("history-component")).toBeInTheDocument();
    expect(screen.getByText("Historial de transacciones")).toBeInTheDocument();
  });

  it("debe mostrar el fallback de Suspense", () => {
    render(<Home />);

    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("debe tener la estructura de contenedor correcta", () => {
    const { container } = render(<Home />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer.tagName).toBe("DIV");
    expect(mainContainer).toHaveClass(
      "container",
      "max-w-md",
      "my-8",
      "lg:my-10"
    );
  });

  it("debe renderizar todos los componentes en el orden correcto", () => {
    const { container } = render(<Home />);

    const children = container.firstChild?.childNodes;
    expect(children).toHaveLength(2);

    // Primer hijo debe ser Summary
    expect(children?.[0]).toHaveTextContent("Resumen de transacciones");

    // Segundo hijo debe ser Suspense con History
    expect(children?.[1]).toHaveTextContent("Historial de transacciones");
  });

  it("debe mantener la estructura responsive con las clases de Tailwind", () => {
    const { container } = render(<Home />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass("max-w-md"); // Ancho máximo en móvil
    expect(mainContainer).toHaveClass("my-8"); // Margen vertical en móvil
    expect(mainContainer).toHaveClass("lg:my-10"); // Margen vertical en desktop
  });
});
