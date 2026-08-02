import { NextResponse } from "next/server";
const prisma = require("../../../../lib/prisma");
const { getSessionFromRequest } = require("../../../../lib/auth");

export async function PATCH(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const data = {};
  const fields = ["title", "link", "image", "store", "category", "coupon", "featured", "active"];
  for (const f of fields) {
    if (body[f] !== undefined) data[f] = body[f];
  }
  if (body.price !== undefined) data.price = parseFloat(body.price);
  if (body.originalPrice !== undefined) data.originalPrice = parseFloat(body.originalPrice || 0);

  try {
    const offer = await prisma.offer.update({ where: { id: params.id }, data });
    return NextResponse.json(offer);
  } catch {
    return NextResponse.json({ error: "Oferta não encontrada." }, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    await prisma.offer.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Oferta não encontrada." }, { status: 404 });
  }
}
