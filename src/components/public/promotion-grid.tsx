import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type PromotionItem = {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  normalPrice: number;
  promotionalPrice: number;
  highlighted?: boolean;
};

type PromotionGridProps = {
  items: PromotionItem[];
};

export function PromotionGrid({ items }: PromotionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {items.slice(0, 10).map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="flex gap-3 p-3">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                sem imagem
              </div>
            )}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold leading-tight">{item.name}</h3>
                {item.highlighted ? <Badge variant="warning">Destaque</Badge> : null}
              </div>
              {item.description ? <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p> : null}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground line-through">R$ {item.normalPrice.toFixed(2)}</span>
                <span className="font-bold text-primary">R$ {item.promotionalPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
