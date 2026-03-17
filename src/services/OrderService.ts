import { db } from "@/db";
import { orders, orderItems, products, invoices } from "@/db/schema";
import { eq, and, desc, count, sql, gte, lte } from "drizzle-orm";
import type { CheckoutData, NewOrder, NewOrderItem, OrderWithItems } from "@/types";
import { generateOrderNumber, generateInvoiceNumber } from "@/lib/utils";

export class OrderService {
  /**
   * Créer une commande
   */
  static async create(data: CheckoutData, userId?: string) {
    const orderNumber = generateOrderNumber();

    // Calculer les totaux
    let subtotal = 0;
    for (const item of data.items) {
      const price = item.variant?.price
        ? parseFloat(item.variant.price)
        : parseFloat(item.product.price);
      subtotal += price * item.quantity;
    }

    const shippingCost = subtotal >= 50000 ? 0 : 3000; // Livraison gratuite au-dessus de 50000 FCFA
    const total = subtotal + shippingCost;

    // Créer la commande
    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: userId || null,
        guestEmail: data.guestEmail || null,
        guestPhone: data.guestPhone || null,
        guestName: data.guestName || null,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingPhone: data.shippingPhone,
        shippingCountry: data.shippingCountry || "Sénégal",
        subtotal: String(subtotal),
        shippingCost: String(shippingCost),
        total: String(total),
        notes: data.notes,
        prescriptionData: data.prescriptionData,
        paymentMethod: data.paymentMethod || "cash_on_delivery",
      })
      .returning();

    // Créer les items de la commande
    const items: NewOrderItem[] = data.items.map((item) => {
      const price = item.variant?.price
        ? parseFloat(item.variant.price)
        : parseFloat(item.product.price);
      return {
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        unitPrice: String(price),
        totalPrice: String(price * item.quantity),
        productName: item.product.name,
        productImage: (item.product.images as string[])?.[0] || null,
      };
    });

    await db.insert(orderItems).values(items);

    // Mettre à jour le stock
    for (const item of data.items) {
      await db
        .update(products)
        .set({ stock: sql`${products.stock} - ${item.quantity}` })
        .where(eq(products.id, item.productId));
    }

    // Créer la facture
    await db.insert(invoices).values({
      orderId: order.id,
      invoiceNumber: generateInvoiceNumber(),
      amount: String(total),
    });

    return order;
  }

  /**
   * Obtenir une commande par ID
   */
  static async getById(id: string): Promise<OrderWithItems | null> {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: { product: true },
        },
        user: true,
        invoice: true,
      },
    });
    return order as OrderWithItems | null;
  }

  /**
   * Obtenir une commande par numéro
   */
  static async getByOrderNumber(orderNumber: string) {
    return db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
      with: {
        items: { with: { product: true } },
        user: true,
        invoice: true,
      },
    });
  }

  /**
   * Commandes d'un utilisateur
   */
  static async getByUserId(userId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [data, totalResult] = await Promise.all([
      db.query.orders.findMany({
        where: eq(orders.userId, userId),
        with: {
          items: { with: { product: true } },
          invoice: true,
        },
        orderBy: [desc(orders.createdAt)],
        limit,
        offset,
      }),
      db.select({ count: count() }).from(orders).where(eq(orders.userId, userId)),
    ]);

    return {
      data,
      total: totalResult[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count || 0) / limit),
    };
  }

  /**
   * Toutes les commandes (admin)
   */
  static async getAll(page = 1, limit = 20, status?: string) {
    const conditions: any[] = [];
    if (status) conditions.push(eq(orders.status, status as any));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, totalResult] = await Promise.all([
      db.query.orders.findMany({
        where,
        with: {
          items: true,
          user: true,
        },
        orderBy: [desc(orders.createdAt)],
        limit,
        offset: (page - 1) * limit,
      }),
      db.select({ count: count() }).from(orders).where(where),
    ]);

    return {
      data,
      total: totalResult[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count || 0) / limit),
    };
  }

  /**
   * Mettre à jour le statut (admin)
   */
  static async updateStatus(id: string, status: string) {
    const [order] = await db
      .update(orders)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  /**
   * Mettre à jour le statut de paiement (admin)
   */
  static async updatePaymentStatus(id: string, paymentStatus: string) {
    const [order] = await db
      .update(orders)
      .set({ paymentStatus: paymentStatus as any, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  /**
   * Statistiques des commandes (admin dashboard)
   */
  static async getStats() {
    const [totalOrders] = await db.select({ count: count() }).from(orders);
    const [totalRevenue] = await db
      .select({ total: sql<number>`COALESCE(SUM(${orders.total}::numeric), 0)` })
      .from(orders)
      .where(eq(orders.paymentStatus, "payee"));

    return {
      totalOrders: totalOrders?.count || 0,
      totalRevenue: totalRevenue?.total || 0,
    };
  }
}
