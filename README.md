# cf_ai_research_assistant

Cloudflare Workers AI app that satisfies the assignment:
- **LLM**: Workers AI (`env.AI`) using `MODEL` from `wrangler.toml`.
- **Workflow/coordination**: Cloudflare Worker routes input to a **Durable Object** (`ChatSession`) that manages state and calls the LLM.
- **User input**: Minimal chat UI in `/public/index.html` (optional) or call the API directly.
- **Memory/state**: Durable Object stores last 20 turns per `session_id`; last 6 sent to model.

## Live demo
- Frontend: `https://<your-pages>.pages.dev`  *(or omit if serving from Worker)*
- API: `https://<your-subdomain>.<account>.workers.dev/api/chat`

## Quickstart
```bash
npm i -g wrangler
wrangler login

# Deploy backend (creates DO via migration tag v1)
wrangler deploy

# Optional: run locally
npm run dev

# If using Pages for the UI
wrangler pages deploy public
