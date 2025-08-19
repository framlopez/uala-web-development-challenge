import { z } from "zod";

export const filtersSchema = z.object({
  metodosCobro: z.array(z.enum(["link", "qr", "mpos", "pospro"])),
  tarjeta: z.array(z.enum(["visa", "mastercard", "amex"])),
  cuotas: z.array(z.enum(["1", "2", "3", "6", "12"])),
  fecha: z.object({
    desde: z.string().optional(),
    hasta: z.string().optional(),
  }),
  monto: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }),
});

export interface Filters {
  metodosCobro: ("link" | "qr" | "mpos" | "pospro")[];
  tarjeta: ("visa" | "mastercard" | "amex")[];
  cuotas: ("1" | "2" | "3" | "6" | "12")[];
  fecha: {
    desde?: string;
    hasta?: string;
  };
  monto: {
    min?: number;
    max?: number;
  };
}

export const defaultFilters: Filters = {
  metodosCobro: [],
  tarjeta: [],
  cuotas: [],
  fecha: {},
  monto: { min: undefined, max: undefined },
};
