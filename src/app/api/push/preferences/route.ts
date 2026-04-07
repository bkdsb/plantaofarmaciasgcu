import { NextResponse } from "next/server";
import { z } from "zod";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const partialNotificationPreferenceSchema = z.object({
  receiveGeneralWeekly: z.boolean().optional(),
  receiveFavorites: z.boolean().optional(),
  receiveFavoriteReminder: z.boolean().optional(),
  reminderDaysBefore: z.number().int().min(0).max(7).optional(),
  isOptedInPush: z.boolean().optional()
});

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = partialNotificationPreferenceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const { data: existingPreference } = await supabase
    .from("user_notification_preferences")
    .select(
      "receive_general_weekly, receive_favorites, receive_favorite_reminder, reminder_days_before, is_opted_in_push"
    )
    .eq("user_id", user.id)
    .maybeSingle<{
      receive_general_weekly: boolean;
      receive_favorites: boolean;
      receive_favorite_reminder: boolean;
      reminder_days_before: number;
      is_opted_in_push: boolean;
    }>();

  const { error } = await supabase.from("user_notification_preferences").upsert(
    {
      user_id: user.id,
      receive_general_weekly: parsed.data.receiveGeneralWeekly ?? existingPreference?.receive_general_weekly ?? true,
      receive_favorites: parsed.data.receiveFavorites ?? existingPreference?.receive_favorites ?? true,
      receive_favorite_reminder:
        parsed.data.receiveFavoriteReminder ?? existingPreference?.receive_favorite_reminder ?? true,
      reminder_days_before: parsed.data.reminderDaysBefore ?? existingPreference?.reminder_days_before ?? 1,
      is_opted_in_push: parsed.data.isOptedInPush ?? existingPreference?.is_opted_in_push ?? false
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
