import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import type { NotificationType } from "@/types/domain";

type TemplateInput = {
  pharmacyName: string;
  startsAt: string;
  endsAt: string;
};

export function buildNotificationContent(type: NotificationType, input: TemplateInput) {
  const startsAtDate = new Date(input.startsAt);
  const endsAtDate = new Date(input.endsAt);

  switch (type) {
    case "weekly_general":
      return {
        title: "Plantão da semana",
        body: `Essa semana a farmácia ${input.pharmacyName} estará de plantão até ${format(endsAtDate, "dd/MM", { locale: ptBR })}.`
      };
    case "favorite_start":
      return {
        title: "Sua farmácia favorita entrou em plantão",
        body: `${input.pharmacyName} estará de plantão de ${format(startsAtDate, "dd/MM", { locale: ptBR })} até ${format(endsAtDate, "dd/MM", { locale: ptBR })}.`
      };
    case "favorite_reminder":
      return {
        title: "Lembrete de plantão",
        body: `Amanhã sua farmácia favorita ${input.pharmacyName} entrará de plantão.`
      };
    default:
      return {
        title: "Comunicado",
        body: `Atualização sobre a farmácia ${input.pharmacyName}.`
      };
  }
}
