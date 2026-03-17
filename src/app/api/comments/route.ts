import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CommentService } from "@/services/CommentService";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const result = await CommentService.getByUserId((session.user as any).id, page);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Connectez-vous pour commenter" }, { status: 401 });
    }
    const { productId, content, rating } = await req.json();
    const comment = await CommentService.create({
      userId: (session.user as any).id,
      productId,
      content,
      rating,
    });
    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
