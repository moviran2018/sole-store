# SoleBot Chatbot Module

A standalone, embeddable Persian AI chatbot for e-commerce sites. Zero dependency, single `<script>` tag install.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Any Website │────▶│  Cloudflare Worker│────▶│  Gemma-4 AI │
│  (widget.js) │     │  (index.js)      │     │  (Google)   │
└─────────────┘     └──────────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  Google Doc  │
                    │  (knowledge) │
                    └─────────────┘
```

## Files

| File | Purpose |
|------|---------|
| `widget/chatbot-widget.js` | Embeddable widget (drop into any HTML page) |
| `worker/index.js` | Cloudflare Worker (AI proxy + transcription) |
| `wrangler.toml` | Worker deployment config |
| `example/usage.html` | Demo page |
| `generate-data.js` | Generate products.json from site data |

---

## Quick Start (5 minutes)

### 1. Deploy the Worker

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
cd chatbot-module
wrangler deploy
```

Then set secrets:

```bash
wrangler secret put GEMINI_API_KEY    # Required (get from aistudio.google.com)
wrangler secret put KNOWLEDGE_URL     # Optional: Google Doc export URL
```

### 2. Add to Any Website

Add this `<script>` tag just before `</body>`:

```html
<script defer
  src="https://YOUR-SITE.com/chatbot-widget.js"
  data-worker="https://YOUR-WORKER.workers.dev"
  data-provider="gemini"
  data-title="SoleBot"
  data-welcome="سلام! چطور می‌توانم کمک کنم؟"
  data-knowledge="/data/products.json"
  data-knowledge-url="https://docs.google.com/document/d/.../export?format=txt"
></script>
```

---

## Configuration

### Widget Attributes

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `data-worker` | ✅ | — | Worker URL (e.g. `https://sole-chatbot.workers.dev`) |
| `data-provider` | ❌ | `gemini` | AI provider (`gemini` / `groq` / `openai` / `claude`) |
| `data-title` | ❌ | `SoleBot` | Chat header title |
| `data-welcome` | ❌ | `سلام! چطور می‌توانم کمک کنم؟` | First bot message |
| `data-knowledge` | ❌ | — | URL to products JSON (for client-side fallback) |
| `data-knowledge-url` | ❌ | — | Google Doc export URL (knowledge base) |

### Worker Bindings (Secrets)

| Binding | Required | Description |
|---------|----------|-------------|
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key (Gemma-4 model, free) |
| `AI_API_KEY_GROQ` | ❌ | Groq API key (fallback provider) |
| `AI_API_KEY_OPENAI` | ❌ | OpenAI API key |
| `AI_API_KEY_CLAUDE` | ❌ | Anthropic API key |
| `SYSTEM_PROMPT` | ❌ | Custom system prompt override |
| `KNOWLEDGE_URL` | ❌ | Google Doc export URL for knowledge base |

---

## Voice Feature

- **Supports Persian** (`fa-IR`)
- Uses browser **Web Speech API** (no API key, instant)
- Works in Chrome/Edge (mobile + desktop)
- Hold 🎤 button → speak → release → sends transcribed text

---

## Deploy Updates

```bash
# Update worker code
wrangler deploy

# Update widget (copy to your site's public folder)
cp widget/chatbot-widget.js /path/to/your/site/public/
```

---

## Using with Next.js (Static Export)

Add the script tag in your `layout.tsx` or `_document.tsx`:

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <script defer
          src="/sole-store/chatbot-widget.js"
          data-worker="https://sole-chatbot.moviran2018.workers.dev"
          data-provider="gemini"
          data-knowledge="/sole-store/data/products.json"
        />
      </body>
    </html>
  );
}
```
