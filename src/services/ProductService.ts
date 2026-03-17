import { db } from "@/db";
import {
  products,
  categories,
  brands,
  likes,
  comments,
  users,
  productVariants,
} from "@/db/schema";
import {
  eq,
  and,
  like,
  gte,
  lte,
  desc,
  asc,
  sql,
  count,
  ilike,
  inArray,
} from "drizzle-orm";
import type {
  ProductFilters,
  PaginatedResponse,
  ProductWithRelations,
  NewProduct,
} from "@/types";
import { slugify } from "@/lib/utils";

export class ProductService {
  /**
   * Liste paginée de produits avec filtres
   */
  static async getProducts(
    filters: ProductFilters = {}
  ): Promise<PaginatedResponse<ProductWithRelations>> {
    const {
      categorySlug,
      brandSlug,
      type,
      gender,
      minPrice,
      maxPrice,
      search,
      isFeatured,
      sortBy = "newest",
      page = 1,
      limit = 12,
    } = filters;

    const conditions = [eq(products.isActive, true)];

    if (type) conditions.push(eq(products.type, type as any));
    if (gender) conditions.push(eq(products.gender, gender as any));
    if (minPrice) conditions.push(gte(products.price, String(minPrice)));
    if (maxPrice) conditions.push(lte(products.price, String(maxPrice)));
    if (isFeatured) conditions.push(eq(products.isFeatured, true));
    if (search) conditions.push(ilike(products.name, `%${search}%`));

    // Filtre par catégorie
    if (categorySlug) {
      const category = await db.query.categories.findFirst({
        where: eq(categories.slug, categorySlug),
      });
      if (category) {
        conditions.push(eq(products.categoryId, category.id));
      }
    }

    // Filtre par marque
    if (brandSlug) {
      const brand = await db.query.brands.findFirst({
        where: eq(brands.slug, brandSlug),
      });
      if (brand) {
        conditions.push(eq(products.brandId, brand.id));
      }
    }

    // Tri
    let orderBy: any;
    switch (sortBy) {
      case "price_asc":
        orderBy = asc(products.price);
        break;
      case "price_desc":
        orderBy = desc(products.price);
        break;
      case "popular":
        orderBy = desc(products.viewCount);
        break;
      case "name":
        orderBy = asc(products.name);
        break;
      default:
        orderBy = desc(products.createdAt);
    }

    const offset = (page - 1) * limit;

    const [data, totalResult] = await Promise.all([
      db.query.products.findMany({
        where: and(...conditions),
        with: {
          category: true,
          brand: true,
          variants: true,
        },
        orderBy: [orderBy],
        limit,
        offset,
      }),
      db
        .select({ count: count() })
        .from(products)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.count || 0;

    // Ajouter les compteurs de likes et commentaires
    const enrichedData = await Promise.all(
      data.map(async (product) => {
        const [likesCount, commentsCount] = await Promise.all([
          db.select({ count: count() }).from(likes).where(eq(likes.productId, product.id)),
          db
            .select({ count: count() })
            .from(comments)
            .where(
              and(eq(comments.productId, product.id), eq(comments.isApproved, true))
            ),
        ]);

        return {
          ...product,
          _count: {
            likes: likesCount[0]?.count || 0,
            comments: commentsCount[0]?.count || 0,
          },
        } as ProductWithRelations;
      })
    );

    return {
      data: enrichedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Produit par slug
   */
  static async getBySlug(slug: string): Promise<ProductWithRelations | null> {
    const product = await db.query.products.findFirst({
      where: and(eq(products.slug, slug), eq(products.isActive, true)),
      with: {
        category: true,
        brand: true,
        variants: {
          where: eq(productVariants.isActive, true),
        },
        comments: {
          where: eq(comments.isApproved, true),
          with: {
            user: true,
          },
          orderBy: [desc(comments.createdAt)],
        },
      },
    });

    if (!product) return null;

    // Incrémenter le compteur de vues
    await db
      .update(products)
      .set({ viewCount: sql`${products.viewCount} + 1` })
      .where(eq(products.id, product.id));

    const [likesCount, commentsCount] = await Promise.all([
      db.select({ count: count() }).from(likes).where(eq(likes.productId, product.id)),
      db
        .select({ count: count() })
        .from(comments)
        .where(and(eq(comments.productId, product.id), eq(comments.isApproved, true))),
    ]);

    return {
      ...product,
      _count: {
        likes: likesCount[0]?.count || 0,
        comments: commentsCount[0]?.count || 0,
      },
    } as ProductWithRelations;
  }

  /**
   * Produit par ID
   */
  static async getById(id: string) {
    return db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        category: true,
        brand: true,
        variants: true,
      },
    });
  }

  /**
   * Produits en vedette
   */
  static async getFeatured(limit = 8) {
    return db.query.products.findMany({
      where: and(eq(products.isActive, true), eq(products.isFeatured, true)),
      with: { category: true, brand: true },
      orderBy: [desc(products.createdAt)],
      limit,
    });
  }

  /**
   * Nouveaux arrivages
   */
  static async getNewArrivals(limit = 8) {
    return db.query.products.findMany({
      where: eq(products.isActive, true),
      with: { category: true, brand: true },
      orderBy: [desc(products.createdAt)],
      limit,
    });
  }

  /**
   * Produits similaires
   */
  static async getSimilar(productId: string, categoryId: string | null, limit = 4) {
    const conditions = [eq(products.isActive, true)];
    if (categoryId) conditions.push(eq(products.categoryId, categoryId));

    const result = await db.query.products.findMany({
      where: and(...conditions),
      with: { category: true, brand: true },
      limit: limit + 1,
    });

    return result.filter((p) => p.id !== productId).slice(0, limit);
  }

  /**
   * Créer un produit (admin)
   */
  static async create(data: NewProduct) {
    const slug = slugify(data.name);
    const [product] = await db
      .insert(products)
      .values({ ...data, slug })
      .returning();
    return product;
  }

  /**
   * Mettre à jour un produit (admin)
   */
  static async update(id: string, data: Partial<NewProduct>) {
    if (data.name) {
      data.slug = slugify(data.name);
    }
    const [product] = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  /**
   * Supprimer un produit (admin - soft delete)
   */
  static async delete(id: string) {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  /**
   * Tous les produits (admin)
   */
  static async getAllAdmin(page = 1, limit = 20, search?: string) {
    const conditions: any[] = [];
    if (search) conditions.push(ilike(products.name, `%${search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, totalResult] = await Promise.all([
      db.query.products.findMany({
        where,
        with: { category: true, brand: true },
        orderBy: [desc(products.createdAt)],
        limit,
        offset: (page - 1) * limit,
      }),
      db.select({ count: count() }).from(products).where(where),
    ]);

    return {
      data,
      total: totalResult[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count || 0) / limit),
    };
  }
}
