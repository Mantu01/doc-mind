import { DocumentIndexer } from "@/helpers/indexing";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const apiKey=form.get('apiKey') as string | null;
    console.log(file)

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const filePath = join(process.cwd(), "public", file.name);
    await fs.writeFile(filePath, buf);
    const indexing=new DocumentIndexer({
      apiKey:apiKey?apiKey:process.env.GEMINI_API_KEY!,
      filePath,
      fileType:file.type
    });
    await indexing.run();
    return NextResponse.json({
      ok: true,
      file: file.name,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
