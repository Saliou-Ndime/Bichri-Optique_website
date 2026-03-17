"use client";

import { ProductWithRelations, PaginatedResponse } from "@/types";
import { ProductCard } from "./ProductCard";
import { Spinner, Button } from "@heroui/react";
import { PackageOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductGridProps {
  products?: PaginatedResponse<ProductWithRelations>;
  isLoading?: boolean;
  showPagination?: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function ProductGrid({
  products,
  isLoading,
  showPagination = true,
  currentPage = 1,
  onPageChange,
}: ProductGridProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" color="secondary" label="Chargement..." />
      </div>
    );
  }

  if (!products || products.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageOpen size={56} className="text-default-200 mb-4" />
        <h3 className="font-semibold text-lg text-default-600">Aucun produit trouvé</h3>
        <p className="text-default-400 text-sm mt-1">
          Essayez de modifier vos filtres ou explorez notre collection
        </p>
        <Button
          color="primary"
          variant="flat"
          className="mt-4"
          onPress={() => router.push("/boutique")}
        >
          Voir tout
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.data.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {showPagination && products.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <Button
            size="sm"
            variant="flat"
            isDisabled={currentPage <= 1}
            onPress={() => onPageChange?.(currentPage - 1)}
          >
            Précédent
          </Button>
          {Array.from({ length: Math.min(products.totalPages, 5) }, (_, i) => {
            const start = Math.max(1, currentPage - 2);
            const page = start + i;
            if (page > products.totalPages) return null;
            return (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? "solid" : "flat"}
                color={page === currentPage ? "primary" : "default"}
                className={page === currentPage ? "bg-bichri-gradient text-white" : ""}
                onPress={() => onPageChange?.(page)}
              >
                {page}
              </Button>
            );
          })}
          <Button
            size="sm"
            variant="flat"
            isDisabled={currentPage >= products.totalPages}
            onPress={() => onPageChange?.(currentPage + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
