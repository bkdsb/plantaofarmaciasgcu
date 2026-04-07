import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notificationPreferenceSchema } from "@/lib/validators/preferences";

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = notificationPreferenceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const { error } = await supabase.from("user_notification_preferences").upsert(
    {
      user_id: user.id,
      receive_general_weekly: parsed.data.receiveGeneralWeekly,
      receive_favorites: parsed.data.receiveFavorites,
      receive_favorite_reminder: parsed.data.receiveFavoriteReminder,
      reminder_days_before: parsed.data.reminderDaysBefore,
      is_opted_in_push: parsed.data.isOptedInPush
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
