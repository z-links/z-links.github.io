import { createClient } from "npm:@supabase/supabase-js@2";

function createServerClient(req: Request) {
  let jwt = req.headers.get("Authorization")?.replace("Bearer ", "") || null;

  if (!jwt) {
    // Try to extract from cookies (check common Supabase cookie patterns)
    const cookies = req.headers.get("cookie") ?? "";

    // Try different cookie patterns
    const accessTokenMatch = cookies.match(/sb-access-token=([^;]+)/) ||
      cookies.match(/supabase\.auth\.token=([^;]+)/) ||
      cookies.match(/sb-[^=]+-auth-token=([^;]+)/);
    jwt = accessTokenMatch ? decodeURIComponent(accessTokenMatch[1]) : null;
  }


  if (jwt) {
    // Create client bound to the JWT
    const client = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || "", {
      global: {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    });

    return client;
  }

  return createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_ANON_KEY") || ""
  );

}
export { createServerClient };