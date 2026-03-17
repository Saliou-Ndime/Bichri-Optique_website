import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/services/ProductService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      categorySlug: searchParams.get("categorySlug") || undefined,
      brandSlug: searchParams.get("brandSlug") || undefined,
      type: searchParams.get("type") || undefined,
      gender: searchParams.get("gender") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      search: searchParams.get("search") || undefined,
      isFeatured: searchParams.get("isFeatured") === "true" ? true : undefined,
      sortBy: (searchParams.get("sortBy") as any) || undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 12,
    };
    const result = await ProductService.getProducts(filters);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
