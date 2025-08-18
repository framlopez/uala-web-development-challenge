import Transaction from "../types/entities/transaction";

export interface CSVGeneratorOptions {
  filename?: string;
  dateFormat?: Intl.DateTimeFormatOptions;
}

export class CSVGenerator {
  private static readonly DEFAULT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
    minute: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    year: "numeric",
    day: "2-digit",
  };

  private static readonly DEFAULT_FILENAME = "transacciones";

  /**
   * Escapa un campo CSV según las reglas estándar
   */
  private static escapeCSVField(field: unknown): string {
    if (field === null || field === undefined) return "";

    const stringField = String(field);

    // Si el campo contiene comas, comillas o saltos de línea, lo envolvemos en comillas
    if (
      stringField.includes(",") ||
      stringField.includes('"') ||
      stringField.includes("\n")
    ) {
      // Escapamos las comillas dobles duplicándolas
      return `"${stringField.replace(/"/g, '""')}"`;
    }

    return stringField;
  }

  /**
   * Formatea una fecha según el formato especificado
   */
  private static formatDate(
    date: string | Date,
    options: Intl.DateTimeFormatOptions = this.DEFAULT_DATE_FORMAT
  ): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("es-AR", options);
  }

  /**
   * Genera el contenido CSV completo
   */
  static getCSV(
    transactions: Transaction[],
    options: CSVGeneratorOptions = {}
  ): string {
    const headers = [
      "ID",
      "Monto",
      "Tarjeta",
      "Cuotas",
      "Método de Pago",
      "Fecha de Creación",
      "Última Actualización",
    ];

    const rows = transactions.map((transaction) => [
      this.escapeCSVField(transaction.id),
      this.escapeCSVField(transaction.amount),
      this.escapeCSVField(transaction.card),
      this.escapeCSVField(transaction.installments),
      this.escapeCSVField(transaction.paymentMethod),
      this.escapeCSVField(
        this.formatDate(transaction.createdAt, options.dateFormat)
      ),
      this.escapeCSVField(
        this.formatDate(transaction.updatedAt, options.dateFormat)
      ),
    ]);

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  }

  /**
   * Genera los headers HTTP para la descarga del CSV
   */
  static getHeaders(filename?: string, customFilename?: string): Headers {
    const finalFilename = customFilename || filename || this.DEFAULT_FILENAME;
    const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const headers = new Headers();
    headers.set("Content-Type", "text/csv; charset=utf-8");
    headers.set(
      "Content-Disposition",
      `attachment; filename="${finalFilename}_${timestamp}.csv"`
    );
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    return headers;
  }
}
