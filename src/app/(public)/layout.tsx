import { PublicHeader } from "@/components/public/public-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="container py-4">{children}</main>
      <footer className="mt-10 border-t border-border/70 bg-card">
        <div className="container py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Plantão Farmácias GCU. Informações de utilidade pública.
        </div>
      </footer>
    </div>
  );
}
