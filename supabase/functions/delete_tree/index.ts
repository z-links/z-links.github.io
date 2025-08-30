// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createServerClient } from "../_shared/createServerClient.ts";
import { PostgrestError } from "jsr:@supabase/supabase-js";
import { serveWithCORS } from "../_shared/serveWithCors.ts";


type reqPayload = {
  url: string
}


console.info("server started");

serveWithCORS(async (req) => {
  try {
    const { url }: reqPayload = await req.json();

    // 1) Get JWT from cookie (decode in case it's URL-encoded)
    
    const supabase = createServerClient(req);

    // 2) Find the root node by link URL
    const { data: linkRow, error: e1 } = await supabase.from("z_link").select("root_node").eq("url", url).single();
    if (e1) {
      return new Response(JSON.stringify({
        error: e1.message
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    if (!linkRow) {
      return new Response(JSON.stringify({
        error: "Link not found"
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const rootId = linkRow.root_node;
    // 3) Delete the root node in z_node (CASCADE removes the whole subtree)
    const { error: e2 } = await supabase.from("z_node").delete().eq("id", rootId);
    if (e2) {
      return new Response(JSON.stringify({
        error: e2.message
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      message: `Deleted tree at ${url}`
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: (err as PostgrestError)?.message ?? "Error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});
