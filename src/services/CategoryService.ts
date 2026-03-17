import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { eq, and, count, asc, desc, isNull } from "drizzle-orm";
import type { NewCategory } from "@/types";
import { slugify } from "@/lib/utils";

export class CategoryService {
  static async getAll(includeInactive = false) {
    const conditions = includeInactive ? undefined : eq(categories.isActive, true);
    return db.query.categories.findMany({
      where: conditions,
      orderBy: [asc(categories.sortOrder), asc(categories.name)],
    });
  }

  static async getRootCategories() {
    return db.query.categories.findMany({
      where: and(eq(categories.isActive, true), isNull(categories.parentId)),
      orderBy: [asc(categories.sortOrder)],
    });
  }

  static async getBySlug(slug: string) {
    return db.query.categories.findFirst({
      where: and(eq(categories.slug, slug), eq(categories.isActive, true)),
    });
  }

  static async getById(id: string) {
    return db.query.categories.findFirst({
      where: eq(categories.id, id),
    });
  }

  static async getWithProductCount() {
    const cats = await db.query.categories.findMany({
      where: eq(categories.isActive, true),
      orderBy: [asc(categories.sortOrder)],
    });

    return Promise.all(
      cats.map(async (cat) => {
        const [result] = await db
          .select({ count: count() })
          .from(products)
          .where(and(eq(products.categoryId, cat.id), eq(products.isActive, true)));
        return { ...cat, productCount: result?.count || 0 };
      })
    );
  }

  static async create(data: NewCategory) {
    const slug = slugify(data.name);
    const [category] = await db
      .insert(categories)
      .values({ ...data, slug })
      .returning();
    return category;
  }

  static async update(id: string, data: Partial<NewCategory>) {
    if (data.name) data.slug = slugify(data.name);
    const [category] = await db
      .update(categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  static async delete(id: string) {
    await db.update(categories).set({ isActive: false }).where(eq(categories.id, id));
  }
}
