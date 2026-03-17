import { db } from "@/db";
import { likes, products } from "@/db/schema";
import { eq, and, count, desc } from "drizzle-orm";

export class LikeService {
  static async toggle(userId: string, productId: string) {
    const existing = await db.query.likes.findFirst({
      where: and(eq(likes.userId, userId), eq(likes.productId, productId)),
    });

    if (existing) {
      await db.delete(likes).where(eq(likes.id, existing.id));
      return { liked: false };
    }

    await db.insert(likes).values({ userId, productId });
    return { liked: true };
  }

  static async isLiked(userId: string, productId: string) {
    const existing = await db.query.likes.findFirst({
      where: and(eq(likes.userId, userId), eq(likes.productId, productId)),
    });
    return !!existing;
  }

  static async getUserLikes(userId: string, page = 1, limit = 12) {
    const offset = (page - 1) * limit;
    const [data, totalResult] = await Promise.all([
      db.query.likes.findMany({
        where: eq(likes.userId, userId),
        with: {
          product: {
            with: { category: true, brand: true },
          },
        },
        orderBy: [desc(likes.createdAt)],
        limit,
        offset,
      }),
      db.select({ count: count() }).from(likes).where(eq(likes.userId, userId)),
    ]);

    return {
      data: data.map((l) => l.product),
      total: totalResult[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count || 0) / limit),
    };
  }

  static async getProductLikeCount(productId: string) {
    const [result] = await db
      .select({ count: count() })
      .from(likes)
      .where(eq(likes.productId, productId));
    return result?.count || 0;
  }

  static async getUserLikedProductIds(userId: string) {
    const data = await db.query.likes.findMany({
      where: eq(likes.userId, userId),
      columns: { productId: true },
    });
    return data.map((l) => l.productId);
  }
}
