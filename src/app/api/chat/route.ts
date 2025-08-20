import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import OpenAI from 'openai';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, apiKey } = await req.json();

    const query=messages[messages.length-1];
    const system=messages[0];

    const embeddings = new OpenAIEmbeddings({
      apiKey: apiKey,
      model: "text-embedding-3-large",
    });

    const vectorStore = new QdrantVectorStore(embeddings,{
      url: process.env.QDRANT_URL!,
      collectionName: "docmind-collection",
    });

    const vectorSearcher = vectorStore.asRetriever({
      k: 3,
    });

    const relevantChunk = await vectorSearcher.invoke(query.content);

    const SYSTEM_PROMPT = `
    You are an AI assistant who helps resolving user query based on the
    context available to you from a PDF file with the content and page number.

    Only ans based on the available context from file only.

    Context:
    ${JSON.stringify(relevantChunk)}
    `;

    const wholePrompt=`
    ${system.content}
    
    ${SYSTEM_PROMPT}
    `;

    messages[0]={
      role:'system',
      content:wholePrompt
    }

    const client=new OpenAI({
      apiKey
    });
    const stream = await client.chat.completions.create({
      model: 'gpt-4.1',
      messages:messages,
      stream:true
    });

    const encoder=new TextEncoder();
    const readable=new ReadableStream({
      async start(controller){
        for await(const chunk of stream ){
          const content=chunk.choices[0]?.delta.content || '';
          if(content){
            controller.enqueue(encoder.encode(`data:${JSON.stringify({content})}\n\n`));
          }
        }
        controller.close();
      }
    });

    return new Response(readable,{
      headers:{
        'Content-Type':'Text/event-stream',
        'Cache-Control':'no-cache',
        'Connection':'keep-alive'
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}