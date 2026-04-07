import { SectionHeader } from "@/components/admin/section-header";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Notificações"
        description="Inscrições push, preferências, favoritas, agendamentos e histórico de entregas"
      />
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          Regras de envio: semanal geral, início da favorita e aviso antecipado com prevenção de duplicidade por
          `event_key` + usuário.
        </CardContent>
      </Card>
    </div>
  );
}
