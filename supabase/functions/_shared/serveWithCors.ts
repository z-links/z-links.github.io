// supabase/functions/_shared/serveWithCors.ts
// import { serve as denoServe } from "https://deno.land/std/http/server.ts";

// CORS headers
const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export function serveWithCORS(
  handler: (req: Request) => Promise<Response> | Response
) {
  return Deno.serve(async (req: Request) => {
    // Handle preflight OPTIONS requests
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    // Handle the actual request
    const res = await handler(req);

    // Merge headers
    const newHeaders = new Headers(res.headers);
    for (const [k, v] of Object.entries(corsHeaders)) {
      newHeaders.set(k, v);
    }

    return new Response(await res.text(), {
      status: res.status,
      headers: newHeaders,
    });
  });
}
