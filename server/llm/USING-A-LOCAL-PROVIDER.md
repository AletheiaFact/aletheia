# Using a local (self-hosted) LLM provider

Aletheia's `LLMProvider` / `EmbeddingsProvider` abstractions talk to any
OpenAI-compatible HTTP API. Setting `llm.base_url` in `config.yaml` is enough
to redirect chat and/or embeddings traffic away from OpenAI to a self-hosted
server such as **Ollama**, vLLM, LocalAI, or LM Studio — no code changes
required. This guide walks through the Ollama case as a concrete example.

## 1. Install and start Ollama

```bash
# macOS
brew install ollama
ollama serve   # starts the API on http://localhost:11434

# or see https://ollama.com/download for other platforms
```

## 2. Pull the models you need

```bash
ollama pull llama3.1          # chat model
ollama pull nomic-embed-text  # embeddings model (optional, see warning below)
```

## 3. Point `config.yaml` at Ollama

```yaml
llm:
  base_url: http://localhost:11434/v1
  chat_model: llama3.1
  # No api_key needed — a placeholder is supplied automatically for keyless local servers.
  # embeddings_model: nomic-embed-text
```

That's it. Restart the app and the copilot, summarization, and
verification-request AI features will route chat requests to your local
Ollama instance.

## Keyless servers and the placeholder API key

Ollama (and many self-hosted OpenAI-compatible servers) don't require an API
key at all, but the underlying OpenAI SDK used by LangChain always requires a
non-empty key string to construct a client. When `llm.base_url` is set and no
API key is resolved from `llm.api_key` / `openai.api_key` /
`OPENAI_API_KEY`, the providers automatically substitute a placeholder value
(`LOCAL_PLACEHOLDER_API_KEY` in `server/llm/llm.constants.ts`) so client
construction succeeds. This is purely to satisfy the SDK's validation — the
value is never sent anywhere meaningful for servers that don't check it.

If your self-hosted server **does** require a real API key, just set
`llm.api_key` explicitly — an explicit key always takes precedence over the
placeholder.

If neither an API key nor a `base_url` is configured at all, the providers
still fail fast with a clear error, exactly as before.

## WARNING: changing `embeddings_model` breaks stored similarity search

Embedding vectors from different models are **not comparable**. If you
change `llm.embeddings_model` away from OpenAI's default (e.g. to
`nomic-embed-text`), any similarity search against embeddings already stored
in the database will silently return wrong/irrelevant results, because the
new vectors won't live in the same vector space as the old ones.

Only set `embeddings_model` on a fresh deployment with no existing stored
embeddings, or if you're prepared to re-embed all existing content.

For an existing deployment, a common hybrid setup is to route **chat** to a
local model (set `base_url` + `chat_model`) while leaving `embeddings_model`
unset so embeddings keep using OpenAI's default model and remain compatible
with what's already stored.
