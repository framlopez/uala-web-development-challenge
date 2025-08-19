import History from "@/src/components/transactions-page/list-history/index";
import { render, screen } from "@testing-library/react";

// Mock de HistoryList
jest.mock("@/components/transactions-page/list-history/listing", () => {
  return function MockHistoryList() {
    return <div data-testid="history-list">History List</div>;
  };
});

// Mock de FiltersSidebarButton
jest.mock("@/components/transactions-page/filters-sidebar/button", () => {
  return function MockFiltersSidebarButton() {
    return (
      <div data-testid="filters-sidebar-button">Filters Sidebar Button</div>
    );
  };
});

// Mock de DownloadModalButton
jest.mock("@/components/transactions-page/download-modal/button", () => {
  return function MockDownloadModalButton() {
    return <div data-testid="download-modal-button">Download Modal Button</div>;
  };
});

describe("History", () => {
  it("debe renderizar el título y los botones de acción", () => {
    render(<History />);

    expect(screen.getByText("Historial de transacciones")).toBeInTheDocument();
    expect(screen.getByTestId("filters-sidebar-button")).toBeInTheDocument();
    expect(screen.getByTestId("download-modal-button")).toBeInTheDocument();
  });

  it("debe renderizar HistoryList", () => {
    render(<History />);
    expect(screen.getByTestId("history-list")).toBeInTheDocument();
  });

  it("debe tener la estructura correcta del layout", () => {
    render(<History />);

    // Verificar que el título esté en un h2
    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveTextContent("Historial de transacciones");

    // Verificar que los botones estén en un contenedor flex
    const buttonsContainer = screen.getByTestId(
      "filters-sidebar-button"
    ).parentElement;
    expect(buttonsContainer).toHaveClass("flex", "items-center");
  });
});
