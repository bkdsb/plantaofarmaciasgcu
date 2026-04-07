"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  favoritePharmacySchema,
  notificationPreferenceSchema,
  type NotificationPreferenceInput
} from "@/lib/validators/preferences";

export async function toggleFavoritePharmacyAction(pharmacyId: number, shouldFavorite: boolean) {
  const parsed = favoritePharmacySchema.parse({ pharmacyId });
  const user = await requireAuthenticatedUser();
  const supabase = await createServerSupabaseClient();

  if (shouldFavorite) {
    await supabase.from("user_favorite_pharmacies").upsert(
      {
        user_id: user.id,
        pharmacy_id: parsed.pharmacyId,
        is_primary: false
      },
      { onConflict: "user_id,pharmacy_id", ignoreDuplicates: false }
    );
  } else {
    await supabase
      .from("user_favorite_pharmacies")
      .delete()
      .eq("user_id", user.id)
      .eq("pharmacy_id", parsed.pharmacyId);
  }

  revalidatePath("/");
  revalidatePath("/preferencias");
}

export async function saveNotificationPreferencesAction(input: NotificationPreferenceInput) {
  const user = await requireAuthenticatedUser();
  const payload = notificationPreferenceSchema.parse(input);
  const supabase = await createServerSupabaseClient();

  await supabase.from("user_notification_preferences").upsert(
    {
      user_id: user.id,
      receive_general_weekly: payload.receiveGeneralWeekly,
      receive_favorites: payload.receiveFavorites,
      receive_favorite_reminder: payload.receiveFavoriteReminder,
      reminder_days_before: payload.reminderDaysBefore,
      is_opted_in_push: payload.isOptedInPush
    },
    { onConflict: "user_id" }
  );

  revalidatePath("/preferencias");
}

export async function enablePushNotificationsAction() {
  const user = await requireAuthenticatedUser();
  const supabase = await createServerSupabaseClient();

  await supabase
    .from("user_notification_preferences")
    .upsert(
      {
        user_id: user.id,
        is_opted_in_push: true
      },
      { onConflict: "user_id" }
    )
    .select();

  revalidatePath("/preferencias");
}
