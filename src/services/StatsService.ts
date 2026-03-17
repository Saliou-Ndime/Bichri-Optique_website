import { db } from "@/db";
import { orders, products, users, orderItems, comments } from "@/db/schema";
import { eq, count, sql, desc, and, gte } from "drizzle-orm";

export class StatsService {
  static async getDashboardStats() {
    const [totalOrdersResult] = await db.select({ count: count() }).from(orders);
    const [totalRevenueResult] = await db
      .select({
        total: sql<string>`COALESCE(SUM(${orders.total}::numeric), 0)`,
      })
      .from(orders)
      .where(eq(orders.paymentStatus, "payee"));
    const [totalProductsResult] = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.isActive, true));
    const [totalClientsResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "client"));
    const [pendingCommentsResult] = await db
      .select({ count: count() })
      .from(comments)
      .where(eq(comments.isApproved, false));

    // Commandes récentes
    const recentOrders = await db.query.orders.findMany({
      with: { items: true, user: true },
      orderBy: [desc(orders.createdAt)],
      limit: 5,
    });

    // Commandes par statut
    const ordersByStatus = await db
      .select({
        status: orders.status,
        count: count(),
      })
      .from(orders)
      .groupBy(orders.status);

    // Revenus par mois (6 derniers mois)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueByMonth = await db
      .select({
        month: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        revenue: sql<string>`COALESCE(SUM(${orders.total}::numeric), 0)`,
      })
      .from(orders)
      .where(
        and(eq(orders.paymentStatus, "payee"), gte(orders.createdAt, sixMonthsAgo))
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`);

    // Top produits vendus
    const topProducts = await db
      .select({
        productId: orderItems.productId,
        productName: orderItems.productName,
        totalSold: sql<number>`SUM(${orderItems.quantity})`,
        totalRevenue: sql<string>`SUM(${orderItems.totalPrice}::numeric)`,
      })
      .from(orderItems)
      .groupBy(orderItems.productId, orderItems.productName)
      .orderBy(sql`SUM(${orderItems.quantity}) DESC`)
      .limit(5);

    return {
      totalOrders: totalOrdersResult?.count || 0,
      totalRevenue: parseFloat(totalRevenueResult?.total || "0"),
      totalProducts: totalProductsResult?.count || 0,
      totalClients: totalClientsResult?.count || 0,
      pendingComments: pendingCommentsResult?.count || 0,
      recentOrders,
      ordersByStatus: Object.fromEntries(
        ordersByStatus.map((o) => [o.status, o.count])
      ),
      revenueByMonth: revenueByMonth.map((r) => ({
        month: r.month,
        revenue: parseFloat(r.revenue),
      })),
      topProducts,
    };
  }
}
