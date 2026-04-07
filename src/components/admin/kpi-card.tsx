import { Card, CardContent } from "@/components/ui/card";

type KpiCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export function KpiCard({ label, value, hint }: KpiCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="flex min-h-28 flex-col justify-between gap-3 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold leading-none tracking-tight">{value}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
