import { DutyHighlight } from "@/components/public/duty-highlight";
import { dutyPeriodLabel, mockCurrentDuty } from "@/lib/mock-data";

export default function DutyPage() {
  return (
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
    />
  );
}
