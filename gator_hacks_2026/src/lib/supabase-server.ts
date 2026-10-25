import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { type Database } from "~/lib/profile";
import { getSupabaseConfig } from "~/lib/supabase-config";

export async function createServerSupabaseClient() {
  const config = getSupabaseConfig();
  if (!config) return null;
  const cookieStore = await cookies();

  return createServerClient<Database>(config.url, config.key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            return;
          }
        }
      },
    },
  });
}
