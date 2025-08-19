import { z } from "zod";

export const filtersSchema = z.object({
  paymentMethods: z.array(z.enum(["link", "qr", "mpos", "pospro"])),
  card: z.array(z.enum(["visa", "mastercard", "amex"])),
  installments: z.array(z.enum(["1", "2", "3", "6", "12"])),
  date: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
  }),
  amount: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }),
});

export interface Filters {
  paymentMethods: ("link" | "qr" | "mpos" | "pospro")[];
  card: ("visa" | "mastercard" | "amex")[];
  installments: ("1" | "2" | "3" | "6" | "12")[];
  date: {
    from?: string;
    to?: string;
  };
  amount: {
    min?: number;
    max?: number;
  };
}

export const defaultFilters: Filters = {
  paymentMethods: [],
  card: [],
  installments: [],
  date: {},
  amount: { min: undefined, max: undefined },
};
