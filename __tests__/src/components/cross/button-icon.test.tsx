import { fireEvent, render, screen } from "@testing-library/react";
import ButtonIcon from "../../../../src/components/cross/button-icon";

// Mock de la función cn
jest.mock("../../../../src/shadcn/lib/utils", () => ({
  cn: (...classes: (string | undefined | null | false)[]) =>
    classes.filter(Boolean).join(" "),
}));

describe("ButtonIcon", () => {
  const defaultProps = {
    children: <div data-testid="icon">Icono</div>,
  };

  it("debe renderizar el botón con el icono", () => {
    render(<ButtonIcon {...defaultProps} />);

    const button = screen.getByRole("button");
    const icon = screen.getByTestId("icon");

    expect(button).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent("Icono");
  });

  it("debe tener las clases CSS por defecto", () => {
    render(<ButtonIcon {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "p-3",
      "hover:bg-gray-100",
      "rounded-lg",
      "transition-colors",
      "cursor-pointer"
    );
  });

  it("debe aplicar clases CSS personalizadas", () => {
    const customClass = "bg-blue-500 text-white";
    render(<ButtonIcon {...defaultProps} className={customClass} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(customClass);
  });

  it("debe tener el tipo 'button' por defecto", () => {
    render(<ButtonIcon {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("debe ejecutar onClick cuando se hace clic", () => {
    const handleClick = jest.fn();
    render(<ButtonIcon {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("debe no ejecutar onClick cuando no se proporciona", () => {
    render(<ButtonIcon {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it("debe tener el estado disabled por defecto como false", () => {
    render(<ButtonIcon {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("debe tener el estado disabled cuando se especifica como true", () => {
    render(<ButtonIcon {...defaultProps} disabled={true} />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("debe tener el estado disabled cuando se especifica como false", () => {
    render(<ButtonIcon {...defaultProps} disabled={false} />);

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("debe tener estilos disabled cuando está deshabilitado", () => {
    render(<ButtonIcon {...defaultProps} disabled />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
  });

  it("debe no tener estilos disabled cuando no está deshabilitado", () => {
    render(<ButtonIcon {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).not.toHaveClass("opacity-50", "cursor-not-allowed");
  });

  it("debe tener estilos hover cuando no está deshabilitado", () => {
    render(<ButtonIcon {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-gray-100", "cursor-pointer");
  });

  it("debe no tener estilos hover cuando está deshabilitado", () => {
    render(<ButtonIcon {...defaultProps} disabled />);

    const button = screen.getByRole("button");
    expect(button).not.toHaveClass("hover:bg-gray-100", "cursor-pointer");
  });

  it("debe renderizar children complejos", () => {
    const complexChildren = (
      <>
        <span>Texto</span>
        <div>Elemento</div>
        <svg data-testid="svg-icon">SVG</svg>
      </>
    );

    render(<ButtonIcon>{complexChildren}</ButtonIcon>);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Texto");
    expect(button).toHaveTextContent("Elemento");
    expect(screen.getByTestId("svg-icon")).toBeInTheDocument();
  });

  it("debe combinar clases personalizadas con las por defecto", () => {
    const customClass = "bg-red-500";
    render(<ButtonIcon {...defaultProps} className={customClass} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "p-3",
      "hover:bg-gray-100",
      "rounded-lg",
      customClass
    );
  });

  it("debe manejar className undefined", () => {
    render(<ButtonIcon {...defaultProps} className={undefined} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("p-3", "hover:bg-gray-100", "rounded-lg");
  });

  it("debe manejar className null", () => {
    render(<ButtonIcon {...defaultProps} className={null} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("p-3", "hover:bg-gray-100", "rounded-lg");
  });

  it("debe manejar className vacío", () => {
    render(<ButtonIcon {...defaultProps} className="" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("p-3", "hover:bg-gray-100", "rounded-lg");
  });

  it("debe tener transiciones suaves", () => {
    render(<ButtonIcon {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("transition-colors");
  });

  it("debe tener padding uniforme", () => {
    render(<ButtonIcon {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("p-3");
  });

  it("debe tener bordes redondeados", () => {
    render(<ButtonIcon {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-lg");
  });

  it("debe manejar múltiples clicks correctamente", () => {
    const handleClick = jest.fn();
    render(<ButtonIcon {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole("button");

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it("debe mantener el estado disabled después de clicks", () => {
    const handleClick = jest.fn();
    render(<ButtonIcon {...defaultProps} disabled onClick={handleClick} />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });
});
