import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, count, desc, ilike, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import type { NewUser, RegisterData } from "@/types";

export class UserService {
  static async register(data: RegisterData) {
    // Vérifier si l'email existe déjà
    const existing = await db.query.users.findFirst({
      where: eq(users.email, data.email.toLowerCase()),
    });
    if (existing) {
      throw new Error("Un compte existe déjà avec cet email");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const [user] = await db
      .insert(users)
      .values({
        email: data.email.toLowerCase(),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      })
      .returning();

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getById(id: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });
  }

  static async updateProfile(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      address?: string;
      city?: string;
      avatar?: string;
    }
  ) {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updatePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!user) throw new Error("Utilisateur non trouvé");

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new Error("Mot de passe actuel incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  // Admin methods
  static async getAll(page = 1, limit = 20, search?: string) {
    const conditions: any[] = [eq(users.role, "client")];
    if (search) {
      conditions.push(ilike(users.email, `%${search}%`));
    }

    const [data, totalResult] = await Promise.all([
      db.query.users.findMany({
        where: and(...conditions),
        orderBy: [desc(users.createdAt)],
        limit,
        offset: (page - 1) * limit,
      }),
      db.select({ count: count() }).from(users).where(and(...conditions)),
    ]);

    return {
      data: data.map(({ password, ...u }) => u),
      total: totalResult[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count || 0) / limit),
    };
  }

  static async toggleActive(id: string) {
    const user = await db.query.users.findFirst({ where: eq(users.id, id) });
    if (!user) throw new Error("Utilisateur non trouvé");

    const [updated] = await db
      .update(users)
      .set({ isActive: !user.isActive })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  static async getCount() {
    const [result] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "client"));
    return result?.count || 0;
  }
}
