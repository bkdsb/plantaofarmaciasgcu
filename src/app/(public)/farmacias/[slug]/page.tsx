import { notFound } from "next/navigation";

import { FavoriteButton } from "@/components/public/favorite-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCurrentDuty } from "@/lib/mock-data";

export default async function PharmacyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug !== mockCurrentDuty.pharmacy.slug) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mockCurrentDuty.pharmacy.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{mockCurrentDuty.pharmacy.address}</p>
        <p className="text-sm text-muted-foreground">{mockCurrentDuty.pharmacy.phone}</p>
        <FavoriteButton pharmacyId={mockCurrentDuty.pharmacy.id} isFavorite={false} />
      </CardContent>
    </Card>
  );
}
