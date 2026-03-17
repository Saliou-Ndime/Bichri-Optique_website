import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return { error: true, response: NextResponse.json({ error: "Accès non autorisé" }, { status: 403 }) };
  }
  return { error: false, session };
}
