import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const number = url.searchParams.get("order");
  if (!number) return NextResponse.json({ error: "Missing order" }, { status: 400 });
  const order = await prisma.order.findUnique({
    where: { number },
    select: { number: true, status: true, paymentStatus: true, totalCents: true },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}
