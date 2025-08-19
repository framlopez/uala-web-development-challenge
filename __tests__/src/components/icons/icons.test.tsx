import ArrowLeftIcon from "@/src/components/icons/arrow-left";
import HomeIcon from "@/src/components/icons/home";
import MenuIcon from "@/src/components/icons/menu";
import { render } from "@testing-library/react";

describe("Icon Components", () => {
  describe("Common icon properties", () => {
    it("should render without crashing", () => {
      render(<HomeIcon />);
      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const customClass = "custom-icon-class";
      render(<HomeIcon className={customClass} />);
      const svg = document.querySelector("svg");
      expect(svg).toHaveClass(customClass);
    });

    it("should handle undefined className", () => {
      render(<HomeIcon className={undefined} />);
      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should handle empty className", () => {
      render(<HomeIcon className="" />);
      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should have path elements or internal SVG elements", () => {
      render(<HomeIcon />);
      const svg = document.querySelector("svg");
      const paths = svg?.querySelectorAll("path");
      const internalSvgs = svg?.querySelectorAll("svg");
      expect(
        (paths && paths.length > 0) || (internalSvgs && internalSvgs.length > 0)
      ).toBe(true);
    });
  });

  describe("Specific icon tests", () => {
    describe("HomeIcon", () => {
      it("should have title 'Home'", () => {
        render(<HomeIcon />);
        const svg = document.querySelector("svg");
        const title = svg?.querySelector("title");
        expect(title).toHaveTextContent("Home");
      });

      it("should have viewBox 0 0 24 24", () => {
        render(<HomeIcon />);
        const svg = document.querySelector("svg");
        expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
      });

      it("should have path elements with fill='currentColor'", () => {
        render(<HomeIcon />);
        const svg = document.querySelector("svg");
        const paths = svg?.querySelectorAll("path");
        expect(paths && paths.length).toBeGreaterThan(0);
        // At least one path should have fill="currentColor"
        const hasCurrentColorPath = Array.from(paths || []).some(
          (path) => path.getAttribute("fill") === "currentColor"
        );
        expect(hasCurrentColorPath).toBe(true);
      });
    });

    describe("MenuIcon", () => {
      it("should have title 'Menu'", () => {
        render(<MenuIcon />);
        const svg = document.querySelector("svg");
        const title = svg?.querySelector("title");
        expect(title).toHaveTextContent("Menu");
      });

      it("should have viewBox 0 0 24 24", () => {
        render(<MenuIcon />);
        const svg = document.querySelector("svg");
        expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
      });

      it("should have exactly 3 paths for menu lines", () => {
        render(<MenuIcon />);
        const svg = document.querySelector("svg");
        const paths = svg?.querySelectorAll("path");
        expect(paths).toHaveLength(3);
      });
    });

    describe("ArrowLeftIcon", () => {
      it("should have title 'Arrow Left'", () => {
        render(<ArrowLeftIcon />);
        const svg = document.querySelector("svg");
        const title = svg?.querySelector("title");
        expect(title).toHaveTextContent("Arrow Left");
      });

      it("should have viewBox 0 0 9 16", () => {
        render(<ArrowLeftIcon />);
        const svg = document.querySelector("svg");
        expect(svg).toHaveAttribute("viewBox", "0 0 9 16");
      });

      it("should have single path", () => {
        render(<ArrowLeftIcon />);
        const svg = document.querySelector("svg");
        const paths = svg?.querySelectorAll("path");
        expect(paths).toHaveLength(1);
      });
    });
  });
});
