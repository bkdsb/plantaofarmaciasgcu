import { DutyGeneratorForm } from "@/components/admin/duty-generator-form";
import { SectionHeader } from "@/components/admin/section-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type PharmacyOption = {
  id: number;
  name: string;
  rotation_order: number;
};

export default async function AdminDutiesPage() {
  const supabase = await createServerSupabaseClient();

  const { data: pharmacies } = await supabase
    .from("pharmacies")
    .select("id, name, rotation_order")
    .eq("status", "active")
    .order("rotation_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Plantões"
        description="Cadastre por semana em modo manual ou gere o calendário automático sem sobreposição."
      />
      <DutyGeneratorForm pharmacies={(pharmacies ?? []) as PharmacyOption[]} />
    </div>
  );
}
