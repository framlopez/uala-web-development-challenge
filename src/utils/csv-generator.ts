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

  private static readonly DEFAULT_FILENAME = "transactions";

  /**
   * Escapes a CSV field according to standard rules
   */
  private static escapeCSVField(field: unknown): string {
    if (field === null || field === undefined) return "";

    const stringField = String(field);

    // If the field contains commas, quotes or line breaks, we wrap it in quotes
    if (
      stringField.includes(",") ||
      stringField.includes('"') ||
      stringField.includes("\n")
    ) {
      // Escape double quotes by duplicating them
      return `"${stringField.replace(/"/g, '""')}"`;
    }

    return stringField;
  }

  /**
   * Formats a date according to the specified format
   */
  private static formatDate(
    date: string | Date,
    options: Intl.DateTimeFormatOptions = this.DEFAULT_DATE_FORMAT
  ): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("es-AR", options);
  }

  /**
   * Generates the complete CSV content
   */
  static getCSV(
    transactions: Transaction[],
    options: CSVGeneratorOptions = {}
  ): string {
    const headers = [
      "ID",
      "Amount",
      "Card",
      "Installments",
      "Payment Method",
      "Created At",
      "Updated At",
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
   * Generates HTTP headers for CSV download
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
