import { KpiCard } from "@/components/admin/kpi-card";
import { SectionHeader } from "@/components/admin/section-header";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Dashboard"
        description="Visão geral de plantões, promoções, banners e base de usuários inscritos"
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Plantão atual" value="Farmácia Central Vida" />
        <KpiCard label="Próximo plantão" value="Farmácia Bela Saúde" />
        <KpiCard label="Farmácias" value={12} />
        <KpiCard label="Promoções ativas" value={18} />
        <KpiCard label="Banners ativos" value={3} />
        <KpiCard label="Inscritos push" value={256} />
        <KpiCard label="Favoritos" value={144} />
        <KpiCard label="Agendamentos" value={7} />
      </div>

      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          Atalhos rápidos: criar plantão manual, gerar calendário automático, duplicar promoções da semana anterior,
          publicar notificações pendentes.
        </CardContent>
      </Card>
    </div>
  );
}
