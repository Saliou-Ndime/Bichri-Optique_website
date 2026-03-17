"use client";

import { useCategories } from "@/hooks/useApi";
import { PRODUCT_TYPES, GENDERS, FRAME_SHAPES, MATERIALS } from "@/lib/constants";
import {
  Accordion,
  AccordionItem,
  CheckboxGroup,
  Checkbox,
  Slider,
  Button,
  Chip,
} from "@heroui/react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductFilters as Filters } from "@/types";

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onReset: () => void;
}

export function ProductFilters({ filters, onFilterChange, onReset }: ProductFiltersProps) {
  const { data: categories } = useCategories();

  const activeCount = [
    filters.type,
    filters.gender,
    filters.categorySlug,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-bichri-600" />
          <h3 className="font-semibold">Filtres</h3>
          {activeCount > 0 && (
            <Chip size="sm" color="primary" variant="flat">
              {activeCount}
            </Chip>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            size="sm"
            variant="light"
            color="danger"
            startContent={<X size={14} />}
            onPress={onReset}
          >
            Réinitialiser
          </Button>
        )}
      </div>

      <Accordion
        selectionMode="multiple"
        defaultExpandedKeys={["categories", "types", "prix"]}
        className="px-0"
        itemClasses={{
          title: "text-sm font-medium",
          trigger: "py-3",
          content: "pb-4",
        }}
      >
        <AccordionItem key="categories" title="Catégories">
          <div className="space-y-2">
            {categories?.map((cat: { slug: string; name: string }) => (
              <Checkbox
                key={cat.slug}
                value={cat.slug}
                isSelected={filters.categorySlug === cat.slug}
                onValueChange={(checked) =>
                  onFilterChange({ categorySlug: checked ? cat.slug : undefined })
                }
                size="sm"
                color="secondary"
                classNames={{ label: "text-sm" }}
              >
                {cat.name}
              </Checkbox>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem key="types" title="Type de produit">
          <div className="space-y-2">
            {PRODUCT_TYPES.map((t) => (
              <Checkbox
                key={t.value}
                value={t.value}
                isSelected={filters.type === t.value}
                onValueChange={(checked) =>
                  onFilterChange({ type: checked ? t.value : undefined })
                }
                size="sm"
                color="secondary"
                classNames={{ label: "text-sm" }}
              >
                {t.label}
              </Checkbox>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem key="genre" title="Genre">
          <CheckboxGroup
            value={filters.gender ? [filters.gender] : []}
            onValueChange={(val) => onFilterChange({ gender: val[0] || undefined })}
            size="sm"
            color="secondary"
          >
            {GENDERS.map((g) => (
              <Checkbox key={g.value} value={g.value} classNames={{ label: "text-sm" }}>
                {g.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>

        <AccordionItem key="prix" title="Fourchette de prix">
          <div className="px-2">
            <Slider
              label="Prix (FCFA)"
              step={5000}
              minValue={0}
              maxValue={500000}
              value={[
                Number(filters.minPrice) || 0,
                Number(filters.maxPrice) || 500000,
              ]}
              onChange={(val) => {
                const [min, max] = val as number[];
                onFilterChange({
                  minPrice: min > 0 ? min : undefined,
                  maxPrice: max < 500000 ? max : undefined,
                });
              }}
              formatOptions={{ style: "currency", currency: "XOF", maximumFractionDigits: 0 }}
              className="max-w-full"
              classNames={{
                track: "bg-bichri-100",
                filler: "bg-bichri-gradient",
                thumb: "bg-bichri-600 border-bichri-600",
              }}
            />
          </div>
        </AccordionItem>

        <AccordionItem key="forme" title="Forme">
          <div className="space-y-2">
            {FRAME_SHAPES.map((s) => (
              <Checkbox
                key={s}
                value={s}
                size="sm"
                color="secondary"
                classNames={{ label: "text-sm" }}
              >
                {s}
              </Checkbox>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem key="materiau" title="Matériau">
          <div className="space-y-2">
            {MATERIALS.map((m) => (
              <Checkbox
                key={m}
                value={m}
                size="sm"
                color="secondary"
                classNames={{ label: "text-sm" }}
              >
                {m}
              </Checkbox>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
