// src/lib/supabase.ts
import { createBrowserClient } from "@supabase/ssr"; 

let supabase = createBrowserClient(
  import.meta.env.PUBLIC_SUPABASE_URL,   // from .env
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export default supabase;
