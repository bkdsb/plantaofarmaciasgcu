export const APP_NAME = "Plantão Farmácias GCU";

export const USER_ROLES = ["superadmin", "pharmacy", "public"] as const;
export const SCHEDULE_MODES = ["manual", "automatic"] as const;
export const DUTY_STATUS = ["draft", "published", "closed"] as const;
export const PROMOTION_STATUS = ["draft", "published", "archived"] as const;
export const BANNER_TYPES = ["partner", "ad", "institutional"] as const;
export const BANNER_POSITIONS = ["home_top_secondary", "home_between_duty_promotions", "home_footer_partners"] as const;

export const NOTIFICATION_TYPES = [
  "weekly_general",
  "favorite_start",
  "favorite_reminder",
  "manual_admin"
] as const;

export const NOTIFICATION_CHANNELS = ["web_push"] as const;

export const MAX_PROMOTION_PRODUCTS_PER_WEEK = 10;
export const DEFAULT_REMINDER_DAYS_BEFORE = 1;
