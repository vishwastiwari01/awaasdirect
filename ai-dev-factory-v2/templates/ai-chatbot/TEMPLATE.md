# 🤖 AI Chatbot / LLM App Template

Use this for: AI assistants, document Q&A, customer support bots, AI writing tools, RAG apps, any LLM-powered product.

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind |
| AI SDK | Vercel AI SDK (streaming) |
| LLM | OpenAI GPT-4o OR Anthropic Claude |
| Orchestration | LangChain.js OR LlamaIndex |
| Vector DB | Pinecone OR pgvector |
| Embeddings | OpenAI text-embedding-3-small |
| Primary DB | PostgreSQL + Prisma |
| Cache | Redis (response caching) |
| Auth | NextAuth.js |
| Deploy | Vercel |

---

## 📁 Folder Structure

```
ai-chatbot/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (chat)/
│   │   ├── page.tsx             ← Chat interface
│   │   └── [chatId]/
│   │       └── page.tsx         ← Specific conversation
│   └── api/
│       ├── auth/
│       ├── chat/
│       │   └── route.ts         ← Main AI streaming endpoint
│       ├── documents/
│       │   └── route.ts         ← Document upload + ingestion
│       └── history/
│           └── route.ts         ← Conversation history
│
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx    ← Main chat UI
│   │   ├── MessageList.tsx      ← Messages display
│   │   ├── MessageBubble.tsx    ← Single message
│   │   ├── ChatInput.tsx        ← Input + send button
│   │   ├── StreamingText.tsx    ← Animated typing
│   │   └── SourceCitations.tsx  ← RAG source display
│   ├── sidebar/
│   │   ├── ConversationList.tsx
│   │   └── NewChatButton.tsx
│   └── upload/
│       └── DocumentUpload.tsx
│
├── lib/
│   ├── ai/
│   │   ├── client.ts            ← OpenAI / Anthropic client
│   │   ├── prompts.ts           ← System prompts
│   │   ├── rag.ts               ← RAG pipeline
│   │   └── embeddings.ts        ← Embedding functions
│   ├── vectorstore/
│   │   └── pinecone.ts
│   └── db/
│       └── conversations.ts
│
├── prisma/
│   └── schema.prisma
│
└── .env.local
```

---

## 🗄️ Database Schema

```prisma
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String?
  createdAt     DateTime       @default(now())
  conversations Conversation[]
  documents     Document[]
}

model Conversation {
  id        String    @id @default(cuid())
  userId    String
  title     String    @default("New Chat")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  user      User      @relation(fields: [userId], references: [id])
  messages  Message[]
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  role           MessageRole
  content        String       @db.Text
  sources        Json?        ← RAG citations
  tokensUsed     Int?
  createdAt      DateTime     @default(now())

  conversation   Conversation @relation(fields: [conversationId], references: [id])
}

model Document {
  id          String   @id @default(cuid())
  userId      String
  name        String
  content     String   @db.Text
  vectorIds   String[] ← Pinecone vector IDs
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
}

enum MessageRole { user assistant system }
```

---

## 🔌 API Routes

### `POST /api/chat` — Main chat endpoint (streaming)
```typescript
// Request
{
  messages: { role: string, content: string }[],
  conversationId: string,
  useDocuments: boolean   // enable RAG
}

// Response: Server-Sent Events stream
data: {"text": "Hello"}
data: {"text": " how"}
data: {"text": " can I help?"}
data: [DONE]
```

### `POST /api/documents` — Upload + ingest document
```typescript
// Request: multipart/form-data with file
// Supported: PDF, TXT, MD, DOCX

// Process:
// 1. Extract text from file
// 2. Chunk into ~500 token pieces
// 3. Generate embeddings for each chunk
// 4. Store vectors in Pinecone
// 5. Save document record in DB
```

---

## 💬 System Prompt Template

```typescript
// lib/ai/prompts.ts
export const SYSTEM_PROMPT = `
You are a helpful AI assistant.

## Your Capabilities
- Answer questions clearly and accurately
- Help with writing, analysis, and brainstorming
- Reference uploaded documents when relevant

## Rules
- Be concise but thorough
- If unsure, say so — don't hallucinate
- Always cite sources when using document context
- Format responses with markdown when helpful

## Context
Today's date: {date}
User name: {userName}
`;

export const RAG_PROMPT = `
Answer the question using ONLY the context below.
If the answer isn't in the context, say "I don't have that information."

Context:
{context}

Question: {question}
`;
```

---

## 🎨 UI Features

- Streaming response with animated cursor
- Code blocks with syntax highlighting + copy button
- Markdown rendering (bold, lists, tables, code)
- Conversation history in sidebar
- Document upload with drag-and-drop
- Source citations panel (for RAG responses)
- Regenerate response button
- Copy message button
- New chat button

---

## 🌍 Environment Variables

```env
# OpenAI
OPENAI_API_KEY=sk-...

# OR Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Pinecone
PINECONE_API_KEY=
PINECONE_INDEX=chatbot-index

# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Redis (optional caching)
REDIS_URL=redis://localhost:6379
```

---

## 🚀 How to Use This Template

Tell your agents:
> "Use `templates/ai-chatbot/TEMPLATE.md` as the base. Build a [customer support bot / document Q&A / AI assistant] for [your use case]."
