// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serveWithCORS } from "../_shared/serveWithCors.ts";
import { createServerClient } from "../_shared/createServerClient.ts";

type reqPayload = ({
  id: number,
  text?: string,
  url?: string,
  action: "create" | "update" | "delete";
})[];


console.info("Edge Function started");
serveWithCORS(async (req: Request) => {
  try {

    // 1. Create Client
    const supabase = createServerClient(req);

    // 2. Parse JSON safely
    let data: reqPayload;

    try {
      data = await req.json();
    } catch {
      return new Response(JSON.stringify({
        error: "Invalid JSON"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    // 3. Validate request payload
    if (!Array.isArray(data) || data.length === 0) {
      return new Response(JSON.stringify({
        error: "Empty payload"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }  

    // 4. Execute operations in parallel
    const results = await Promise.all(data.map(async ({ id, action, ...updatedVal }) => {
      if (!id) return {
        error: "Missing id"
      };
      switch (action) {

        case "create":
          {
            const { error } = await supabase
              .from("z_node")
              .insert({
                ...(updatedVal.text !== null && { text: updatedVal.text }),
                ...(updatedVal.url !== null && { url: updatedVal.url }),
              });

            return error ? {
              id,
              error: error.message
            } : {
              id,
              action
            };
          }

        case "update":
          {
            const { error } = await supabase
              .from("z_node")
              .update(
                {
                  ...(updatedVal.text !== null && { text: updatedVal.text }),
                  ...(updatedVal.url !== null && { url: updatedVal.url }),
                }
              )
              .eq("id", id)
              .select();

            return error ? {
              id,
              error: error.message
            } : {
              id,
              action
            };
          }
        case "delete":
          {
            const { error } = await supabase.from("z_node").delete().eq("id", id);
            return error ? {
              id,
              error: error.message
            } : {
              id,
              action
            };
          }
        default:
          return {
            id,
            error: "Invalid action"
          };
      }
    }));
    // 5. Return structured response
    return new Response(JSON.stringify({
      success: true,
      results
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({
      error: "Internal Server Error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});
