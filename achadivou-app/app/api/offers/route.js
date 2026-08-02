export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { NextResponse } from "next/server";
const prisma = require("../../../lib/prisma");
const { getSessionFromRequest } = require("../../../lib/auth");

// GET /api/offers -> lista ofertas.
// Visitantes públicos só veem ofertas ativas; admin autenticado vê todas (?all=1).
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const wantAll = searchParams.get("all") === "1";
  const session = getSessionFromRequest(request);

  const where = wantAll && session ? {} : { active: true };

  const offers = await prisma.offer.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(offers);
}

// POST /api/offers -> cria nova oferta (somente admin autenticado)
export async function POST(request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const { title, link, image, price, originalPrice, store, category, coupon, featured, active } = body;

  if (!title || !link || price === undefined || price === null) {
    return NextResponse.json({ error: "Preencha título, link e preço." }, { status: 400 });
  }

  const offer = await prisma.offer.create({
    data: {
      title,
      link,
      image: image || "",
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : 0,
      store,
      category,
      coupon: coupon || "",
      featured: !!featured,
      active: active === undefined ? true : !!active,
    },
  });

  return NextResponse.json(offer, { status: 201 });
}
