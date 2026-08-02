import { NextResponse } from "next/server";
const { getSessionFromRequest } = require("../../../lib/auth");

// No Netlify (e em qualquer hospedagem serverless) o disco não é persistente,
// então as imagens enviadas por upload são guardadas no Netlify Blobs (armazenamento
// nativo do Netlify, incluso automaticamente em qualquer site publicado lá — não
// precisa criar conta em outro serviço). Em desenvolvimento local (npm run dev),
// como o Netlify Blobs não está disponível fora do Netlify, use sempre o campo
// "Cole a URL da imagem" no formulário, ou rode `netlify dev` em vez de `next dev`.
export async function POST(request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Formato de imagem não suportado." }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Imagem maior que 5MB." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("achadivou-uploads");
    await store.set(filename, buffer, { metadata: { contentType: file.type } });
    return NextResponse.json({ url: `/api/uploads/${filename}` });
  } catch (e) {
    return NextResponse.json(
      { error: "Upload indisponível neste ambiente. Use o campo de URL da imagem, ou rode 'netlify dev' localmente." },
      { status: 500 }
    );
  }
}
