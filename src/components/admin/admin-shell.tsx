import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/farmacias", label: "Farmácias" },
  { href: "/admin/plantoes", label: "Plantões" },
  { href: "/admin/promocoes", label: "Promoções" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/notificacoes", label: "Notificações" },
  { href: "/admin/configuracoes", label: "Configurações" }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container flex min-h-14 flex-wrap items-center gap-2 py-2 text-sm">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md border border-transparent px-3 py-1.5 hover:border-border hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>
      <main className="container py-4">{children}</main>
    </div>
  );
}
