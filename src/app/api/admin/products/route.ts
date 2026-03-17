import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { ProductService } from "@/services/ProductService";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || undefined;
    const result = await ProductService.getAllAdmin(page, 20, search);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  try {
    const body = await req.json();
    const product = await ProductService.create(body);
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
