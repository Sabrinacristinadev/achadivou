import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("achadivou-uploads");
    const blob = await store.get(params.filename, { type: "arrayBuffer" });
    if (!blob) {
      return NextResponse.json({ error: "Imagem não encontrada." }, { status: 404 });
    }
    const meta = await store.getMetadata(params.filename);
    const contentType = meta?.metadata?.contentType || "image/jpeg";
    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Imagem não encontrada." }, { status: 404 });
  }
}
