import Link from "next/link";

import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-base font-bold tracking-tight">
          {APP_NAME}
        </Link>

        <nav className="hidden gap-4 text-sm text-muted-foreground md:flex">
          <Link href="/plantao">Plantão</Link>
          <Link href="/promocoes">Promoções</Link>
          <Link href="/plantao/historico">Histórico</Link>
          <Link href="/institucional">Institucional</Link>
        </nav>

        <Button variant="outline" size="sm" asChild>
          <Link href="/preferencias">Notificações</Link>
        </Button>
      </div>
    </header>
  );
}
