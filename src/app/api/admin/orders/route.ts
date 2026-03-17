import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { OrderService } from "@/services/OrderService";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || undefined;
  const result = await OrderService.getAll(page, 20, status);
  return NextResponse.json(result);
}
