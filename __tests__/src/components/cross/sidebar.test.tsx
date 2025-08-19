import { render, screen } from "@testing-library/react";
import Sidebar from "../../../../src/components/cross/sidebar";

// Mock de los componentes hijos
jest.mock("../../../../src/components/cross/button", () => {
  return function MockButton({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <button data-testid="nav-button" className={className}>
        {children}
      </button>
    );
  };
});

jest.mock("../../../../src/components/icons/home", () => {
  return function MockHomeIcon({ className }: { className?: string }) {
    return (
      <div data-testid="home-icon" className={className}>
        Home Icon
      </div>
    );
  };
});

jest.mock("../../../../src/components/icons/metrics", () => {
  return function MockMetricsIcon({ className }: { className?: string }) {
    return (
      <div data-testid="metrics-icon" className={className}>
        Metrics Icon
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
      <img data-testid="image" src={src} alt={alt} className={className} />
    );
  };
});

// Mock de Next.js Link
jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <a data-testid="link" href={href} className={className}>
        {children}
      </a>
    );
  };
});

// Mock de las imágenes
jest.mock("@/public/logo-full.png", () => "mocked-logo-full-path");
jest.mock("@/public/apple-store.png", () => "mocked-apple-store-path");
jest.mock("@/public/google-store.png", () => "mocked-google-store-path");

// Mock del componente Image para que use diferentes testids
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
    const testId =
      alt === "Logo"
        ? "logo-image"
        : alt === "Apple Store"
        ? "apple-store-image"
        : alt === "Google Store"
        ? "google-store-image"
        : "image";
    return (
      <img data-testid={testId} src={src} alt={alt} className={className} />
    );
  };
});

describe("Sidebar", () => {
  it("debe renderizar el logo principal", () => {
    render(<Sidebar />);

    const logoImage = screen.getByTestId("logo-image");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("alt", "Logo");
    expect(logoImage).toHaveClass("h-10", "w-[120px]");
  });

  it("debe renderizar el enlace de inicio", () => {
    render(<Sidebar />);

    const homeLink = screen.getAllByTestId("link")[0];
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "#");

    const homeButton = screen.getAllByTestId("nav-button")[0];
    expect(homeButton).toBeInTheDocument();
    expect(homeButton).toHaveClass("text-[#3564FD]");
    expect(homeButton).toHaveClass("w-full");
  });

  it("debe renderizar el icono de inicio", () => {
    render(<Sidebar />);

    const homeIcon = screen.getByTestId("home-icon");
    expect(homeIcon).toBeInTheDocument();
    expect(homeIcon).toHaveClass("size-6");
  });

  it("debe renderizar el texto de inicio", () => {
    render(<Sidebar />);

    expect(screen.getByText("Inicio")).toBeInTheDocument();
  });

  it("debe renderizar el enlace de métricas", () => {
    render(<Sidebar />);

    const metricsLink = screen.getAllByTestId("link")[1];
    expect(metricsLink).toBeInTheDocument();
    expect(metricsLink).toHaveAttribute("href", "#");

    const metricsButton = screen.getAllByTestId("nav-button")[1];
    expect(metricsButton).toBeInTheDocument();
    expect(metricsButton).toHaveClass("w-full", "text-[#3A3A3A]");
  });

  it("debe renderizar el icono de métricas", () => {
    render(<Sidebar />);

    const metricsIcon = screen.getByTestId("metrics-icon");
    expect(metricsIcon).toBeInTheDocument();
    expect(metricsIcon).toHaveClass("size-6", "text-[#737373]");
  });

  it("debe renderizar el texto de métricas", () => {
    render(<Sidebar />);

    expect(screen.getByText("Métricas")).toBeInTheDocument();
  });

  it("debe renderizar la sección de descarga de la app", () => {
    render(<Sidebar />);

    expect(screen.getByText("Descargá la app desde")).toBeInTheDocument();
  });

  it("debe renderizar el enlace de Apple Store", () => {
    render(<Sidebar />);

    const appleStoreLink = screen.getAllByTestId("link")[2];
    expect(appleStoreLink).toBeInTheDocument();
    expect(appleStoreLink).toHaveAttribute(
      "href",
      "https://uala.onelink.me/tTSW/vq840eav"
    );

    const appleStoreImage = screen.getByTestId("apple-store-image");
    expect(appleStoreImage).toBeInTheDocument();
    expect(appleStoreImage).toHaveAttribute("alt", "Apple Store");
    expect(appleStoreImage).toHaveClass("h-10", "mx-auto");
  });

  it("debe renderizar el enlace de Google Store", () => {
    render(<Sidebar />);

    const googleStoreLink = screen.getAllByTestId("link")[3];
    expect(googleStoreLink).toBeInTheDocument();
    expect(googleStoreLink).toHaveAttribute(
      "href",
      "https://uala.onelink.me/tTSW/vq840eav"
    );

    const googleStoreImage = screen.getByTestId("google-store-image");
    expect(googleStoreImage).toBeInTheDocument();
    expect(googleStoreImage).toHaveAttribute("alt", "Google Store");
    expect(googleStoreImage).toHaveClass("h-10", "mx-auto");
  });

  it("debe tener la estructura correcta del sidebar", () => {
    const { container } = render(<Sidebar />);

    const sidebar = container.querySelector(
      ".hidden.bg-white.fixed.inset-y-0.z-30.lg\\:flex.w-72.flex-col.shadow"
    );
    expect(sidebar).toBeInTheDocument();

    const sidebarContent = container.querySelector(
      ".flex.grow.flex-col.gap-y-5.overflow-y-auto.p-5"
    );
    expect(sidebarContent).toBeInTheDocument();
  });

  it("debe tener la navegación con la estructura correcta", () => {
    const { container } = render(<Sidebar />);

    const nav = container.querySelector("nav");
    expect(nav).toBeInTheDocument();

    const navList = container.querySelector("ul[role='list']");
    expect(navList).toBeInTheDocument();
    expect(navList).toHaveClass("flex", "flex-col", "mt-6");
  });

  it("debe tener la sección de descarga con el layout correcto", () => {
    const { container } = render(<Sidebar />);

    const downloadSection = container.querySelector(
      ".flex.flex-col.items-center.gap-6.mt-auto.mb-6"
    );
    expect(downloadSection).toBeInTheDocument();

    const downloadTitle = container.querySelector(
      ".font-bold.text-lg.text-\\[\\#3A3A3A\\].text-center"
    );
    expect(downloadTitle).toBeInTheDocument();

    const downloadButtons = container.querySelector(".flex.flex-col.gap-4");
    expect(downloadButtons).toBeInTheDocument();
  });
});
