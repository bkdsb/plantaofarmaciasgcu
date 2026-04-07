import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  type CookieSetOptions = Parameters<typeof cookieStore.set>[2];

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieSetOptions }>) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        }
      }
    }
  );
}
