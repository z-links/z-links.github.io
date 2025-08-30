// src/lib/supabase.server.ts
import { createServerClient, parseCookieHeader, type CookieOptions } from "@supabase/ssr";

export function getSupabase(Astro: any) {
    return createServerClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return parseCookieHeader(Astro.request.headers.get('Cookie') ?? '')
                        .filter((cookie): cookie is { name: string; value: string } => 
                            cookie.value !== undefined)
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        Astro.cookies.set(name, value, options))
                },
            },
        }
    );
}
