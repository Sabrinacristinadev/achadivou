import { NextResponse } from "next/server";
const prisma = require("../../../../../lib/prisma");

export async function POST(request, { params }) {
  try {
    const offer = await prisma.offer.update({
      where: { id: params.id },
      data: { clicks: { increment: 1 } },
    });
    return NextResponse.json({ ok: true, clicks: offer.clicks });
  } catch {
    return NextResponse.json({ error: "Oferta não encontrada." }, { status: 404 });
  }
}
