import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { CategoryService } from "@/services/CategoryService";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const categories = await CategoryService.getAll(true);
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const body = await req.json();
  const category = await CategoryService.create(body);
  return NextResponse.json({ success: true, data: category });
}
