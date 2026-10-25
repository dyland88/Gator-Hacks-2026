import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig } from "~/lib/supabase-config";
import { type Database } from "~/lib/profile";

const config = getSupabaseConfig();

export const supabase = config
  ? createBrowserClient<Database>(config.url, config.key)
  : null;
