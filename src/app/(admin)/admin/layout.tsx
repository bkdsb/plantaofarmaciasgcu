import { AdminShell } from "@/components/admin/admin-shell";
import { requireSuperadmin } from "@/lib/auth/guards";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireSuperadmin();
  return <AdminShell>{children}</AdminShell>;
}
