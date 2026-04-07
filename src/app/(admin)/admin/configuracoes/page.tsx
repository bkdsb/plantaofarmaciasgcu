import { SectionHeader } from "@/components/admin/section-header";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Configurações" description="Parâmetros globais do sistema e integrações futuras" />
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          Exemplos: dias de antecedência padrão, ativação de modo automático, parâmetros de notificação, branding
          municipal e opções SaaS multi-tenant.
        </CardContent>
      </Card>
    </div>
  );
}
