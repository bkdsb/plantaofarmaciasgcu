import Link from "next/link";
import { MapPin, Phone, MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DutyHighlightProps = {
  pharmacy: {
    name: string;
    slug: string;
    address: string;
    phone?: string | null;
    whatsapp?: string | null;
    mapUrl?: string | null;
  };
  periodLabel: string;
  children?: React.ReactNode;
};

export function DutyHighlight({ pharmacy, periodLabel, children }: DutyHighlightProps) {
  const whatsappUrl = pharmacy.whatsapp
    ? `https://wa.me/${pharmacy.whatsapp.replace(/\D/g, "")}`
    : undefined;

  return (
    <Card className="overflow-hidden border-primary/25 bg-gradient-to-b from-secondary/70 to-card">
      <CardHeader>
        <Badge variant="success" className="w-fit">Plantão da semana</Badge>
        <CardTitle className="mt-2 text-2xl leading-tight">{pharmacy.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{periodLabel}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 rounded-lg bg-background/80 p-3">
          <p className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{pharmacy.address}</span>
          </p>
          {pharmacy.phone ? (
            <p className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <a href={`tel:${pharmacy.phone}`} className="underline-offset-2 hover:underline">
                {pharmacy.phone}
              </a>
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {whatsappUrl ? (
            <Button className="w-full" asChild>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          ) : null}
          <Button variant="secondary" className="w-full" asChild>
            <Link href={`/farmacias/${pharmacy.slug}`}>Ver farmácia</Link>
          </Button>
          {pharmacy.mapUrl ? (
            <Button variant="outline" className="w-full" asChild>
              <a href={pharmacy.mapUrl} target="_blank" rel="noreferrer">
                Abrir mapa
              </a>
            </Button>
          ) : null}
        </div>

        {children ? <div className="grid grid-cols-1 gap-2 border-t border-border/70 pt-3 sm:grid-cols-2">{children}</div> : null}
      </CardContent>
    </Card>
  );
}
