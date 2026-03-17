"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { ProductFilters } from "@/components/storefront/ProductFilters";
import { useProducts } from "@/hooks/useProducts";
import { Spinner, Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { useState } from "react";
import type { ProductFilters as Filters } from "@/types";

function BoutiqueContent() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<Partial<Filters>>({});

  const filters: Filters = {
    search: searchParams.get("search") || undefined,
    type: searchParams.get("type") as any || undefined,
    gender: searchParams.get("gender") as any || undefined,
    categorySlug: searchParams.get("category") || undefined,
    brandSlug: searchParams.get("brand") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sortBy: (searchParams.get("sort") as any) || "newest",
    ...activeFilters,
    page,
    limit: 12,
  };

  const { data, isLoading } = useProducts(filters);

  const handleFilterChange = (changed: Partial<Filters>) => {
    setActiveFilters((prev) => ({ ...prev, ...changed }));
    setPage(1);
  };

  const handleReset = () => {
    setActiveFilters({});
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/">Accueil</BreadcrumbItem>
        <BreadcrumbItem>Boutique</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <ProductFilters filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
        </aside>

        {/* Products */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {filters.search
                ? `Résultats pour "${filters.search}"`
                : "Tous nos produits"}
            </h1>
            {data && (
              <span className="text-sm text-gray-500">
                {data.total} produit{data.total > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <ProductGrid
            products={data}
            isLoading={isLoading}
            currentPage={page}
            onPageChange={setPage}
          />
        </main>
      </div>
    </div>
  );
}

export default function BoutiquePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-32">
          <Spinner color="primary" size="lg" />
        </div>
      }
    >
      <BoutiqueContent />
    </Suspense>
  );
}
