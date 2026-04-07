import { Button } from "@/components/ui/button";

type SectionHeaderProps = {
  title: string;
  description?: string;
  actionLabel?: string;
};

export function SectionHeader({ title, description, actionLabel }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actionLabel ? <Button size="sm">{actionLabel}</Button> : null}
    </div>
  );
}
