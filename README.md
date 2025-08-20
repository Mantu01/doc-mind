# DocMind

**DocMind** is a modern web application built with [Next.js 13+](https://nextjs.org) designed to help users organize, document, and visualize ideas efficiently. It leverages **vector databases** for intelligent search and AI-powered retrieval, allowing seamless indexing and querying of documents, websites, and other resources.

---

## Features

* ⚡ Built with Next.js 13+ App Router
* 🤖 AI-powered retrieval and context-based chat
* 💾 Automatic document and website indexing
* 🌐 Supports multiple file types: PDF, CSV, images, and web pages
* 📝 Fast and interactive frontend with Geist font
* 🐳 Local development with Docker Compose for vector DB
* 🔑 Secure API key support for OpenAI and Qdrant

---

## Project Flow & Logic

DocMind combines **document ingestion**, **vector embeddings**, and **AI-assisted querying**:

1. **Landing Page**: Users start with an introduction and call-to-action.
2. **Document Upload & Crawling**: Users can upload PDFs or crawl websites.

   * PDF/Text files are read and converted into embeddings.
   * Websites are crawled page by page, and textual content is indexed.
3. **Vector Database**:

   * Uses **Qdrant** as the vector database (local or cloud).
   * Documents and crawled content are stored with embeddings for fast semantic search.
4. **AI Chat**:

   * Users interact with an AI assistant that responds based on the **context of uploaded files or crawled pages**.
   * Streams real-time responses using OpenAI’s GPT models.
5. **Persistence**: All data persists in Qdrant, enabling fast search and context-based retrieval.

---

## Backend Overview

The backend is fully server-side and handles all core operations:

* **File Upload & Indexing** (`/api/ingest`):

  * Accepts files (PDF, CSV, etc.) and converts content into embeddings.
  * Stores documents in Qdrant for retrieval.

* **Website Crawling & Indexing** (`/api/crawl`):

  * Crawls pages from a given URL.
  * Extracts textual content and indexes it in Qdrant.

* **AI Chat** (`/api/chat`):

  * Receives user messages and context from indexed documents.
  * Generates AI responses via OpenAI’s GPT models.
  * Streams responses in real-time to the frontend.

* **Vector Store Integration**:

  * Uses [LangChain](https://www.langchain.com/) with `OpenAIEmbeddings` and `QdrantVectorStore`.
  * Provides a retriever interface to query top-K relevant chunks for AI responses.

---

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) v18+
* [pnpm](https://pnpm.io/) v8+
* [Docker](https://www.docker.com/) (for local Qdrant vector DB)

---

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Mantu01/doc-mind
cd docmind
pnpm install
```

---

### Configuration

DocMind requires a vector database connection. You can choose **local** or **cloud-hosted** Qdrant.

#### 1. Local Qdrant via Docker Compose

1. Ensure Docker is running.
2. Copy `.env.example` to `.env` and update as needed.
3. Start Qdrant:

```bash
docker compose up -d
```

4. The app will connect to Qdrant at `http://localhost:6333` by default.

#### 2. Cloud Vector DB

1. Obtain your cloud Qdrant or other vector DB URL.
2. Set environment variables in `.env`:

```
QDRANT_URL=https://<your-cloud-vector-db-endpoint>
QDRANT_API_KEY=<your-api-key>
```

---

### Running Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view DocMind.

---

### Project Structure

```
app/            # Next.js frontend code (pages, layouts, components)
public/         # Static assets
styles/         # Global and component-level styles
helpers/        # Backend helpers (crawler, indexing)
api/            # Server API routes (chat, upload, crawl)
README.md       # Project documentation
docker-compose.yml # Docker Compose for local Qdrant
.env            # Environment variables
```

---

### Scripts

* `pnpm dev` – Start development server
* `pnpm build` – Build for production
* `pnpm start` – Run production server
* `pnpm lint` – Run ESLint checks

---

### Fonts

DocMind uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to optimize and load the **Geist** font family.

---

### Learn More

* [Next.js Documentation](https://nextjs.org/docs)
* [LangChain](https://www.langchain.com/)
* [Vector Database Concepts](https://www.pinecone.io/learn/vector-database/)
* [Docker Compose](https://docs.docker.com/compose/)

---

### Deployment

Recommended deployment is via **Vercel**:

1. Push code to GitHub/GitLab/Bitbucket.
2. Import project in Vercel.
3. Set build command: `pnpm build`
4. Output directory: `.next`
5. Set environment variables (`QDRANT_URL`, API keys, etc.)
6. Deploy and enjoy AI-powered indexing and chat.

---

### Contribution

Feel free to fork, open issues, or submit PRs to improve **DocMind**!
