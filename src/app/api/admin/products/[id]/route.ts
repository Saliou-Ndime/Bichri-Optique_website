import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { ProductService } from "@/services/ProductService";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const { id } = await params;
  const product = await ProductService.getById(id);
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const { id } = await params;
  const body = await req.json();
  const product = await ProductService.update(id, body);
  return NextResponse.json({ success: true, data: product });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const { id } = await params;
  await ProductService.delete(id);
  return NextResponse.json({ success: true });
}
