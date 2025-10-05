export interface Env {
  AI: Ai;
  CHAT_SESSIONS: DurableObjectNamespace;
  MODEL: string;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
};

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

    const url = new URL(req.url);
    if (url.pathname === "/api/chat" && req.method === "POST") {
      const { session_id, message } = await req.json<any>().catch(() => ({}));
      if (!session_id || !message) return json({ error: "session_id and message required" }, 400);

      const id = env.CHAT_SESSIONS.idFromName(session_id);
      const stub = env.CHAT_SESSIONS.get(id);
      return await stub.fetch(new Request(new URL("/do/chat", req.url), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, model: env.MODEL }),
      }));
    }

    // Optional: serve a static index if you added /public with an HTML chat UI
    return json({ ok: true, hint: "POST /api/chat {session_id, message}" });
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...CORS },
  });
}

export class ChatSession {
  state: DurableObjectState; env: Env;
  constructor(state: DurableObjectState, env: Env) { this.state = state; this.env = env; }

  // Keep last 20 messages. Send last 6 to the LLM.
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname !== "/do/chat" || req.method !== "POST") return new Response("Not found", { status: 404 });

    const { message, model } = await req.json<any>();
    if (!message) return new Response("bad request", { status: 400 });

    const history: Array<{ role: "user" | "assistant"; content: string }> =
      (await this.state.storage.get("history")) || [];

    const window = history.slice(-6);
    const messages = [
      { role: "system", content: "You are a concise, factual assistant." },
      ...window,
      { role: "user", content: String(message) },
    ];

    const res = await this.env.AI.run(model, { messages });
    const reply =
      typeof (res as any)?.response === "string"
        ? (res as any).response
        : (Array.isArray((res as any)?.messages) ? (res as any).messages.at(-1)?.content : JSON.stringify(res));

    const newHistory = [...history, { role: "user", content: message }, { role: "assistant", content: reply || "" }];
    // cap to 20
    while (newHistory.length > 20) newHistory.shift();
    await this.state.storage.put("history", newHistory);

    return new Response(JSON.stringify({ reply, usage: (res as any)?.usage }), {
      headers: { "content-type": "application/json", ...CORS },
    });
  }
}
