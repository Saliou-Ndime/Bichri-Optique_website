import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "@/services/CategoryService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const withCount = searchParams.get("withCount") === "true";
    
    if (withCount) {
      const categories = await CategoryService.getWithProductCount();
      return NextResponse.json(categories);
    }
    
    const categories = await CategoryService.getAll();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
