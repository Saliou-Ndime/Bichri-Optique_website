import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { CategoryService } from "@/services/CategoryService";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const { id } = await params;
  const body = await req.json();
  const category = await CategoryService.update(id, body);
  return NextResponse.json({ success: true, data: category });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const { id } = await params;
  await CategoryService.delete(id);
  return NextResponse.json({ success: true });
}
