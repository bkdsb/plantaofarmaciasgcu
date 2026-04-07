"use server";

import { revalidatePath } from "next/cache";

import { requireSuperadmin } from "@/lib/auth/guards";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { promotionWeekSchema } from "@/lib/validators/promotion";

type PromotionProductCopy = {
  name: string;
  short_description: string | null;
  image_url: string | null;
  normal_price: number;
  promotional_price: number;
  is_highlighted: boolean;
  display_order: number;
  status: "active" | "inactive";
};

export async function upsertPromotionWeekAction(payload: unknown) {
  const { user } = await requireSuperadmin();
  const parsed = promotionWeekSchema.parse(payload);
  const supabase = await createServerSupabaseClient();

  const { data: week, error: weekError } = await supabase
    .from("promotion_weeks")
    .upsert(
      {
        pharmacy_id: parsed.pharmacyId,
        duty_schedule_id: parsed.dutyScheduleId ?? null,
        week_start: parsed.weekStart,
        week_end: parsed.weekEnd,
        status: parsed.status,
        created_by: user.id,
        archived_at: parsed.status === "archived" ? new Date().toISOString() : null
      },
      { onConflict: "pharmacy_id,week_start" }
    )
    .select("id")
    .single<{ id: number }>();

  if (weekError || !week) {
    throw new Error(weekError?.message ?? "Erro ao salvar semana promocional");
  }

  await supabase.from("promotion_products").delete().eq("promotion_week_id", week.id);

  if (parsed.products.length > 0) {
    const payloadProducts = parsed.products.map((product, index) => ({
      promotion_week_id: week.id,
      name: product.name,
      short_description: product.shortDescription || null,
      image_url: product.imageUrl || null,
      normal_price: product.normalPrice,
      promotional_price: product.promotionalPrice,
      is_highlighted: product.isHighlighted,
      display_order: product.displayOrder || index + 1,
      status: product.status
    }));

    const { error: productsError } = await supabase.from("promotion_products").insert(payloadProducts);

    if (productsError) {
      throw new Error(productsError.message);
    }
  }

  revalidatePath("/admin/promocoes");
  revalidatePath("/promocoes");
  revalidatePath("/");
}

export async function duplicatePreviousWeekPromotionAction(params: {
  sourceWeekId: number;
  targetWeekStart: string;
  targetWeekEnd: string;
}) {
  const { user } = await requireSuperadmin();
  const supabase = await createServerSupabaseClient();

  const { data: sourceWeek } = await supabase
    .from("promotion_weeks")
    .select("id, pharmacy_id")
    .eq("id", params.sourceWeekId)
    .single<{ id: number; pharmacy_id: number }>();

  if (!sourceWeek) {
    throw new Error("Semana de origem não encontrada");
  }

  const { data: sourceProducts } = await supabase
    .from("promotion_products")
    .select("name, short_description, image_url, normal_price, promotional_price, is_highlighted, display_order, status")
    .eq("promotion_week_id", params.sourceWeekId)
    .order("display_order", { ascending: true });

  const { data: targetWeek, error: targetWeekError } = await supabase
    .from("promotion_weeks")
    .upsert(
      {
        pharmacy_id: sourceWeek.pharmacy_id,
        week_start: params.targetWeekStart,
        week_end: params.targetWeekEnd,
        status: "draft",
        created_by: user.id
      },
      { onConflict: "pharmacy_id,week_start" }
    )
    .select("id")
    .single<{ id: number }>();

  if (targetWeekError || !targetWeek) {
    throw new Error(targetWeekError?.message ?? "Falha ao criar semana de destino");
  }

  await supabase.from("promotion_products").delete().eq("promotion_week_id", targetWeek.id);

  const sourceProductsTyped = (sourceProducts ?? []) as PromotionProductCopy[];

  if (sourceProductsTyped.length) {
    await supabase.from("promotion_products").insert(
      sourceProductsTyped.map((item) => ({
        ...item,
        promotion_week_id: targetWeek.id
      }))
    );
  }

  revalidatePath("/admin/promocoes");
}
