import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/admin/kpi-card";
import { SectionHeader } from "@/components/admin/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard"
        description="Resumo operacional do plantão e gestão centralizada"
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="h-full">
          <CardHeader className="space-y-2">
            <Badge variant="success" className="w-fit">
              Plantão atual
            </Badge>
            <CardTitle className="text-xl">Farmácia Central Vida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Período: 07/04 até 13/04</p>
            <Button asChild size="sm">
              <Link href="/admin/plantoes">Gerenciar plantões</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="space-y-2">
            <Badge variant="outline" className="w-fit">
              Próximo plantão
            </Badge>
            <CardTitle className="text-xl">Farmácia Bela Saúde</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Início previsto: 14/04</p>
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/plantoes">Ajustar calendário</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Farmácias ativas" value={12} />
        <KpiCard label="Promoções publicadas" value={18} />
        <KpiCard label="Inscritos em push" value={256} />
        <KpiCard label="Favoritas salvas" value={144} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ações rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="outline">
            <Link href="/admin/plantoes">Novo plantão manual</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/promocoes">Publicar promoções</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/notificacoes">Disparos e histórico</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/farmacias">Gerenciar farmácias</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
