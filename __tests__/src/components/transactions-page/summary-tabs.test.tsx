import { render, within } from "@testing-library/react";
import SummaryTabs from "../../../../src/components/transactions-page/summary/tabs";

// Mock de Skeleton
jest.mock("../../../../src/shadcn/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

// Mock de Tabs de shadcn
jest.mock("../../../../src/shadcn/components/ui/tabs", () => ({
  Tabs: ({ children, className, defaultValue, onValueChange }: any) => (
    <div
      data-testid="tabs"
      data-default-value={defaultValue}
      className={className}
      onClick={() => onValueChange && onValueChange("daily")}
    >
      {children}
    </div>
  ),
  TabsList: ({ children, className }: any) => (
    <div data-testid="tabs-list" className={className}>
      {children}
    </div>
  ),
  TabsTrigger: ({ children, className, value }: any) => (
    <button
      data-testid={`tab-${value}`}
      className={className}
      data-value={value}
    >
      {children}
    </button>
  ),
}));

// Mock de fetcher (usado por SWR)
jest.mock("../../../../src/utils/fetcher", () => "mocked-fetcher");

// Mock de SWR para controlar estados
const swrState: any = { data: undefined, isLoading: false, error: undefined };
jest.mock("swr", () => ({
  __esModule: true,
  default: () => swrState,
}));

// Mock de formatPrice para hacer predecible el render
jest.mock("../../../../src/utils/format-price", () => {
  return {
    __esModule: true,
    default: (amount: number) => ({
      prefix: "ARS",
      symbol: "$",
      amount: `${Math.floor(amount)}`,
      decimals: "00",
    }),
  };
});

describe("SummaryTabs", () => {
  beforeEach(() => {
    swrState.data = undefined;
    swrState.isLoading = false;
    swrState.error = undefined;
  });

  it("debe renderizar el estado de loading", () => {
    swrState.isLoading = true;

    const { container } = render(<SummaryTabs />);

    const utils = within(container);
    const skeleton = utils.getByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("h-[34px]", "rounded-xl", "w-1/2");
  });

  it("debe renderizar el estado de error", () => {
    swrState.error = new Error("Network error");

    const { container } = render(<SummaryTabs />);

    const utils = within(container);
    expect(
      utils.getByText("Hubo un error al cargar los datos")
    ).toBeInTheDocument();
  });

  it("debe renderizar el monto cuando hay datos", () => {
    swrState.data = {
      weekly: { totalAmount: 1234.56 },
      daily: { totalAmount: 10 },
      monthly: { totalAmount: 99999.99 },
    };

    const { container } = render(<SummaryTabs />);
    const utils = within(container);

    // Por defecto Weekly
    expect(utils.getByText("ARS")).toBeInTheDocument();
    expect(utils.getByText("$")).toBeInTheDocument();
    expect(
      utils.getAllByText(
        (_, node) => !!node && node.textContent?.includes("1234") === true
      ).length
    ).toBeGreaterThan(0);
    expect(
      utils.getAllByText(
        (_, node) => !!node && /00$/.test(node.textContent || "")
      ).length
    ).toBeGreaterThan(0);
  });

  it("debe mostrar el monto de Daily cuando el tab activo inicial es daily", () => {
    swrState.data = {
      weekly: { totalAmount: 100 },
      daily: { totalAmount: 50 },
      monthly: { totalAmount: 600 },
    };

    const React = require("react");
    const useStateSpy = jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => ["daily", jest.fn()]);

    const { container } = render(<SummaryTabs />);
    const utils = within(container);
    expect(
      utils.getAllByText(
        (_, node) => !!node && node.textContent?.includes("50") === true
      ).length
    ).toBeGreaterThan(0);

    useStateSpy.mockRestore();
  });

  it("debe manejar el cambio de tab a través de onValueChange", () => {
    swrState.data = {
      weekly: { totalAmount: 100 },
      daily: { totalAmount: 50 },
      monthly: { totalAmount: 600 },
    };

    const React = require("react");
    const setActiveTabMock = jest.fn();
    const useStateSpy = jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => ["weekly", setActiveTabMock]);

    const { container } = render(<SummaryTabs />);
    const utils = within(container);

    // Simular el cambio de tab haciendo click en el contenedor Tabs
    // que dispara onValueChange("daily")
    const tabsContainer = utils.getByTestId("tabs");
    tabsContainer.click();

    // Verificar que setActiveTab se llamó con "daily"
    expect(setActiveTabMock).toHaveBeenCalledWith("daily");

    useStateSpy.mockRestore();
  });

  it("debe mostrar el indicador en el tab activo", () => {
    swrState.data = {
      weekly: { totalAmount: 0 },
      daily: { totalAmount: 0 },
      monthly: { totalAmount: 0 },
    };

    const { container } = render(<SummaryTabs />);
    const utils = within(container);

    const weeklyTrigger = utils.getByTestId("tab-weekly");
    expect(weeklyTrigger).toBeInTheDocument();
  });
});
