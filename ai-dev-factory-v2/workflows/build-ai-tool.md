# 🤖 Workflow: Build AI Tool

Use this workflow for LLM-powered apps, chatbots, RAG systems, and AI features.

---

## Trigger Prompt

```
Use the skill at agents/orchestrator/SKILL.md

I want to build an AI tool: [DESCRIBE YOUR IDEA]

Follow this workflow: workflows/build-ai-tool.md
Use this template: templates/ai-chatbot/TEMPLATE.md

Start with the product-manager agent.
```

---

## Agent Execution Order

### Step 1 — Product Manager
Define: what AI does, what input it takes, what output it produces, who uses it
Produce: prd.md, features.md

### Step 2 — Architect
Decide: which LLM (OpenAI/Anthropic), RAG or not, streaming or not
Tech stack: Next.js + FastAPI (Python AI backend) + PostgreSQL + Pinecone

### Step 3 — Designer
AI-specific UX: streaming text animation, citation display, conversation history UI, loading states

### Step 4 — Database
Schema: conversations, messages, documents (if RAG), usage tracking

### Step 5 — AI Agent ← KEY STEP
```
Use agents/ai/SKILL.md
Build:
- LLM client wrapper
- System prompt templates
- RAG pipeline (if needed)
- Streaming endpoint
- Response caching
```

### Step 6 — Backend
API endpoints: /ai/chat, /ai/generate, /ai/embed, /documents/upload
Auth + rate limiting (prevent API cost abuse)

### Step 7 — Frontend
Streaming chat UI, markdown rendering, code highlighting, conversation sidebar

### Step 8 — Integrations
OpenAI/Anthropic API setup, Pinecone setup, usage tracking

### Step 9 — Security
Input sanitization (prevent prompt injection), rate limiting per user, content moderation, API key security

### Step 10 — QA
Test: normal prompts, edge cases, very long inputs, empty inputs, offensive inputs
Test streaming works correctly
Test fallback when LLM API is down

### Step 11 — Performance
LLM response caching, streaming latency, bundle size

### Step 12 — DevOps + Reflection

---

## AI-Specific Checklist
- [ ] System prompt tested with 20+ different inputs
- [ ] Handles LLM API downtime gracefully
- [ ] Rate limiting per user (prevent cost abuse)
- [ ] All user inputs sanitized (prompt injection prevention)
- [ ] LLM costs logged and monitored
- [ ] Max token limits set on every call
- [ ] Conversation history truncated if too long (context window)
- [ ] Streaming works without timeout
- [ ] Fallback response when AI is unavailable
