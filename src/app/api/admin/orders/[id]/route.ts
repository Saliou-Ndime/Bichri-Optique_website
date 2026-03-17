import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { OrderService } from "@/services/OrderService";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const { id } = await params;
  const order = await OrderService.getById(id);
  return NextResponse.json(order);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.response;
  const { id } = await params;
  const { status, paymentStatus } = await req.json();
  if (status) await OrderService.updateStatus(id, status);
  if (paymentStatus) await OrderService.updatePaymentStatus(id, paymentStatus);
  const order = await OrderService.getById(id);
  return NextResponse.json({ success: true, data: order });
}
