import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ============================================================
// CATEGORIES
// ============================================================

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });
}

export function useCategoriesWithCount() {
  return useQuery({
    queryKey: ["categories", "withCount"],
    queryFn: async () => {
      const res = await fetch("/api/categories?withCount=true");
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const res = await fetch(`/api/categories/${slug}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    enabled: !!slug,
  });
}

// ============================================================
// ORDERS
// ============================================================

export function useUserOrders(page = 1) {
  return useQuery({
    queryKey: ["orders", "user", page],
    queryFn: async () => {
      const res = await fetch(`/api/orders?page=${page}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur lors de la commande");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// Admin
export function useAdminOrders(page = 1, status?: string) {
  return useQuery({
    queryKey: ["admin", "orders", page, status],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (status) params.append("status", status);
      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

// ============================================================
// LIKES
// ============================================================

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUserLikes(page = 1) {
  return useQuery({
    queryKey: ["likes", "user", page],
    queryFn: async () => {
      const res = await fetch(`/api/likes?page=${page}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });
}

export function useUserLikedIds() {
  return useQuery({
    queryKey: ["likes", "ids"],
    queryFn: async () => {
      const res = await fetch("/api/likes?idsOnly=true");
      if (!res.ok) throw new Error("Erreur");
      return res.json() as Promise<string[]>;
    },
  });
}

// ============================================================
// COMMENTS
// ============================================================

export function useProductComments(productId: string) {
  return useQuery({
    queryKey: ["comments", productId],
    queryFn: async () => {
      const res = await fetch(`/api/comments/${productId}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    enabled: !!productId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { productId: string; content: string; rating?: number }) => {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.productId] });
    },
  });
}

export function useUserComments(page = 1) {
  return useQuery({
    queryKey: ["comments", "user", page],
    queryFn: async () => {
      const res = await fetch(`/api/comments?page=${page}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });
}

// Admin
export function useAdminComments(page = 1, approved?: boolean) {
  return useQuery({
    queryKey: ["admin", "comments", page, approved],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (approved !== undefined) params.append("approved", String(approved));
      const res = await fetch(`/api/admin/comments?${params}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });
}

export function useApproveComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "comments"] });
    },
  });
}

// ============================================================
// AUTH
// ============================================================

export function useRegister() {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    }) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur lors de l'inscription");
      }
      return res.json();
    },
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur");
      }
      return res.json();
    },
  });
}

// ============================================================
// ADMIN STATS
// ============================================================

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });
}

// ============================================================
// ADMIN CLIENTS
// ============================================================

export function useAdminClients(page = 1, search?: string) {
  return useQuery({
    queryKey: ["admin", "clients", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.append("search", search);
      const res = await fetch(`/api/admin/clients?${params}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });
}

// ============================================================
// ADMIN CATEGORIES
// ============================================================

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
