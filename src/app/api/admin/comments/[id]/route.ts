import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { CommentService } from "@/services/CommentService";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const { id } = await params;
  const { action } = await req.json();
  if (action === "approve") {
    await CommentService.approve(id);
  } else if (action === "reject") {
    await CommentService.reject(id);
  }
  return NextResponse.json({ success: true });
}
