import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { UserService } from "@/services/UserService";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || undefined;
  const result = await UserService.getAll(page, 20, search);
  return NextResponse.json(result);
}
