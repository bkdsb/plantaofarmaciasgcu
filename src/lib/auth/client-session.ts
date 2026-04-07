"use client";

import { createClient } from "@/lib/supabase/client";

export async function ensureClientSession() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    return user;
  }

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error || !data.user) {
    throw new Error(error?.message ?? "Não foi possível iniciar sessão anônima");
  }

  return data.user;
}
