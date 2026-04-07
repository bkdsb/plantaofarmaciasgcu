import { z } from "zod";

export const pharmacySchema = z.object({
  name: z.string().min(3).max(120),
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen"),
  phone: z.string().max(20).optional().or(z.literal("")),
  whatsapp: z.string().max(20).optional().or(z.literal("")),
  address: z.string().min(6).max(255),
  neighborhood: z.string().max(120).optional().or(z.literal("")),
  city: z.string().min(2).max(120),
  logoUrl: z.string().url().optional().or(z.literal("")),
  colorHex: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida")
    .optional()
    .or(z.literal("")),
  mapUrl: z.string().url().optional().or(z.literal("")),
  rotationOrder: z.coerce.number().int().min(1),
  status: z.enum(["active", "inactive"])
});

export type PharmacyInput = z.infer<typeof pharmacySchema>;
