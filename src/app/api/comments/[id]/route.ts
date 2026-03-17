import { NextRequest, NextResponse } from "next/server";
import { CommentService } from "@/services/CommentService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await CommentService.getByProductId(id);
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
