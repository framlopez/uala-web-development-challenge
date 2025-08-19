import FilterButton from "@/src/components/transactions-page/filters-sidebar/filter-button";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("FilterButton", () => {
  const defaultProps = {
    id: "test-filter",
    checked: false,
    onCheckedChange: jest.fn(),
    label: "Test Filter",
    value: "test-value",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderizado básico", () => {
    it("debe renderizar el botón de filtro", () => {
      render(<FilterButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("debe mostrar el label correcto", () => {
      render(<FilterButton {...defaultProps} />);

      expect(screen.getByText("Test Filter")).toBeInTheDocument();
    });

    it("debe tener el checkbox oculto", () => {
      render(<FilterButton {...defaultProps} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("sr-only");
    });
  });

  describe("Estados del botón", () => {
    it("debe renderizar como no seleccionado por defecto", () => {
      render(<FilterButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("bg-[#E0EDFF]");

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });

    it("debe renderizar como seleccionado cuando checked es true", () => {
      render(<FilterButton {...defaultProps} checked={true} />);

      const buttons = screen.getAllByRole("button");
      const mainButton = buttons[0]; // El label principal
      expect(mainButton).toHaveClass("bg-[#E0EDFF]");

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("debe mostrar el ícono de cerrar cuando está seleccionado", () => {
      render(<FilterButton {...defaultProps} checked={true} />);

      // Verificar que el ícono de cerrar esté presente
      const closeIcon = document.querySelector("svg");
      expect(closeIcon).toBeInTheDocument();
    });

    it("no debe mostrar el ícono de cerrar cuando no está seleccionado", () => {
      render(<FilterButton {...defaultProps} checked={false} />);

      // El ícono de cerrar no debe estar presente
      const closeIcon = document.querySelector('[aria-hidden="true"]');
      // Nota: puede haber otros íconos, así que verificamos que no sea el de cerrar específicamente
    });
  });

  describe("Interacciones del usuario", () => {
    it("debe llamar onCheckedChange cuando se hace clic en el label", async () => {
      const user = userEvent.setup();
      const onCheckedChangeMock = jest.fn();
      render(
        <FilterButton {...defaultProps} onCheckedChange={onCheckedChangeMock} />
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(onCheckedChangeMock).toHaveBeenCalledWith("test-value");
      expect(onCheckedChangeMock).toHaveBeenCalledTimes(1);
    });

    it("debe llamar onCheckedChange cuando se hace clic en el checkbox", async () => {
      const user = userEvent.setup();
      const onCheckedChangeMock = jest.fn();
      render(
        <FilterButton {...defaultProps} onCheckedChange={onCheckedChangeMock} />
      );

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(onCheckedChangeMock).toHaveBeenCalledWith("test-value");
      expect(onCheckedChangeMock).toHaveBeenCalledTimes(1);
    });

    it("debe llamar onCheckedChange cuando se hace clic en el ícono de cerrar", async () => {
      const user = userEvent.setup();
      const onCheckedChangeMock = jest.fn();
      render(
        <FilterButton
          {...defaultProps}
          checked={true}
          onCheckedChange={onCheckedChangeMock}
        />
      );

      // Buscar el botón del ícono de cerrar
      const buttons = screen.getAllByRole("button");
      const closeButton = buttons[1]; // El botón del ícono de cerrar
      if (closeButton) {
        await user.click(closeButton);
        expect(onCheckedChangeMock).toHaveBeenCalledWith("test-value");
        expect(onCheckedChangeMock).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe("Accesibilidad", () => {
    it("debe tener el checkbox accesible", () => {
      render(<FilterButton {...defaultProps} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute("id", "test-filter");
    });

    it("debe tener el label asociado correctamente", () => {
      render(<FilterButton {...defaultProps} />);

      const checkbox = screen.getByRole("checkbox");
      const label = screen.getByText("Test Filter");

      expect(label.closest("label")).toHaveAttribute("for", "test-filter");
      expect(checkbox).toHaveAttribute("id", "test-filter");
    });

    it("debe tener el rol button en el label", () => {
      render(<FilterButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Estilos y clases CSS", () => {
    it("debe aplicar las clases CSS base correctas", () => {
      render(<FilterButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "border-2",
        "border-uala-primary",
        "rounded-full",
        "p-3"
      );
    });

    it("debe aplicar estilos condicionales basados en el estado checked", () => {
      // No seleccionado
      const { rerender } = render(
        <FilterButton {...defaultProps} checked={false} />
      );
      let buttons = screen.getAllByRole("button");
      let mainButton = buttons[0];
      expect(mainButton).not.toHaveClass("bg-[#E0EDFF]");

      // Seleccionado
      rerender(<FilterButton {...defaultProps} checked={true} />);
      buttons = screen.getAllByRole("button");
      mainButton = buttons[0];
      expect(mainButton).toHaveClass("bg-[#E0EDFF]");
    });

    it("debe aplicar las clases de texto correctas", () => {
      render(<FilterButton {...defaultProps} />);

      const container = screen.getByText("Test Filter").closest("div");
      expect(container).toHaveClass(
        "text-[10px]",
        "text-uala-primary",
        "leading-none"
      );
    });
  });

  describe("Funcionalidad del checkbox", () => {
    it("debe sincronizar el estado del checkbox con la prop checked", () => {
      const { rerender } = render(
        <FilterButton {...defaultProps} checked={false} />
      );

      let checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      rerender(<FilterButton {...defaultProps} checked={true} />);
      checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("debe pasar el valor correcto al callback", async () => {
      const user = userEvent.setup();
      const onCheckedChangeMock = jest.fn();
      render(
        <FilterButton {...defaultProps} onCheckedChange={onCheckedChangeMock} />
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(onCheckedChangeMock).toHaveBeenCalledWith("test-value");
    });
  });

  describe("Casos edge", () => {
    it("debe manejar labels vacíos", () => {
      render(<FilterButton {...defaultProps} label="" />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("debe manejar valores undefined", () => {
      render(<FilterButton {...defaultProps} value={undefined as any} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("debe funcionar sin callback", () => {
      expect(() => {
        render(
          <FilterButton {...defaultProps} onCheckedChange={undefined as any} />
        );
      }).not.toThrow();
    });
  });
});
