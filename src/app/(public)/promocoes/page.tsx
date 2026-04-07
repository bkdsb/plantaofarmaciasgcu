import { PromotionGrid } from "@/components/public/promotion-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCurrentDuty } from "@/lib/mock-data";

export default function PromotionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Promoções desta semana</CardTitle>
      </CardHeader>
      <CardContent>
        <PromotionGrid
          items={mockCurrentDuty.promotions.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.short_description,
            imageUrl: item.image_url,
            normalPrice: item.normal_price,
            promotionalPrice: item.promotional_price,
            highlighted: item.is_highlighted
          }))}
        />
      </CardContent>
    </Card>
  );
}
