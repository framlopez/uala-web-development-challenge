export async function downloadTransactions(dateRange: {
  from: Date;
  to: Date;
}): Promise<void> {
  try {
    const { from, to } = dateRange;

    // Validar que las fechas sean válidas
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new Error("Fechas inválidas");
    }

    // Validar que las fechas no sean futuras
    const now = new Date();
    if (from > now || to > now) {
      throw new Error("No se puede descargar transacciones de fechas futuras");
    }

    // Validar que la fecha de inicio no sea posterior a la fecha de fin
    if (from > to) {
      throw new Error(
        "La fecha de inicio no puede ser posterior a la fecha de fin"
      );
    }

    // Formatear fechas como YYYY-MM-DD
    const formattedStartDate = from.toISOString().split("T")[0];
    const formattedEndDate = to.toISOString().split("T")[0];

    // Construir URL del endpoint
    const url = `/api/me/transactions/download?dateFrom=${formattedStartDate}&dateTo=${formattedEndDate}`;

    // Realizar la descarga con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "text/csv",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = "Error al descargar las transacciones";

      if (response.status === 400) {
        errorMessage = "Formato de fechas inválido";
      } else if (response.status === 404) {
        errorMessage =
          "No hay transacciones para el rango de fechas seleccionado";
      } else if (response.status === 503) {
        errorMessage = "Error de conexión. Por favor, intenta nuevamente";
      } else if (response.status >= 500) {
        errorMessage = "Error del servidor. Por favor, intenta más tarde";
      }

      throw new Error(errorMessage);
    }

    // Verificar que el contenido sea CSV
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/csv")) {
      throw new Error("El archivo descargado no es un CSV válido");
    }

    // Obtener el blob de la respuesta
    const blob = await response.blob();

    // Verificar que el blob no esté vacío
    if (blob.size === 0) {
      throw new Error("El archivo descargado está vacío");
    }

    // Crear URL del blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Crear elemento de descarga
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `transactions_${formattedStartDate}_to_${formattedEndDate}.csv`;

    // Simular clic para iniciar descarga
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading transactions:", error);

    // Re-lanzar el error para que sea manejado por el componente
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Error desconocido al descargar las transacciones");
    }
  }
}
