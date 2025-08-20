import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";

import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { promises as fs } from "node:fs";
import type { Document } from "@langchain/core/documents";
import { Document as LangchainDocument } from "@langchain/core/documents";

interface IndexingProps {
  apiKey: string;
  filePath?: string;   // file may be optional for text indexing
  fileType?: string;   // MIME type (optional if raw text is given)
  textContent?: string; // ✅ new: raw text (e.g., website content, chat logs)
}

export class DocumentIndexer {
  private apiKey: string;
  private filePath?: string;
  private fileType?: string;
  private textContent?: string;

  constructor({ apiKey, filePath, fileType, textContent }: IndexingProps) {
    this.apiKey = apiKey;
    this.filePath = filePath;
    this.fileType = fileType;
    this.textContent = textContent;
  }

  /** Main entry */
  public async run() {
    const docs = await this.loadDocuments();

    const embeddings = new OpenAIEmbeddings({
      apiKey: this.apiKey,
      model: "text-embedding-3-large",
    });

    const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.QDRANT_URL,
      apiKey:process.env.QDRANT_API_KEY,
      collectionName: "docmind-collection",
    });

    // cleanup uploaded file if exists
    if (this.filePath) {
      await fs.unlink(this.filePath).catch(() => {});
    }

    return vectorStore;
  }

  /** Loader dispatcher */
  private async loadDocuments(): Promise<Document[]> {
    // ✅ raw text indexing (e.g., crawled websites)
    if (this.textContent) {
      return [new LangchainDocument({ pageContent: this.textContent })];
    }

    if (!this.filePath || !this.fileType) {
      throw new Error("❌ Either textContent or filePath + fileType must be provided");
    }

    switch (this.fileType) {
      case "application/pdf":
        return this.loadPDF();

      case "text/csv":
        return this.loadCSV();

      case "text/plain":
      case "application/rtf":
        return this.loadTXT();

      default:
        throw new Error(`❌ Unsupported file type: ${this.fileType}`);
    }
  }

  /** ---- PDF ---- */
  private async loadPDF() {
    return await new PDFLoader(this.filePath!).load();
  }

  /** ---- CSV ---- */
  private async loadCSV() {
    return await new CSVLoader(this.filePath!).load();
  }

  /** ---- TXT / RTF ---- */
  private async loadTXT() {
    return await new TextLoader(this.filePath!).load();
  }
}
