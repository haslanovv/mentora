import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) return new Response("Unauthorized", { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return Response.json({ error: "Server configuration is incomplete." }, { status: 500 });
  const admin = createClient(url, serviceKey);
  const { error, count } = await admin.from("listings").update({ is_active: false }, { count: "exact" }).eq("is_active", true).lt("expires_at", new Date().toISOString());
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ deactivated: count || 0 });
}
