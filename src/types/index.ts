import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type {
  users,
  categories,
  brands,
  products,
  productVariants,
  orders,
  orderItems,
  likes,
  comments,
  invoices,
  coupons,
  banners,
} from "@/db/schema";

// ============================================================
// Model Types (SELECT)
// ============================================================

export type User = InferSelectModel<typeof users>;
export type Category = InferSelectModel<typeof categories>;
export type Brand = InferSelectModel<typeof brands>;
export type Product = InferSelectModel<typeof products>;
export type ProductVariant = InferSelectModel<typeof productVariants>;
export type Order = InferSelectModel<typeof orders>;
export type OrderItem = InferSelectModel<typeof orderItems>;
export type Like = InferSelectModel<typeof likes>;
export type Comment = InferSelectModel<typeof comments>;
export type Invoice = InferSelectModel<typeof invoices>;
export type Coupon = InferSelectModel<typeof coupons>;
export type Banner = InferSelectModel<typeof banners>;

// ============================================================
// Insert Types
// ============================================================

export type NewUser = InferInsertModel<typeof users>;
export type NewCategory = InferInsertModel<typeof categories>;
export type NewBrand = InferInsertModel<typeof brands>;
export type NewProduct = InferInsertModel<typeof products>;
export type NewProductVariant = InferInsertModel<typeof productVariants>;
export type NewOrder = InferInsertModel<typeof orders>;
export type NewOrderItem = InferInsertModel<typeof orderItems>;
export type NewLike = InferInsertModel<typeof likes>;
export type NewComment = InferInsertModel<typeof comments>;
export type NewInvoice = InferInsertModel<typeof invoices>;
export type NewCoupon = InferInsertModel<typeof coupons>;
export type NewBanner = InferInsertModel<typeof banners>;

// ============================================================
// Extended / Join Types
// ============================================================

export type ProductWithRelations = Product & {
  category?: Category | null;
  brand?: Brand | null;
  variants?: ProductVariant[];
  likes?: Like[];
  comments?: CommentWithUser[];
  _count?: {
    likes: number;
    comments: number;
  };
};

export type CommentWithUser = Comment & {
  user: Pick<User, "id" | "firstName" | "lastName" | "avatar">;
};

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product?: Product;
  })[];
  user?: User | null;
  invoice?: Invoice | null;
};

// ============================================================
// Request / Response Types
// ============================================================

export type ProductFilters = {
  categorySlug?: string;
  brandSlug?: string;
  type?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular" | "name";
  page?: number;
  limit?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
};

export type CheckoutData = {
  items: CartItem[];
  shippingAddress: string;
  shippingCity: string;
  shippingPhone: string;
  shippingCountry?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestName?: string;
  notes?: string;
  couponCode?: string;
  prescriptionData?: Order["prescriptionData"];
  paymentMethod?: string;
};

export type DashboardStats = {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalClients: number;
  recentOrders: OrderWithItems[];
  topProducts: (Product & { totalSold: number })[];
  ordersByStatus: Record<string, number>;
  revenueByMonth: { month: string; revenue: number }[];
};

// ============================================================
// Auth Types
// ============================================================

export type AuthUser = Pick<
  User,
  "id" | "email" | "firstName" | "lastName" | "role" | "avatar"
>;

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

// ============================================================
// API Response
// ============================================================

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
