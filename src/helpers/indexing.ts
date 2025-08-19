import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";

import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { promises as fs } from "node:fs";
import type { Document } from "@langchain/core/documents";

interface IndexingProps {
  apiKey: string;
  filePath: string;
  fileType: string; // MIME type
}

export class DocumentIndexer {
  private apiKey: string;
  private filePath: string;
  private fileType: string;

  constructor({ apiKey, filePath, fileType }: IndexingProps) {
    this.apiKey = apiKey;
    this.filePath = filePath;
    this.fileType = fileType;
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
      collectionName: "docmind-collection",
    });

    // cleanup after indexing
    await fs.unlink(this.filePath);

    return vectorStore;
  }

  /** Loader dispatcher */
  private async loadDocuments(): Promise<Document[]> {
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
    return await new PDFLoader(this.filePath).load();
  }

  /** ---- CSV ---- */
  private async loadCSV() {
    return await new CSVLoader(this.filePath).load();
  }

  /** ---- TXT / RTF ---- */
  private async loadTXT() {
    return await new TextLoader(this.filePath).load();
  }
}
