import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { CommentService } from "@/services/CommentService";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const approved = searchParams.has("approved") ? searchParams.get("approved") === "true" : undefined;
  const result = await CommentService.getAll(page, 20, approved);
  return NextResponse.json(result);
}
