import { PharmacyForm } from "@/components/admin/pharmacy-form";
import { SectionHeader } from "@/components/admin/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type PharmacyRow = {
  id: number;
  name: string;
  slug: string;
  city: string;
  status: "active" | "inactive";
  rotation_order: number;
};

export default async function AdminPharmaciesPage() {
  const supabase = await createServerSupabaseClient();

  const { data: pharmacies } = await supabase
    .from("pharmacies")
    .select("id, name, slug, city, status, rotation_order")
    .order("rotation_order", { ascending: true });

  const pharmacyRows = (pharmacies ?? []) as PharmacyRow[];
  const nextRotationOrder =
    pharmacyRows.length > 0 ? Math.max(...pharmacyRows.map((item) => item.rotation_order)) + 1 : 1;

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Farmácias"
        description="Cadastro, status e ordem do rodízio automático."
        actionLabel="Nova farmácia"
        actionHref="#nova-farmacia"
      />
      <PharmacyForm defaultRotationOrder={nextRotationOrder} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Farmácias cadastradas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pharmacyRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma farmácia cadastrada ainda.</p>
          ) : (
            pharmacyRows.map((pharmacy) => (
              <div key={pharmacy.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/80 p-3">
                <div>
                  <p className="font-semibold">{pharmacy.name}</p>
                  <p className="text-sm text-muted-foreground">
                    /{pharmacy.slug} · {pharmacy.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ordem #{pharmacy.rotation_order}
                  </p>
                  <Badge variant={pharmacy.status === "active" ? "success" : "outline"}>
                    {pharmacy.status === "active" ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
