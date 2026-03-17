import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OrderService } from "@/services/OrderService";
import { z } from "zod";

const checkoutSchema = z.object({
  items: z.array(z.any()).min(1, "Le panier est vide"),
  shippingAddress: z.string().min(5, "Adresse de livraison requise"),
  shippingCity: z.string().min(2, "Ville requise"),
  shippingPhone: z.string().min(8, "Téléphone requis"),
  guestEmail: z.string().email().optional().or(z.literal("")),
  guestPhone: z.string().optional(),
  guestName: z.string().optional(),
  notes: z.string().optional(),
  prescriptionData: z.any().optional(),
  paymentMethod: z.string().optional(),
  couponCode: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const orders = await OrderService.getByUserId((session.user as any).id, page);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const data = checkoutSchema.parse(body);

    // Si pas de session, email ou téléphone requis
    if (!session?.user) {
      if (!data.guestEmail && !data.guestPhone) {
        return NextResponse.json(
          { error: "Email ou numéro de téléphone requis pour les commandes sans compte" },
          { status: 400 }
        );
      }
    }

    const order = await OrderService.create(data as any, (session?.user as any)?.id);
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}
