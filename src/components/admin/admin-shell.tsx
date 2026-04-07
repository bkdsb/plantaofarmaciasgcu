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
        <div className="container flex h-14 items-center gap-3 overflow-x-auto text-sm">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-md px-2 py-1 hover:bg-muted">
              {item.label}
            </Link>
          ))}
        </div>
      </header>
      <main className="container py-4">{children}</main>
    </div>
  );
}
