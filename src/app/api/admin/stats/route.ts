import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { StatsService } from "@/services/StatsService";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  try {
    const stats = await StatsService.getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
