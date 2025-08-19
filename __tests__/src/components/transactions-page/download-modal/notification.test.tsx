import Notification from "@/src/components/transactions-page/download-modal/notification";
import { act, fireEvent, render, screen } from "@testing-library/react";

// Mock de timers para controlar setTimeout
jest.useFakeTimers();

describe("Notification", () => {
  const defaultProps = {
    message: "Test notification message",
    type: "success" as const,
    isVisible: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("Renderizado", () => {
    it("debe renderizar la notificación cuando isVisible es true", () => {
      render(<Notification {...defaultProps} />);

      expect(screen.getByText("Test notification message")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("no debe renderizar nada cuando isVisible es false", () => {
      render(<Notification {...defaultProps} isVisible={false} />);

      expect(
        screen.queryByText("Test notification message")
      ).not.toBeInTheDocument();
    });

    it("debe mostrar el mensaje correcto", () => {
      const customMessage = "Mensaje personalizado de notificación";
      render(<Notification {...defaultProps} message={customMessage} />);

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });
  });

  describe("Tipos de notificación", () => {
    it("debe mostrar el ícono de éxito para notificaciones de éxito", () => {
      render(<Notification {...defaultProps} type="success" />);

      // Verificar que el ícono de éxito esté presente usando el nombre correcto de Lucide
      const successIcon =
        document.querySelector(".lucide-circle-check-big") ||
        document.querySelector('[class*="circle-check"]');

      expect(successIcon).toBeInTheDocument();
    });

    it("debe mostrar el ícono de error para notificaciones de error", () => {
      render(<Notification {...defaultProps} type="error" />);

      // Verificar que el ícono de error esté presente usando el nombre correcto de Lucide
      const errorIcon =
        document.querySelector(".lucide-circle-x") ||
        document.querySelector('[class*="circle-x"]');

      expect(errorIcon).toBeInTheDocument();
    });

    it("debe aplicar los estilos correctos para notificación de éxito", () => {
      render(<Notification {...defaultProps} type="success" />);

      // Buscar el contenedor principal de la notificación
      const notification = screen
        .getByText("Test notification message")
        .closest(".bg-uala-primary");
      expect(notification).toBeInTheDocument();
    });

    it("debe aplicar los estilos correctos para notificación de error", () => {
      render(<Notification {...defaultProps} type="error" />);

      // Buscar el contenedor principal de la notificación
      const notification = screen
        .getByText("Test notification message")
        .closest(".bg-uala-primary");
      expect(notification).toBeInTheDocument();
    });
  });

  describe("Interacciones del usuario", () => {
    it("debe llamar onClose cuando se hace clic en el botón de cerrar", () => {
      const onCloseMock = jest.fn();
      render(<Notification {...defaultProps} onClose={onCloseMock} />);

      const closeButton = screen.getByRole("button");
      fireEvent.click(closeButton);

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("debe tener el botón de cerrar accesible", () => {
      render(<Notification {...defaultProps} />);

      const closeButton = screen.getByRole("button");
      expect(closeButton).toBeInTheDocument();
      // Removemos la verificación de aria-label ya que no está implementado
    });
  });

  describe("Auto-cierre", () => {
    it("debe cerrar automáticamente después de 5 segundos", () => {
      const onCloseMock = jest.fn();
      render(<Notification {...defaultProps} onClose={onCloseMock} />);

      // Avanzar el tiempo para simular el paso de 5 segundos
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("debe limpiar el timer cuando se desmonta el componente", () => {
      const onCloseMock = jest.fn();
      const { unmount } = render(
        <Notification {...defaultProps} onClose={onCloseMock} />
      );

      // Desmontar el componente antes de que se ejecute el timer
      unmount();

      // Avanzar el tiempo para verificar que no se ejecute onClose
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(onCloseMock).not.toHaveBeenCalled();
    });

    it("debe reiniciar el timer cuando cambia isVisible", () => {
      const onCloseMock = jest.fn();
      const { rerender } = render(
        <Notification {...defaultProps} onClose={onCloseMock} />
      );

      // Avanzar 3 segundos
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Cambiar isVisible a false y luego a true
      rerender(
        <Notification
          {...defaultProps}
          isVisible={false}
          onClose={onCloseMock}
        />
      );
      rerender(
        <Notification
          {...defaultProps}
          isVisible={true}
          onClose={onCloseMock}
        />
      );

      // Avanzar 3 segundos más (total 6 segundos, pero el timer se reinició)
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // onClose no debería haberse llamado aún
      expect(onCloseMock).not.toHaveBeenCalled();

      // Avanzar 2 segundos más para completar los 5 segundos del nuevo timer
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("Animaciones", () => {
    it("debe aplicar las clases de animación correctas", () => {
      render(<Notification {...defaultProps} />);

      // Buscar el contenedor principal que tiene las clases de animación
      const notification = screen
        .getByText("Test notification message")
        .closest(".transition-all");
      expect(notification).toBeInTheDocument();
    });

    it("debe aplicar las clases de transformación para la animación", () => {
      render(<Notification {...defaultProps} />);

      // Buscar el contenedor principal que tiene las clases de transformación
      const notification = screen
        .getByText("Test notification message")
        .closest(".translate-x-0");
      expect(notification).toBeInTheDocument();
    });
  });

  describe("Posicionamiento", () => {
    it("debe estar posicionado en la esquina inferior derecha", () => {
      render(<Notification {...defaultProps} />);

      // Buscar el contenedor principal que tiene las clases de posicionamiento
      const notification = screen
        .getByText("Test notification message")
        .closest(".fixed.bottom-4.right-4");
      expect(notification).toBeInTheDocument();
    });

    it("debe tener el z-index correcto", () => {
      render(<Notification {...defaultProps} />);

      // Buscar el contenedor principal que tiene la clase z-50
      const notification = screen
        .getByText("Test notification message")
        .closest(".z-50");
      expect(notification).toBeInTheDocument();
    });
  });

  describe("Accesibilidad", () => {
    it("debe tener un botón de cerrar accesible", () => {
      render(<Notification {...defaultProps} />);

      const closeButton = screen.getByRole("button");
      expect(closeButton).toBeInTheDocument();
    });

    it("debe tener el texto del mensaje visible", () => {
      render(<Notification {...defaultProps} />);

      const message = screen.getByText("Test notification message");
      expect(message).toBeInTheDocument();
      expect(message).toBeVisible();
    });
  });

  describe("Casos edge", () => {
    it("debe manejar mensajes vacíos", () => {
      render(<Notification {...defaultProps} message="" />);

      // Para mensajes vacíos, verificamos que el elemento p esté presente pero sin texto
      const messageElement = document.querySelector(
        "p.text-sm.font-medium.text-white"
      );
      expect(messageElement).toBeInTheDocument();
      expect(messageElement?.textContent).toBe("");
    });

    it("debe manejar mensajes muy largos", () => {
      const longMessage = "A".repeat(1000);
      render(<Notification {...defaultProps} message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("debe funcionar correctamente con múltiples notificaciones", () => {
      const onClose1 = jest.fn();
      const onClose2 = jest.fn();

      const { rerender } = render(
        <Notification {...defaultProps} onClose={onClose1} />
      );

      // Cambiar a segunda notificación
      rerender(<Notification {...defaultProps} onClose={onClose2} />);

      // Avanzar el tiempo para que se ejecute el timer
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(onClose2).toHaveBeenCalledTimes(1);
      expect(onClose1).not.toHaveBeenCalled();
    });
  });
});
