import { render, screen } from "@testing-library/react";

// Importo todos los iconos
import AnalyzeIcon from "../../../../src/components/icons/analyze";
import ArrowLeftIcon from "../../../../src/components/icons/arrow-left";
import CalendarIcon from "../../../../src/components/icons/calendar";
import CardIcon from "../../../../src/components/icons/card";
import CategoriesIcon from "../../../../src/components/icons/categories";
import CategoryStoresInIcon from "../../../../src/components/icons/category-stores-in";
import CloseIcon from "../../../../src/components/icons/close";
import CommissionIcon from "../../../../src/components/icons/commission";
import DownloadIcon from "../../../../src/components/icons/download";
import FilterIcon from "../../../../src/components/icons/filter";
import HomeIcon from "../../../../src/components/icons/home";
import MenuIcon from "../../../../src/components/icons/menu";
import MetricsIcon from "../../../../src/components/icons/metrics";
import ProgramDepositIcon from "../../../../src/components/icons/program-deposit";

// Función helper para testear iconos
function testIcon(
  IconComponent: React.ComponentType<{ className?: string }>,
  iconName: string
) {
  describe(`${iconName}`, () => {
    it("debe renderizar el icono", () => {
      render(<IconComponent />);

      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg?.tagName).toBe("svg");
    });

    it("debe tener el atributo viewBox", () => {
      render(<IconComponent />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox");
    });

    it("debe tener xmlns", () => {
      render(<IconComponent />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    });

    it("debe aplicar className personalizada", () => {
      const customClass = "w-6 h-6 text-blue-500";
      render(<IconComponent className={customClass} />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveClass(customClass);
    });

    it("debe manejar className undefined", () => {
      render(<IconComponent className={undefined} />);

      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("debe manejar className vacío", () => {
      render(<IconComponent className="" />);

      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("debe tener elementos path o elementos SVG internos", () => {
      render(<IconComponent />);

      const svg = document.querySelector("svg");
      // Verificar que tenga contenido SVG interno
      expect(svg?.children.length).toBeGreaterThan(0);
    });
  });
}

// Tests para cada icono
describe("Iconos", () => {
  testIcon(AnalyzeIcon, "AnalyzeIcon");
  testIcon(ArrowLeftIcon, "ArrowLeftIcon");
  testIcon(CalendarIcon, "CalendarIcon");
  testIcon(CardIcon, "CardIcon");
  testIcon(CategoriesIcon, "CategoriesIcon");
  testIcon(CategoryStoresInIcon, "CategoryStoresInIcon");
  testIcon(CloseIcon, "CloseIcon");
  testIcon(CommissionIcon, "CommissionIcon");
  testIcon(DownloadIcon, "DownloadIcon");
  testIcon(FilterIcon, "FilterIcon");
  testIcon(HomeIcon, "HomeIcon");
  testIcon(MenuIcon, "MenuIcon");
  testIcon(MetricsIcon, "MetricsIcon");
  testIcon(ProgramDepositIcon, "ProgramDepositIcon");
});

// Tests específicos para iconos con características únicas
describe("Tests específicos de iconos", () => {
  describe("HomeIcon", () => {
    it("debe tener el título 'Home'", () => {
      render(<HomeIcon />);

      const title = screen.getByTitle("Home");
      expect(title).toBeInTheDocument();
    });

    it("debe tener viewBox 0 0 24 24", () => {
      render(<HomeIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });

    it("debe tener elementos path con fill='currentColor'", () => {
      render(<HomeIcon />);

      const svg = document.querySelector("svg");
      const paths = svg?.querySelectorAll("path");
      expect(paths?.length).toBeGreaterThan(0);

      // Al menos un path debe tener fill="currentColor"
      const hasCurrentColorPath = Array.from(paths || []).some(
        (path) => path.getAttribute("fill") === "currentColor"
      );
      expect(hasCurrentColorPath).toBe(true);
    });
  });

  describe("MenuIcon", () => {
    it("debe tener el título 'Menu'", () => {
      render(<MenuIcon />);

      const title = screen.getByTitle("Menu");
      expect(title).toBeInTheDocument();
    });

    it("debe tener viewBox 0 0 24 24", () => {
      render(<MenuIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });

    it("debe tener exactamente 3 paths para las líneas del menú", () => {
      render(<MenuIcon />);

      const svg = document.querySelector("svg");
      const paths = svg?.querySelectorAll("path");
      expect(paths).toHaveLength(3);
    });
  });

  describe("ArrowLeftIcon", () => {
    it("debe tener el título 'Arrow Left'", () => {
      render(<ArrowLeftIcon />);

      const title = screen.getByTitle("Arrow Left");
      expect(title).toBeInTheDocument();
    });

    it("debe tener viewBox 0 0 9 16", () => {
      render(<ArrowLeftIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 9 16");
    });

    it("debe tener un solo path", () => {
      render(<ArrowLeftIcon />);

      const svg = document.querySelector("svg");
      const paths = svg?.querySelectorAll("path");
      expect(paths).toHaveLength(1);
    });
  });

  describe("CalendarIcon", () => {
    it("debe tener el título 'Calendar'", () => {
      render(<CalendarIcon />);

      const title = screen.getByTitle("Calendar");
      expect(title).toBeInTheDocument();
    });

    it("debe tener viewBox 0 0 24 24", () => {
      render(<CalendarIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  describe("CardIcon", () => {
    it("debe tener el título 'Card'", () => {
      render(<CardIcon />);

      const title = screen.getByTitle("Card");
      expect(title).toBeInTheDocument();
    });

    it("debe tener viewBox 0 0 24 24", () => {
      render(<CardIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  describe("CategoriesIcon", () => {
    it("debe tener el título 'Categories'", () => {
      render(<CategoriesIcon />);

      const title = screen.getByTitle("Categories");
      expect(title).toBeInTheDocument();
    });

    it("debe tener viewBox 0 0 24 24", () => {
      render(<CategoriesIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  describe("CategoryStoresInIcon", () => {
    it("debe tener el título 'Category Stores In'", () => {
      render(<CategoryStoresInIcon />);

      const title = screen.getByTitle("Category Stores In");
      expect(title).toBeInTheDocument();
    });

    it("debe tener viewBox 0 0 32 32", () => {
      render(<CategoryStoresInIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 32 32");
    });
  });

  describe("CloseIcon", () => {
    it("debe tener viewBox 0 0 16 16", () => {
      render(<CloseIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 16 16");
    });

    it("debe tener un solo path", () => {
      render(<CloseIcon />);

      const svg = document.querySelector("svg");
      const paths = svg?.querySelectorAll("path");
      expect(paths).toHaveLength(1);
    });
  });

  describe("CommissionIcon", () => {
    it("debe tener el título 'Commission'", () => {
      render(<CommissionIcon />);

      const title = screen.getByTitle("Commission");
      expect(title).toBeInTheDocument();
    });

    it("debe tener viewBox 0 0 24 24", () => {
      render(<CommissionIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  describe("DownloadIcon", () => {
    it("debe tener el título 'Download'", () => {
      render(<DownloadIcon />);

      const title = screen.getByTitle("Download");
      expect(title).toBeInTheDocument();
    });

    it("debe tener viewBox 0 0 24 24", () => {
      render(<DownloadIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  describe("FilterIcon", () => {
    it("debe tener el título 'Filter'", () => {
      render(<FilterIcon />);

      const title = screen.getByTitle("Filter");
      expect(title).toBeInTheDocument();
    });

    it("debe tener viewBox 0 0 24 24", () => {
      render(<FilterIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  describe("MetricsIcon", () => {
    it("debe tener el título 'Metrics'", () => {
      render(<MetricsIcon />);

      const title = screen.getByTitle("Metrics");
      expect(title).toBeInTheDocument();
    });

    it("debe tener viewBox 0 0 20 20", () => {
      render(<MetricsIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 20 20");
    });
  });

  describe("ProgramDepositIcon", () => {
    it("debe tener el título 'Program Deposit'", () => {
      render(<ProgramDepositIcon />);

      const title = screen.getByTitle("Program Deposit");
      expect(title).toBeInTheDocument();
    });

    it("debe tener viewBox 0 0 24 24", () => {
      render(<ProgramDepositIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  describe("AnalyzeIcon", () => {
    it("debe tener el título 'Analyze'", () => {
      render(<AnalyzeIcon />);

      const title = screen.getByTitle("Analyze");
      expect(title).toBeInTheDocument();
    });

    it("debe tener viewBox 0 0 24 24", () => {
      render(<AnalyzeIcon />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });
});

// Tests de integración
describe("Tests de integración de iconos", () => {
  it("debe renderizar múltiples iconos juntos", () => {
    render(
      <div>
        <HomeIcon className="w-6 h-6" />
        <MenuIcon className="w-6 h-6" />
        <ArrowLeftIcon className="w-6 h-6" />
      </div>
    );

    const svgs = document.querySelectorAll("svg");
    expect(svgs).toHaveLength(3);
  });

  it("debe aplicar diferentes clases a diferentes iconos", () => {
    render(
      <div>
        <HomeIcon className="w-8 h-8 text-blue-500" />
        <MenuIcon className="w-6 h-6 text-red-500" />
        <ArrowLeftIcon className="w-4 h-4 text-green-500" />
      </div>
    );

    const svgs = document.querySelectorAll("svg");

    expect(svgs[0]).toHaveClass("w-8", "h-8", "text-blue-500");
    expect(svgs[1]).toHaveClass("w-6", "h-6", "text-red-500");
    expect(svgs[2]).toHaveClass("w-4", "h-4", "text-green-500");
  });

  it("debe mantener la accesibilidad con títulos únicos", () => {
    render(
      <div>
        <HomeIcon />
        <MenuIcon />
        <ArrowLeftIcon />
      </div>
    );

    expect(screen.getByTitle("Home")).toBeInTheDocument();
    expect(screen.getByTitle("Menu")).toBeInTheDocument();
    expect(screen.getByTitle("Arrow Left")).toBeInTheDocument();
  });
});
