import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

type BannerSlotProps = {
  title: string;
  imageUrl?: string;
  linkUrl?: string;
};

export function BannerSlot({ title, imageUrl, linkUrl }: BannerSlotProps) {
  const content = (
    <Card className="overflow-hidden border-dashed bg-muted/40">
      <CardContent className="flex min-h-20 items-center justify-between gap-3 p-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Parceiro</p>
          <p className="text-sm font-semibold">{title}</p>
        </div>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title} className="h-10 w-20 rounded-md object-cover" />
        ) : (
          <div className="flex h-10 w-20 items-center justify-center rounded-md border border-border text-[11px] text-muted-foreground">
            banner
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (linkUrl) {
    return <Link href={linkUrl}>{content}</Link>;
  }

  return content;
}
