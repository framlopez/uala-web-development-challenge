import { fireEvent, render, screen } from "@testing-library/react";
import Button from "../../../../src/components/cross/button";

// Mock de la función cn
jest.mock("../../../../src/shadcn/lib/utils", () => ({
  cn: (...classes: (string | undefined | null | false)[]) =>
    classes.filter(Boolean).join(" "),
}));

describe("Button", () => {
  const defaultProps = {
    children: "Botón de prueba",
  };

  it("debe renderizar el botón con el texto correcto", () => {
    render(<Button {...defaultProps} />);

    const button = screen.getByRole("button", { name: "Botón de prueba" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Botón de prueba");
  });

  it("debe tener las clases CSS por defecto", () => {
    render(<Button {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "px-4",
      "py-3",
      "rounded-lg",
      "flex",
      "items-center",
      "gap-1",
      "text-sm"
    );
  });

  it("debe aplicar clases CSS personalizadas", () => {
    const customClass = "bg-blue-500 text-white";
    render(<Button {...defaultProps} className={customClass} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(customClass);
  });

  it("debe tener el tipo 'button' por defecto", () => {
    render(<Button {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("debe cambiar el tipo cuando se especifica", () => {
    render(<Button {...defaultProps} type="submit" />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("debe cambiar el tipo a 'reset' cuando se especifica", () => {
    render(<Button {...defaultProps} type="reset" />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "reset");
  });

  it("debe ejecutar onClick cuando se hace clic", () => {
    const handleClick = jest.fn();
    render(<Button {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("debe tener el atributo form cuando se especifica", () => {
    const formId = "test-form";
    render(<Button {...defaultProps} form={formId} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("form", formId);
  });

  it("debe pasar props adicionales al botón", () => {
    const testId = "test-button";
    render(<Button {...defaultProps} data-testid={testId} />);

    const button = screen.getByTestId(testId);
    expect(button).toBeInTheDocument();
  });

  it("debe tener el estado disabled cuando se especifica", () => {
    render(<Button {...defaultProps} disabled />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("debe tener el estado disabled cuando se especifica como true", () => {
    render(<Button {...defaultProps} disabled={true} />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("debe no tener el estado disabled cuando se especifica como false", () => {
    render(<Button {...defaultProps} disabled={false} />);

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("debe tener estilos hover cuando no está deshabilitado", () => {
    render(<Button {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "hover:bg-gray-100",
      "cursor-pointer",
      "transition-colors"
    );
  });

  it("debe no tener estilos hover cuando está deshabilitado", () => {
    render(<Button {...defaultProps} disabled />);

    const button = screen.getByRole("button");
    expect(button).not.toHaveClass(
      "hover:bg-gray-100",
      "cursor-pointer",
      "transition-colors"
    );
  });

  it("debe renderizar children complejos", () => {
    const complexChildren = (
      <>
        <span>Texto</span>
        <div>Elemento</div>
      </>
    );

    render(<Button>{complexChildren}</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Texto");
    expect(button).toHaveTextContent("Elemento");
  });

  it("debe combinar clases personalizadas con las por defecto", () => {
    const customClass = "bg-red-500";
    render(<Button {...defaultProps} className={customClass} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-4", "py-3", "rounded-lg", customClass);
  });

  it("debe manejar className undefined", () => {
    render(<Button {...defaultProps} className={undefined} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-4", "py-3", "rounded-lg");
  });

  it("debe manejar className null", () => {
    render(<Button {...defaultProps} className={null} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-4", "py-3", "rounded-lg");
  });

  it("debe manejar className vacío", () => {
    render(<Button {...defaultProps} className="" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-4", "py-3", "rounded-lg");
  });
});
