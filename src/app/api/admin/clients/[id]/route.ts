import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { UserService } from "@/services/UserService";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const { id } = await params;
  const user = await UserService.toggleActive(id);
  return NextResponse.json({ success: true, data: user });
}
