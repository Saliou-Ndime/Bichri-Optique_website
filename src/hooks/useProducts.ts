import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductFilters, PaginatedResponse, ProductWithRelations } from "@/types";

/**
 * Hook pour lister les produits avec filtres et pagination
 */
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error("Erreur lors du chargement des produits");
      return res.json() as Promise<PaginatedResponse<ProductWithRelations>>;
    },
  });
}

/**
 * Hook pour un produit par slug
 */
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) throw new Error("Produit non trouvé");
      return res.json() as Promise<ProductWithRelations>;
    },
    enabled: !!slug,
  });
}

/**
 * Hook pour les produits en vedette
 */
export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: async () => {
      const res = await fetch(`/api/products?isFeatured=true&limit=${limit}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json() as Promise<PaginatedResponse<ProductWithRelations>>;
    },
  });
}

/**
 * Hook pour les nouveaux arrivages
 */
export function useNewArrivals(limit = 8) {
  return useQuery({
    queryKey: ["products", "new", limit],
    queryFn: async () => {
      const res = await fetch(`/api/products?sortBy=newest&limit=${limit}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json() as Promise<PaginatedResponse<ProductWithRelations>>;
    },
  });
}

// ========== ADMIN HOOKS ==========

/**
 * Hook admin pour lister tous les produits
 */
export function useAdminProducts(page = 1, search?: string) {
  return useQuery({
    queryKey: ["admin", "products", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.append("search", search);
      const res = await fetch(`/api/admin/products?${params}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });
}

/**
 * Hook admin pour créer un produit
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur lors de la création");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

/**
 * Hook admin pour mettre à jour un produit
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

/**
 * Hook admin pour supprimer un produit
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
