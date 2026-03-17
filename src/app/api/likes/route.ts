import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LikeService } from "@/services/LikeService";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const userId = (session.user as any).id;

    if (searchParams.get("idsOnly") === "true") {
      const ids = await LikeService.getUserLikedProductIds(userId);
      return NextResponse.json(ids);
    }

    const page = Number(searchParams.get("page")) || 1;
    const likes = await LikeService.getUserLikes(userId, page);
    return NextResponse.json(likes);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Connectez-vous pour aimer un produit" }, { status: 401 });
    }
    const { productId } = await req.json();
    const result = await LikeService.toggle((session.user as any).id, productId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
