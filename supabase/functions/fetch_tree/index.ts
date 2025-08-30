// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createServerClient } from "../_shared/createServerClient.ts";
import { serveWithCORS } from "../_shared/serveWithCors.ts";

type reqPayload = {
  url: string
}

console.info("server started");


serveWithCORS(async (req) => {
  const { url }: reqPayload = await req.json();

  const supabase = createServerClient(req);

  // 1. Get root_node from z_link 
  const { data: response, error } = await supabase
    .from("z_link")
    .select("root_node, title")
    .eq("url", url)
    .single();


  if (error || !response) {
    return new Response(JSON.stringify({
      error: error.message || "Not found"
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  // 2. Call recursive SQL function
  const { data: result, error: fullTreeError } = await supabase
    .rpc("get_tree", {
      root_id: response.root_node
    });

  

  if (fullTreeError) {
    return new Response(JSON.stringify({
      error: fullTreeError.message
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  result[0].text = response.title;

  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
      "Connection": "keep-alive"
    }
  });
});
