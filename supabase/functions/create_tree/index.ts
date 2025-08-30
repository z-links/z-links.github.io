// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { nanoid } from "npm:nanoid";
import { serveWithCORS } from "../_shared/serveWithCors.ts";
import { createServerClient } from "../_shared/createServerClient.ts";
import { SupabaseClient } from "jsr:@supabase/supabase-js";

type reqPayload = {
  id: number,
  parent: number,
  type: "folder" | "link",
  url?: string,
  text: string
}[];

// const MAX_DEPTH = 8000;
// Service role client (needed for inserts without relying on RLS)
console.info("server started");

let supabase: SupabaseClient;

serveWithCORS(async (req: Request) => {
  const data: reqPayload = await req.json();

  supabase = createServerClient(req) as unknown as SupabaseClient;

  let userId = null;

  console.log("req", data);

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!error && user) {
      userId = user.id;
    }
  } catch (err) {
    console.error("Error getting user:", err);
  }

 
  // Insert root node
  const { data: response, error: insertError } = await supabase.from("z_node").insert([
    {
      type: "folder",
      text: `Root Node & User: ${userId ?? "NULL"}`,
      user: userId
    }
  ]).select("id").single();

  const newURL = nanoid(8);

  const { error: zLinkError } = await supabase.from("z_link").insert([
    {
      user: userId,
      root_node: response?.id,
      url: newURL
    }
  ]);


  if (insertError || zLinkError) {
    return new Response(JSON.stringify({
      error: insertError?.message || zLinkError?.message
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  
  // Build tree recursively
  await createTree(data, 0, response.id, userId);

  return new Response(JSON.stringify({
    response: "ok! created",
    url: newURL
  }), {
    headers: {
      "Content-Type": "application/json",
      Connection: "keep-alive"
    }
  });
});


async function createTree(data: reqPayload, parentNum = 0, parentID: number, userId: string | null) {
  for (const node of data) {
    if (node.parent == parentNum) {
      const { data: response, error } = await supabase.from("z_node").insert([
        {
          parent: parentID,
          type: node["type"],
          text: node.text,
          url: node["type"] === "link" ? node.url : null,
          user: userId
        }
      ]).select("id").single();
      if (error) throw error;
      if (node["type"] === "folder") {
        await createTree(data, node.id, response.id, userId);
      }
    }
  }
}
