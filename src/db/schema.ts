import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// ENUMS
// ============================================================

export const userRoleEnum = pgEnum("user_role", ["client", "admin"]);

export const orderStatusEnum = pgEnum("order_status", [
  "en_attente",
  "confirmee",
  "en_preparation",
  "expediee",
  "livree",
  "annulee",
  "remboursee",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "en_attente",
  "payee",
  "echouee",
  "remboursee",
]);

export const productTypeEnum = pgEnum("product_type", [
  "monture",
  "lunettes_soleil",
  "lunettes_vue",
  "lunettes_ordonnance",
  "lentilles",
  "accessoires",
]);

export const genderEnum = pgEnum("gender_type", [
  "homme",
  "femme",
  "enfant",
  "unisexe",
]);

// ============================================================
// USERS
// ============================================================

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    avatar: text("avatar"),
    role: userRoleEnum("role").default("client").notNull(),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    country: varchar("country", { length: 100 }).default("Sénégal"),
    isActive: boolean("is_active").default(true).notNull(),
    emailVerified: timestamp("email_verified"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
  })
);

// ============================================================
// CATEGORIES
// ============================================================

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    description: text("description"),
    image: text("image"),
    parentId: uuid("parent_id"),
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("categories_slug_idx").on(table.slug),
    parentIdx: index("categories_parent_idx").on(table.parentId),
  })
);

// ============================================================
// BRANDS
// ============================================================

export const brands = pgTable("brands", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  logo: text("logo"),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================
// PRODUCTS
// ============================================================

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 280 }).notNull().unique(),
    description: text("description"),
    shortDescription: varchar("short_description", { length: 500 }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    comparePrice: decimal("compare_price", { precision: 10, scale: 2 }),
    sku: varchar("sku", { length: 50 }).unique(),
    stock: integer("stock").default(0).notNull(),
    categoryId: uuid("category_id").references(() => categories.id),
    brandId: uuid("brand_id").references(() => brands.id),
    type: productTypeEnum("type").notNull(),
    gender: genderEnum("gender").default("unisexe"),
    // Spécifications optiques
    material: varchar("material", { length: 100 }),
    frameShape: varchar("frame_shape", { length: 50 }),
    frameColor: varchar("frame_color", { length: 50 }),
    lensType: varchar("lens_type", { length: 100 }),
    lensColor: varchar("lens_color", { length: 50 }),
    uvProtection: boolean("uv_protection").default(false),
    polarized: boolean("polarized").default(false),
    // Métadonnées
    images: jsonb("images").$type<string[]>().default([]),
    tags: jsonb("tags").$type<string[]>().default([]),
    specifications: jsonb("specifications").$type<Record<string, string>>().default({}),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    viewCount: integer("view_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
    categoryIdx: index("products_category_idx").on(table.categoryId),
    brandIdx: index("products_brand_idx").on(table.brandId),
    typeIdx: index("products_type_idx").on(table.type),
    featuredIdx: index("products_featured_idx").on(table.isFeatured),
    priceIdx: index("products_price_idx").on(table.price),
  })
);

// ============================================================
// PRODUCT VARIANTS (tailles, couleurs...)
// ============================================================

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  sku: varchar("sku", { length: 50 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  stock: integer("stock").default(0).notNull(),
  color: varchar("color", { length: 50 }),
  size: varchar("size", { length: 20 }),
  image: text("image"),
  isActive: boolean("is_active").default(true).notNull(),
});

// ============================================================
// ORDERS
// ============================================================

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: varchar("order_number", { length: 30 }).notNull().unique(),
    userId: uuid("user_id").references(() => users.id),
    // Infos pour les commandes sans compte
    guestEmail: varchar("guest_email", { length: 255 }),
    guestPhone: varchar("guest_phone", { length: 20 }),
    guestName: varchar("guest_name", { length: 200 }),
    // Adresse de livraison
    shippingAddress: text("shipping_address").notNull(),
    shippingCity: varchar("shipping_city", { length: 100 }).notNull(),
    shippingCountry: varchar("shipping_country", { length: 100 }).default("Sénégal"),
    shippingPhone: varchar("shipping_phone", { length: 20 }).notNull(),
    // Montants
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default("0"),
    discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    // Statuts
    status: orderStatusEnum("status").default("en_attente").notNull(),
    paymentStatus: paymentStatusEnum("payment_status").default("en_attente").notNull(),
    paymentMethod: varchar("payment_method", { length: 50 }),
    // Notes
    notes: text("notes"),
    adminNotes: text("admin_notes"),
    // Ordonnance (pour lunettes de vue)
    prescriptionData: jsonb("prescription_data").$type<{
      oeilDroit?: { sphere?: string; cylindre?: string; axe?: string; addition?: string };
      oeilGauche?: { sphere?: string; cylindre?: string; axe?: string; addition?: string };
      ecartPupillaire?: string;
      fichierOrdonnance?: string;
    }>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("orders_user_idx").on(table.userId),
    statusIdx: index("orders_status_idx").on(table.status),
    orderNumberIdx: uniqueIndex("orders_number_idx").on(table.orderNumber),
  })
);

// ============================================================
// ORDER ITEMS
// ============================================================

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  variantId: uuid("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productImage: text("product_image"),
});

// ============================================================
// LIKES
// ============================================================

export const likes = pgTable(
  "likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userProductIdx: uniqueIndex("likes_user_product_idx").on(
      table.userId,
      table.productId
    ),
  })
);

// ============================================================
// COMMENTS / REVIEWS
// ============================================================

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    content: text("content").notNull(),
    rating: integer("rating"),
    isApproved: boolean("is_approved").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    productIdx: index("comments_product_idx").on(table.productId),
    userIdx: index("comments_user_idx").on(table.userId),
  })
);

// ============================================================
// INVOICES
// ============================================================

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  invoiceNumber: varchar("invoice_number", { length: 30 }).notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  pdfUrl: text("pdf_url"),
});

// ============================================================
// COUPONS
// ============================================================

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountType: varchar("discount_type", { length: 20 }).notNull(), // 'percentage' | 'fixed'
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================
// BANNERS (pour le carousel de la page d'accueil)
// ============================================================

export const banners = pgTable("banners", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  subtitle: text("subtitle"),
  image: text("image").notNull(),
  link: text("link"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================
// NEWSLETTER
// ============================================================

export const newsletter = pgTable("newsletter", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
});

// ============================================================
// RELATIONS
// ============================================================

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  likes: many(likes),
  comments: many(comments),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  products: many(products),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  variants: many(productVariants),
  orderItems: many(orderItems),
  likes: many(likes),
  comments: many(comments),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  invoice: one(invoices),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [likes.productId],
    references: [products.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [comments.productId],
    references: [products.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  order: one(orders, {
    fields: [invoices.orderId],
    references: [orders.id],
  }),
}));
