import { SectionHeader } from "@/components/admin/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPharmaciesPage() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Farmácias" description="Cadastro, status e ordem do rodízio automático" actionLabel="Nova farmácia" />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campos obrigatórios</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Nome, slug único, telefone, WhatsApp, endereço, bairro, cidade, logo, cor opcional, status e ordem de
          rotação.
        </CardContent>
      </Card>
    </div>
  );
}
