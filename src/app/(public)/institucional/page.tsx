import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InstitutionalPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sobre o projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          Plataforma pública para consulta de farmácia de plantão e promoções semanais, com gestão centralizada no
          painel administrativo.
        </p>
        <p>
          Estrutura preparada para crescimento municipal, integração de parceiros e modelo SaaS multi-tenant em
          evolução futura.
        </p>
      </CardContent>
    </Card>
  );
}
