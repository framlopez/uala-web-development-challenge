import { render, screen } from "@testing-library/react";
import AppLayout from "../../../../src/components/cross/layout";

// Mock de los componentes hijos
jest.mock("../../../../src/components/cross/navbar-desktop", () => {
  return function MockNavbarDesktop() {
    return <div data-testid="navbar-desktop">Navbar Desktop</div>;
  };
});

jest.mock("../../../../src/components/cross/navbar-mobile", () => {
  return function MockNavbarMobile() {
    return <div data-testid="navbar-mobile">Navbar Mobile</div>;
  };
});

jest.mock("../../../../src/components/cross/sidebar", () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

describe("AppLayout", () => {
  it("debe renderizar todos los componentes de navegación", () => {
    render(
      <AppLayout>
        <div>Contenido de prueba</div>
      </AppLayout>
    );

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-desktop")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-mobile")).toBeInTheDocument();
  });

  it("debe renderizar el contenido children", () => {
    render(
      <AppLayout>
        <div data-testid="contenido-principal">Contenido de prueba</div>
      </AppLayout>
    );

    expect(screen.getByTestId("contenido-principal")).toBeInTheDocument();
    expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
  });

  it("debe tener la estructura correcta del layout", () => {
    const { container } = render(
      <AppLayout>
        <div>Contenido</div>
      </AppLayout>
    );

    // Verificar que el layout principal esté presente
    const mainLayout = container.firstChild as HTMLElement;
    expect(mainLayout).toBeInTheDocument();
    expect(mainLayout.tagName).toBe("DIV");

    // Verificar que el contenido principal tenga la clase correcta
    const contentWrapper = container.querySelector(".lg\\:pl-72");
    expect(contentWrapper).toBeInTheDocument();
  });

  it("debe renderizar múltiples children", () => {
    render(
      <AppLayout>
        <h1>Título</h1>
        <p>Párrafo</p>
        <button>Botón</button>
      </AppLayout>
    );

    expect(screen.getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Párrafo")).toBeInTheDocument();
    expect(screen.getByText("Botón")).toBeInTheDocument();
  });
});
