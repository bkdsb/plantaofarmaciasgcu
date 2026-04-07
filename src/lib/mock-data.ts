import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import type { CurrentDutyView } from "@/types/domain";

const now = new Date();

export const mockCurrentDuty: CurrentDutyView = {
  duty_id: 1,
  starts_at: now.toISOString(),
  ends_at: addDays(now, 6).toISOString(),
  week_start: format(now, "yyyy-MM-dd"),
  week_end: format(addDays(now, 6), "yyyy-MM-dd"),
  pharmacy: {
    id: 1,
    name: "Farmácia Central Vida",
    slug: "farmacia-central-vida",
    address: "Av. Principal, 1200 - Centro",
    city: "Guaraciaba",
    phone: "(49) 3321-1000",
    whatsapp: "5549999999999",
    map_url: "https://maps.google.com"
  },
  promotions: [
    {
      id: 1,
      promotion_week_id: 1,
      name: "Dipirona 1g",
      short_description: "Caixa com 10 comprimidos",
      image_url: null,
      normal_price: 19.9,
      promotional_price: 12.9,
      is_highlighted: true,
      display_order: 1,
      status: "active",
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    },
    {
      id: 2,
      promotion_week_id: 1,
      name: "Vitamina C",
      short_description: "Efervescente 1g",
      image_url: null,
      normal_price: 29.9,
      promotional_price: 21.9,
      is_highlighted: false,
      display_order: 2,
      status: "active",
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    }
  ]
};

export const mockHistory = Array.from({ length: 8 }).map((_, index) => ({
  id: index + 1,
  pharmacyName: `Farmácia ${index + 1}`,
  startsAt: addDays(now, (index - 3) * 7),
  endsAt: addDays(now, (index - 3) * 7 + 6)
}));

export const mockActiveBanners: Array<{
  id: number;
  title: string;
  imageUrl?: string;
  linkUrl?: string;
}> = [];

export function dutyPeriodLabel(startsAt: string, endsAt: string) {
  return `${format(new Date(startsAt), "dd MMM", { locale: ptBR })} a ${format(new Date(endsAt), "dd MMM yyyy", { locale: ptBR })}`;
}
