import { render, screen } from "@testing-library/react";
import NavbarDesktop from "../../../../src/components/cross/navbar-desktop";

// Mock de SWR
const mockSWR = {
  data: undefined,
  isLoading: false,
  error: undefined,
};

jest.mock("swr", () => ({
  __esModule: true,
  default: () => mockSWR,
}));

// Mock de los componentes de shadcn
jest.mock("../../../../src/shadcn/components/ui/avatar", () => ({
  Avatar: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  ),
  AvatarImage: ({ src }: { src: string }) => (
    <img data-testid="avatar-image" src={src} alt="Avatar" />
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
}));

jest.mock("../../../../src/shadcn/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

// Mock del fetcher
jest.mock("../../../../src/utils/fetcher", () => "mocked-fetcher");

// Mock del tipo UserResponse
jest.mock("../../../../src/types/responses/user-response", () => ({}));

describe("NavbarDesktop", () => {
  beforeEach(() => {
    // Reset mockSWR antes de cada test
    Object.assign(mockSWR, {
      data: undefined,
      isLoading: false,
      error: undefined,
    });
  });

  describe("Estado de loading", () => {
    it("debe mostrar skeletons cuando está cargando", () => {
      mockSWR.isLoading = true;

      render(<NavbarDesktop />);

      const skeletons = screen.getAllByTestId("skeleton");
      expect(skeletons).toHaveLength(2);

      // Verificar que el primer skeleton sea para el avatar
      expect(skeletons[0]).toHaveClass("size-10", "rounded-full");

      // Verificar que el segundo skeleton sea para el nombre
      expect(skeletons[1]).toHaveClass("size-4", "rounded", "w-20");
    });

    it("debe tener el wrapper correcto en estado de loading", () => {
      mockSWR.isLoading = true;

      const { container } = render(<NavbarDesktop />);

      const wrapper = container.querySelector(
        ".hidden.lg\\:block.sticky.top-0"
      );
      expect(wrapper).toBeInTheDocument();

      const content = container.querySelector(
        ".bg-white.py-5.px-6.flex.items-center.gap-8.shadow-2xs"
      );
      expect(content).toBeInTheDocument();
    });
  });

  describe("Estado de error", () => {
    it("debe mostrar mensaje de error cuando hay un error", () => {
      mockSWR.error = new Error("Network error");

      render(<NavbarDesktop />);

      expect(
        screen.getByText("No se pudo obtener tu información.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("No se pudo obtener tu información.")
      ).toHaveClass("text-xs", "text-red-500");
    });

    it("debe mostrar mensaje de error cuando no hay datos", () => {
      mockSWR.data = null;

      render(<NavbarDesktop />);

      expect(
        screen.getByText("No se pudo obtener tu información.")
      ).toBeInTheDocument();
    });

    it("debe tener el wrapper correcto en estado de error", () => {
      mockSWR.error = new Error("Network error");

      const { container } = render(<NavbarDesktop />);

      const wrapper = container.querySelector(
        ".hidden.lg\\:block.sticky.top-0"
      );
      expect(wrapper).toBeInTheDocument();

      const content = container.querySelector(
        ".bg-white.py-5.px-6.flex.items-center.gap-8.shadow-2xs"
      );
      expect(content).toBeInTheDocument();
    });
  });

  describe("Estado exitoso", () => {
    const mockUserData = {
      user: {
        firstname: "Francisco",
        lastname: "López",
        avatarUrl: "https://example.com/avatar.jpg",
      },
    };

    it("debe mostrar el avatar del usuario", () => {
      mockSWR.data = mockUserData;

      render(<NavbarDesktop />);

      const avatar = screen.getByTestId("avatar");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveClass("size-10");

      const avatarImage = screen.getByTestId("avatar-image");
      expect(avatarImage).toBeInTheDocument();
      expect(avatarImage).toHaveAttribute(
        "src",
        "https://example.com/avatar.jpg"
      );
    });

    it("debe mostrar el fallback del avatar cuando no hay imagen", () => {
      mockSWR.data = {
        user: {
          ...mockUserData.user,
          avatarUrl: "",
        },
      };

      render(<NavbarDesktop />);

      const avatarFallback = screen.getByTestId("avatar-fallback");
      expect(avatarFallback).toBeInTheDocument();
      expect(avatarFallback).toHaveTextContent("FL");
    });

    it("debe mostrar las iniciales del usuario en el fallback", () => {
      mockSWR.data = mockUserData;

      render(<NavbarDesktop />);

      const avatarFallback = screen.getByTestId("avatar-fallback");
      expect(avatarFallback).toHaveTextContent("FL");
    });

    it("debe mostrar el nombre completo del usuario", () => {
      mockSWR.data = mockUserData;

      render(<NavbarDesktop />);

      const userName = screen.getByText("Francisco López");
      expect(userName).toBeInTheDocument();
      expect(userName).toHaveClass("font-bold", "text-base");
    });

    it("debe tener el wrapper correcto en estado exitoso", () => {
      mockSWR.data = mockUserData;

      const { container } = render(<NavbarDesktop />);

      const wrapper = container.querySelector(
        ".hidden.lg\\:block.sticky.top-0"
      );
      expect(wrapper).toBeInTheDocument();

      const content = container.querySelector(
        ".bg-white.py-5.px-6.flex.items-center.gap-8.shadow-2xs"
      );
      expect(content).toBeInTheDocument();
    });

    it("debe tener el layout correcto con gap entre elementos", () => {
      mockSWR.data = mockUserData;

      const { container } = render(<NavbarDesktop />);

      const content = container.querySelector(".flex.items-center.gap-8");
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass("gap-8");
    });
  });

  describe("Integración con SWR", () => {
    it("debe usar SWR para obtener datos del usuario", () => {
      mockSWR.data = {
        user: { firstname: "Test", lastname: "User", avatarUrl: "" },
      };
      render(<NavbarDesktop />);

      // Verificar que el componente se renderice correctamente
      expect(screen.getByTestId("avatar")).toBeInTheDocument();
    });
  });

  describe("Responsive design", () => {
    it("debe estar oculto en dispositivos móviles", () => {
      mockSWR.data = {
        user: { firstname: "Test", lastname: "User", avatarUrl: "" },
      };

      const { container } = render(<NavbarDesktop />);

      const wrapper = container.querySelector(".hidden.lg\\:block");
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass("hidden", "lg:block");
    });

    it("debe ser sticky en la parte superior", () => {
      mockSWR.data = {
        user: { firstname: "Test", lastname: "User", avatarUrl: "" },
      };

      const { container } = render(<NavbarDesktop />);

      const wrapper = container.querySelector(".sticky.top-0");
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass("sticky", "top-0");
    });
  });
});
