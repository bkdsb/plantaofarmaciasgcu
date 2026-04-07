import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { buildNotificationContent } from "@/lib/notifications/templates";
import type { NotificationType } from "@/types/domain";

type ScheduleNotificationInput = {
  type: NotificationType;
  dutyScheduleId: number;
  pharmacyId: number;
  pharmacyName: string;
  startsAt: string;
  endsAt: string;
  scheduledFor: string;
  eventKey: string;
};

export async function scheduleNotification(input: ScheduleNotificationInput) {
  const admin = createAdminSupabaseClient();
  const content = buildNotificationContent(input.type, {
    pharmacyName: input.pharmacyName,
    startsAt: input.startsAt,
    endsAt: input.endsAt
  });

  const { error } = await admin.from("notifications").insert({
    type: input.type,
    channel: "web_push",
    duty_schedule_id: input.dutyScheduleId,
    pharmacy_id: input.pharmacyId,
    title: content.title,
    body: content.body,
    scheduled_for: input.scheduledFor,
    event_key: input.eventKey,
    status: "scheduled"
  });

  if (error) {
    throw new Error(`Failed to schedule notification: ${error.message}`);
  }
}

export async function dispatchDueNotifications(limit = 200) {
  const admin = createAdminSupabaseClient();

  const { data: notifications, error: notificationError } = await admin
    .from("notifications")
    .select("id, title, body, event_key")
    .eq("status", "scheduled")
    .lte("scheduled_for", new Date().toISOString())
    .limit(limit);

  if (notificationError) {
    throw new Error(`Failed to fetch due notifications: ${notificationError.message}`);
  }

  for (const notification of notifications ?? []) {
    await admin.from("notifications").update({ status: "processing" }).eq("id", notification.id);

    // Placeholder para integração web-push (VAPID + envio real por endpoint).
    // Nesta base, mantemos histórico e idempotência no banco.

    await admin.from("notifications").update({ status: "sent" }).eq("id", notification.id);
  }

  return {
    dispatched: notifications?.length ?? 0
  };
}
