import { DutyGeneratorForm } from "@/components/admin/duty-generator-form";
import { SectionHeader } from "@/components/admin/section-header";

export default function AdminDutiesPage() {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Plantões"
        description="Gestão manual e automática do calendário semanal sem sobreposição"
      />
      <DutyGeneratorForm />
    </div>
  );
}
