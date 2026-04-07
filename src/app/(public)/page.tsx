import { BannerSlot } from "@/components/public/banner-slot";
import { DutyHighlight } from "@/components/public/duty-highlight";
import { FavoriteButton } from "@/components/public/favorite-button";
import { PromotionGrid } from "@/components/public/promotion-grid";
import { PushOptinCard } from "@/components/public/push-optin-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dutyPeriodLabel, mockActiveBanners, mockCurrentDuty } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <DutyHighlight
        pharmacy={{
          name: mockCurrentDuty.pharmacy.name,
          slug: mockCurrentDuty.pharmacy.slug,
          address: mockCurrentDuty.pharmacy.address,
          phone: mockCurrentDuty.pharmacy.phone,
          whatsapp: mockCurrentDuty.pharmacy.whatsapp,
          mapUrl: mockCurrentDuty.pharmacy.map_url
        }}
        periodLabel={dutyPeriodLabel(mockCurrentDuty.starts_at, mockCurrentDuty.ends_at)}
      >
        <FavoriteButton pharmacyId={mockCurrentDuty.pharmacy.id} isFavorite={false} />
        <PushOptinCard compact />
      </DutyHighlight>

      {mockActiveBanners.length > 0 ? (
        <div className="space-y-2">
          {mockActiveBanners.map((banner) => (
            <BannerSlot key={banner.id} title={banner.title} imageUrl={banner.imageUrl} linkUrl={banner.linkUrl} />
          ))}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Promoções da semana</CardTitle>
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

    </div>
  );
}
