import { z } from "zod";

export const filtersSchema = z.object({
  metodosCobro: z.array(z.enum(["link", "qr", "mpos", "pospro"])).default([]),
  tarjeta: z.array(z.enum(["visa", "mastercard", "amex"])).default([]),
  cuotas: z.array(z.enum(["1", "2", "3", "6", "12"])).default([]),
  fecha: z
    .object({
      desde: z.string().optional(),
      hasta: z.string().optional(),
    })
    .default({}),
  monto: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    })
    .default({}),
});

export type Filters = z.infer<typeof filtersSchema>;

export const defaultFilters: Filters = {
  metodosCobro: [],
  tarjeta: [],
  cuotas: [],
  fecha: {},
  monto: { min: undefined, max: undefined },
};
