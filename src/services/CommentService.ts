import { db } from "@/db";
import { comments, users } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";

export class CommentService {
  static async getByProductId(productId: string) {
    return db.query.comments.findMany({
      where: and(eq(comments.productId, productId), eq(comments.isApproved, true)),
      with: {
        user: true,
      },
      orderBy: [desc(comments.createdAt)],
    });
  }

  static async create(data: { userId: string; productId: string; content: string; rating?: number }) {
    const [comment] = await db
      .insert(comments)
      .values({
        userId: data.userId,
        productId: data.productId,
        content: data.content,
        rating: data.rating,
        isApproved: false, // Modération par défaut
      })
      .returning();
    return comment;
  }

  static async getByUserId(userId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [data, totalResult] = await Promise.all([
      db.query.comments.findMany({
        where: eq(comments.userId, userId),
        with: { product: true },
        orderBy: [desc(comments.createdAt)],
        limit,
        offset,
      }),
      db.select({ count: count() }).from(comments).where(eq(comments.userId, userId)),
    ]);

    return {
      data,
      total: totalResult[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count || 0) / limit),
    };
  }

  static async delete(id: string, userId: string) {
    await db
      .delete(comments)
      .where(and(eq(comments.id, id), eq(comments.userId, userId)));
  }

  // Admin methods
  static async getAll(page = 1, limit = 20, approved?: boolean) {
    const conditions: any[] = [];
    if (approved !== undefined) {
      conditions.push(eq(comments.isApproved, approved));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, totalResult] = await Promise.all([
      db.query.comments.findMany({
        where,
        with: { user: true, product: true },
        orderBy: [desc(comments.createdAt)],
        limit,
        offset: (page - 1) * limit,
      }),
      db.select({ count: count() }).from(comments).where(where),
    ]);

    return {
      data,
      total: totalResult[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count || 0) / limit),
    };
  }

  static async approve(id: string) {
    const [comment] = await db
      .update(comments)
      .set({ isApproved: true, updatedAt: new Date() })
      .where(eq(comments.id, id))
      .returning();
    return comment;
  }

  static async reject(id: string) {
    await db.delete(comments).where(eq(comments.id, id));
  }
}
