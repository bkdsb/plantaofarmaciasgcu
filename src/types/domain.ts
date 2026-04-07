import type {
  BANNER_POSITIONS,
  BANNER_TYPES,
  DUTY_STATUS,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_TYPES,
  PROMOTION_STATUS,
  SCHEDULE_MODES,
  USER_ROLES
} from "@/lib/constants";

export type UserRole = (typeof USER_ROLES)[number];
export type ScheduleMode = (typeof SCHEDULE_MODES)[number];
export type DutyStatus = (typeof DUTY_STATUS)[number];
export type PromotionStatus = (typeof PROMOTION_STATUS)[number];
export type BannerType = (typeof BANNER_TYPES)[number];
export type BannerPosition = (typeof BANNER_POSITIONS)[number];
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export type StatusFlag = "active" | "inactive";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  city: string | null;
  created_at: string;
  updated_at: string;
}

export interface Pharmacy {
  id: number;
  name: string;
  slug: string;
  phone: string | null;
  whatsapp: string | null;
  address: string;
  neighborhood: string | null;
  city: string;
  logo_url: string | null;
  color_hex: string | null;
  map_url: string | null;
  rotation_order: number;
  status: StatusFlag;
  created_at: string;
  updated_at: string;
}

export interface PharmacyUser {
  id: number;
  pharmacy_id: number;
  user_id: string;
  created_at: string;
}

export interface DutySchedule {
  id: number;
  pharmacy_id: number;
  starts_at: string;
  ends_at: string;
  week_start: string;
  week_end: string;
  mode: ScheduleMode;
  status: DutyStatus;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PromotionWeek {
  id: number;
  pharmacy_id: number;
  duty_schedule_id: number | null;
  week_start: string;
  week_end: string;
  status: PromotionStatus;
  archived_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PromotionProduct {
  id: number;
  promotion_week_id: number;
  name: string;
  short_description: string | null;
  image_url: string | null;
  normal_price: number;
  promotional_price: number;
  is_highlighted: boolean;
  display_order: number;
  status: StatusFlag;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_url: string | null;
  position: BannerPosition;
  starts_at: string;
  ends_at: string;
  priority: number;
  banner_type: BannerType;
  status: StatusFlag;
  created_at: string;
  updated_at: string;
}

export interface PushSubscription {
  id: number;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string | null;
  status: StatusFlag;
  created_at: string;
  updated_at: string;
}

export interface UserNotificationPreference {
  id: number;
  user_id: string;
  receive_general_weekly: boolean;
  receive_favorites: boolean;
  receive_favorite_reminder: boolean;
  reminder_days_before: number;
  is_opted_in_push: boolean;
  updated_at: string;
}

export interface UserFavoritePharmacy {
  id: number;
  user_id: string;
  pharmacy_id: number;
  is_primary: boolean;
  created_at: string;
}

export interface Notification {
  id: number;
  duty_schedule_id: number | null;
  pharmacy_id: number | null;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  scheduled_for: string;
  event_key: string;
  status: "scheduled" | "processing" | "sent" | "failed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface NotificationDelivery {
  id: number;
  notification_id: number;
  user_id: string;
  push_subscription_id: number | null;
  status: "queued" | "sent" | "failed";
  provider_response: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface Setting {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
  updated_by: string | null;
}

export interface CurrentDutyView {
  duty_id: number;
  week_start: string;
  week_end: string;
  starts_at: string;
  ends_at: string;
  pharmacy: Pick<Pharmacy, "id" | "name" | "slug" | "phone" | "whatsapp" | "address" | "map_url" | "city">;
  promotions: PromotionProduct[];
}
