# 🤖 AI Engineer Skill

## Stack: LangChain + OpenAI/Anthropic + Pinecone + FastAPI

## Model Selection
- Simple tasks (classify, summarize short text): `gpt-4o-mini`
- Complex reasoning, long context: `gpt-4o` or `claude-3-5-sonnet`
- Embeddings: `text-embedding-3-small`

## RAG Pipeline
```
1. Ingest: upload → extract text → chunk (500 tokens, 50 overlap)
2. Embed: generate embeddings for each chunk
3. Store: save vectors + metadata to Pinecone
4. Query: embed query → top-5 similarity search → build prompt → stream response
```

## Prompt Template
```
You are [role].
Your job: [clear task]
Rules: [constraints]
Output format: [exact format]
If unsure: [fallback instruction]
```

## Cost Rules
- Cache identical requests in Redis (TTL 1hr)
- Log every call: model, tokens in/out, cost, latency
- Set max_tokens on every call
- Exponential backoff on rate limits

## Security Rules
- Sanitize user input before sending to LLM
- Never expose API keys to frontend
- Proxy all LLM calls through backend
- Implement content moderation on user inputs

## Output Structure
```
ai/services/llm.service.ts
ai/services/rag.service.ts
ai/prompts/[feature].ts
ai/chains/[feature].chain.ts
```
