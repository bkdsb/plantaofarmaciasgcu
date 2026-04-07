import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/domain";

export async function requireAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(acceptedRoles: UserRole[]) {
  const user = await requireAuthenticatedUser();
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: UserRole }>();

  if (!profile || !acceptedRoles.includes(profile.role)) {
    redirect("/");
  }

  return { user, role: profile.role };
}

export async function requireSuperadmin() {
  return requireRole(["superadmin"]);
}
