import { render } from "@testing-library/react";
import RootLayout from "../../app/layout";

// Mock del componente AppLayout
jest.mock("../../src/components/cross/layout", () => {
  return function MockAppLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="app-layout">{children}</div>;
  };
});

// Mock de next/font/google
jest.mock("next/font/google", () => ({
  Public_Sans: jest.fn().mockReturnValue({
    className: "mock-public-sans-class",
    variable: "--font-public-sans",
    display: "swap",
  }),
}));

describe("RootLayout", () => {
  it("debe renderizar el AppLayout con children", () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="test-children">Contenido de prueba</div>
      </RootLayout>
    );

    expect(getByTestId("app-layout")).toBeInTheDocument();
    expect(getByTestId("test-children")).toBeInTheDocument();
    expect(getByTestId("test-children")).toHaveTextContent(
      "Contenido de prueba"
    );
  });

  it("debe renderizar múltiples children", () => {
    const { getByText } = render(
      <RootLayout>
        <h1>Título</h1>
        <p>Párrafo</p>
        <button>Botón</button>
      </RootLayout>
    );

    expect(getByText("Título")).toBeInTheDocument();
    expect(getByText("Párrafo")).toBeInTheDocument();
    expect(getByText("Botón")).toBeInTheDocument();
  });

  it("debe renderizar children complejos", () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="header">Header</div>
        <main data-testid="main-content">
          <section data-testid="section-1">Sección 1</section>
          <section data-testid="section-2">Sección 2</section>
        </main>
        <footer data-testid="footer">Footer</footer>
      </RootLayout>
    );

    expect(getByTestId("header")).toBeInTheDocument();
    expect(getByTestId("main-content")).toBeInTheDocument();
    expect(getByTestId("section-1")).toBeInTheDocument();
    expect(getByTestId("section-2")).toBeInTheDocument();
    expect(getByTestId("footer")).toBeInTheDocument();
  });

  it("debe pasar correctamente los children al AppLayout", () => {
    const TestComponent = () => <div data-testid="test-component">Test</div>;

    const { getByTestId } = render(
      <RootLayout>
        <TestComponent />
      </RootLayout>
    );

    expect(getByTestId("test-component")).toBeInTheDocument();
    expect(getByTestId("test-component")).toHaveTextContent("Test");
  });

  it("debe renderizar children vacíos sin errores", () => {
    const { getByTestId } = render(<RootLayout>{null}</RootLayout>);

    expect(getByTestId("app-layout")).toBeInTheDocument();
  });
});
