import { z } from "zod";

import { MAX_PROMOTION_PRODUCTS_PER_WEEK } from "@/lib/constants";

export const promotionProductSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(2).max(120),
  shortDescription: z.string().max(160).optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  normalPrice: z.coerce.number().positive(),
  promotionalPrice: z.coerce.number().positive(),
  isHighlighted: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(1),
  status: z.enum(["active", "inactive"]).default("active")
});

export const promotionWeekSchema = z
  .object({
    pharmacyId: z.coerce.number().int().positive(),
    dutyScheduleId: z.coerce.number().int().positive().nullable().optional(),
    weekStart: z.string().date(),
    weekEnd: z.string().date(),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    products: z.array(promotionProductSchema).max(MAX_PROMOTION_PRODUCTS_PER_WEEK)
  })
  .refine((value) => new Date(value.weekEnd).getTime() >= new Date(value.weekStart).getTime(), {
    message: "A semana final precisa ser maior ou igual à inicial",
    path: ["weekEnd"]
  })
  .refine(
    (value) =>
      value.products.every((product) => product.promotionalPrice <= product.normalPrice),
    {
      message: "Preço promocional deve ser menor ou igual ao preço normal",
      path: ["products"]
    }
  );

export type PromotionWeekInput = z.infer<typeof promotionWeekSchema>;
