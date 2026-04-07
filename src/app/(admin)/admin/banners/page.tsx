import { SectionHeader } from "@/components/admin/section-header";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminBannersPage() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Banners e Parceiros" description="Gestão de anúncios discretos por posição e prioridade" />
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          Posições: topo secundário da home, entre plantão e promoções, rodapé de parceiros.
        </CardContent>
      </Card>
    </div>
  );
}
