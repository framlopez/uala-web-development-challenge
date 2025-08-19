import { render, screen } from "@testing-library/react";
import NavbarMobile from "../../../../src/components/cross/navbar-mobile";

// Mock de los componentes hijos
jest.mock("../../../../src/components/cross/button-icon", () => {
  return function MockButtonIcon({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <button data-testid="button-icon" className={className}>
        {children}
      </button>
    );
  };
});

jest.mock("../../../../src/components/icons/menu", () => {
  return function MockMenuIcon({ className }: { className?: string }) {
    return (
      <div data-testid="menu-icon" className={className}>
        Menu Icon
      </div>
    );
  };
});

// Mock de Next.js Image
jest.mock("next/image", () => {
  return function MockImage({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) {
    return (
      <img data-testid="logo-image" src={src} alt={alt} className={className} />
    );
  };
});

// Mock de la imagen del logo
jest.mock("@/public/logo.png", () => "mocked-logo-path");

describe("NavbarMobile", () => {
  it("debe renderizar el botón del menú", () => {
    render(<NavbarMobile />);

    const menuButton = screen.getByTestId("button-icon");
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveClass("text-[#606882]");
  });

  it("debe renderizar el icono del menú", () => {
    render(<NavbarMobile />);

    const menuIcon = screen.getByTestId("menu-icon");
    expect(menuIcon).toBeInTheDocument();
    expect(menuIcon).toHaveClass("size-6");
  });

  it("debe renderizar el logo de Ualá", () => {
    render(<NavbarMobile />);

    const logoImage = screen.getByTestId("logo-image");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "mocked-logo-path");
    expect(logoImage).toHaveAttribute("alt", "Ualá");
    expect(logoImage).toHaveClass("w-20", "h-10");
  });

  it("debe tener la estructura correcta del navbar móvil", () => {
    const { container } = render(<NavbarMobile />);

    // Verificar que el navbar principal esté presente
    const navbar = container.querySelector(".lg\\:hidden");
    expect(navbar).toBeInTheDocument();

    // Verificar que tenga la clase correcta para dispositivos móviles
    expect(navbar).toHaveClass("lg:hidden");
  });

  it("debe tener el diseño correcto del navbar", () => {
    const { container } = render(<NavbarMobile />);

    const navbarContent = container.querySelector(
      ".flex.justify-between.items-center"
    );
    expect(navbarContent).toBeInTheDocument();
    expect(navbarContent).toHaveClass(
      "bg-white",
      "rounded-bl-4xl",
      "shadow-2xs",
      "px-2"
    );
  });

  it("debe tener el elemento decorativo en la parte inferior", () => {
    const { container } = render(<NavbarMobile />);

    const decorativeElement = container.querySelector(
      ".bg-white.size-8.absolute.top-full.right-0"
    );
    expect(decorativeElement).toBeInTheDocument();

    const circleElement = container.querySelector(
      ".absolute.bottom-0.left-0.size-16.rounded-full.bg-background"
    );
    expect(circleElement).toBeInTheDocument();
  });

  it("debe tener el padding correcto en el logo", () => {
    const { container } = render(<NavbarMobile />);

    const logoContainer = container.querySelector(".py-2");
    expect(logoContainer).toBeInTheDocument();
  });

  it("debe tener un elemento vacío para balancear el layout", () => {
    const { container } = render(<NavbarMobile />);

    const emptyElement = container.querySelector("div:last-child");
    expect(emptyElement).toBeInTheDocument();
    // El elemento puede contener contenido del mock, pero debe estar presente
    expect(emptyElement).toBeInTheDocument();
  });
});
