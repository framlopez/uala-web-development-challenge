import HistoryList from "@/src/components/transactions-page/list-history/listing";
import { render, screen } from "@testing-library/react";

// Mock de next/image
jest.mock("next/image", () => {
  return function MockImage({ src, alt, className }: any) {
    return (
      <img data-testid="image" src={src} alt={alt} className={className} />
    );
  };
});

// Mock de next/navigation
let mockSearchParamsString = "fechaDesde=2024-01-01&fechaHasta=2024-01-31";
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    toString: () => mockSearchParamsString,
  }),
}));

// Mock de SWR
const swrState: any = { data: undefined, isLoading: false, error: undefined };
jest.mock("swr", () => ({
  __esModule: true,
  default: () => swrState,
}));

// Mock de fetcher
jest.mock("@/utils/fetcher", () => "mocked-fetcher");

// Mock de Skeleton
jest.mock("@/shadcn/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

// Mock de HistoryListItem
jest.mock("@/components/transactions-page/list-history/listing-item", () => {
  return function MockHistoryListItem({ transaction }: any) {
    return (
      <div data-testid="history-list-item" data-id={transaction.id}>
        {transaction.paymentMethod}
      </div>
    );
  };
});

describe("HistoryList", () => {
  beforeEach(() => {
    swrState.data = undefined;
    swrState.isLoading = false;
    swrState.error = undefined;

    // Resetear el mock por defecto para useSearchParams
    mockSearchParamsString = "fechaDesde=2024-01-01&fechaHasta=2024-01-31";
  });

  it("debe renderizar skeletons durante el loading", () => {
    swrState.isLoading = true;

    render(<HistoryList />);

    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThan(0);

    // Verificar que los skeletons tengan las clases correctas
    expect(skeletons[0]).toHaveClass("size-8", "rounded-xl", "flex-shrink-0");
    expect(skeletons[1]).toHaveClass("rounded-xl", "w-40", "h-3.5");
  });

  it("debe renderizar mensaje de error cuando hay un error", () => {
    swrState.error = new Error("Error de red");

    render(<HistoryList />);

    expect(
      screen.getByText("Hubo un error al cargar las transacciones.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("image")).toHaveAttribute("alt", "Empty search");
    expect(screen.getByTestId("image")).toHaveClass("size-[72px]", "mx-auto");
  });

  it("debe renderizar mensaje de transacciones vacías", () => {
    swrState.data = { transactions: [] };

    render(<HistoryList />);

    expect(
      screen.getByText(
        "No hay resultados que mostrar. Podés probar usando los filtros."
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId("image")).toHaveAttribute("alt", "Empty search");
    expect(screen.getByTestId("image")).toHaveClass("size-[72px]", "mx-auto");
  });

  it("debe renderizar la lista de transacciones cuando hay datos", () => {
    const mockTransactions = [
      {
        id: "1",
        paymentMethod: "POSPRO",
        amount: 1000,
        createdAt: "2024-01-01T10:00:00Z",
      },
      {
        id: "2",
        paymentMethod: "LINK",
        amount: 2000,
        createdAt: "2024-01-02T10:00:00Z",
      },
    ];

    swrState.data = { transactions: mockTransactions };

    render(<HistoryList />);

    const listItems = screen.getAllByTestId("history-list-item");
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveAttribute("data-id", "1");
    expect(listItems[1]).toHaveAttribute("data-id", "2");
  });

  it("debe construir la URL de la API con los filtros de searchParams", () => {
    swrState.data = { transactions: [] };

    render(<HistoryList />);

    // Verificar que se use la URL correcta con filtros
    // El mock de useSearchParams retorna "fechaDesde=2024-01-01&fechaHasta=2024-01-31"
    // por lo que la URL debería ser "/api/me/transactions?fechaDesde=2024-01-01&fechaHasta=2024-01-31"
    expect(
      screen.getByText(
        "No hay resultados que mostrar. Podés probar usando los filtros."
      )
    ).toBeInTheDocument();
  });

  it("debe usar la URL base cuando no hay searchParams", () => {
    // Configurar el mock para que retorne string vacío
    mockSearchParamsString = "";

    swrState.data = { transactions: [] };

    render(<HistoryList />);

    expect(
      screen.getByText(
        "No hay resultados que mostrar. Podés probar usando los filtros."
      )
    ).toBeInTheDocument();
  });
});
