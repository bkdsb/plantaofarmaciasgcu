import { PromotionWeekForm } from "@/components/admin/promotion-week-form";
import { SectionHeader } from "@/components/admin/section-header";

export default function AdminPromotionsPage() {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Promoções"
        description="Cadastro centralizado pelo superadmin com limite de 10 produtos por farmácia/semana"
      />
      <PromotionWeekForm />
    </div>
  );
}
