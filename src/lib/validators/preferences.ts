import { z } from "zod";

export const favoritePharmacySchema = z.object({
  pharmacyId: z.coerce.number().int().positive(),
  isPrimary: z.boolean().default(false)
});

export const notificationPreferenceSchema = z.object({
  receiveGeneralWeekly: z.boolean().default(true),
  receiveFavorites: z.boolean().default(true),
  receiveFavoriteReminder: z.boolean().default(true),
  reminderDaysBefore: z.coerce.number().int().min(0).max(7).default(1),
  isOptedInPush: z.boolean().default(false)
});

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1)
  })
});

export type FavoritePharmacyInput = z.infer<typeof favoritePharmacySchema>;
export type NotificationPreferenceInput = z.infer<typeof notificationPreferenceSchema>;
export type PushSubscriptionInput = z.infer<typeof pushSubscriptionSchema>;
