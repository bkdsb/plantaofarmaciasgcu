"use server";

import { revalidatePath } from "next/cache";

import { requireSuperadmin } from "@/lib/auth/guards";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { pharmacySchema } from "@/lib/validators/pharmacy";

function normalizeOptional(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function createPharmacyAction(payload: unknown) {
  await requireSuperadmin();
  const parsed = pharmacySchema.parse(payload);
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("pharmacies").insert({
    name: parsed.name.trim(),
    slug: parsed.slug.trim(),
    phone: normalizeOptional(parsed.phone),
    whatsapp: normalizeOptional(parsed.whatsapp),
    address: parsed.address.trim(),
    neighborhood: normalizeOptional(parsed.neighborhood),
    city: parsed.city.trim(),
    logo_url: normalizeOptional(parsed.logoUrl),
    color_hex: normalizeOptional(parsed.colorHex),
    map_url: normalizeOptional(parsed.mapUrl),
    rotation_order: parsed.rotationOrder,
    status: parsed.status
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("Slug já existe. Escolha outro identificador.");
    }

    throw new Error(error.message ?? "Não foi possível cadastrar a farmácia.");
  }

  revalidatePath("/admin/farmacias");
  revalidatePath("/admin/plantoes");
}
