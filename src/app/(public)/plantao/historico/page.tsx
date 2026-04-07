import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockHistory } from "@/lib/mock-data";

export default function DutyHistoryPage() {
  return (
    <div className="space-y-3">
      {mockHistory.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold">{item.pharmacyName}</p>
              <p className="text-sm text-muted-foreground">
                {format(item.startsAt, "dd/MM/yyyy", { locale: ptBR })} até {format(item.endsAt, "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
            <Badge variant={item.startsAt > new Date() ? "outline" : "default"}>
              {item.startsAt > new Date() ? "Próximo" : "Histórico"}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
