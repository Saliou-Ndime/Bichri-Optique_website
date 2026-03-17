"use client";

import { useState } from "react";
import { useUserLikes, useToggleLike } from "@/hooks/useApi";
import { formatPrice } from "@/lib/utils";
import { Card, CardBody, Spinner, Pagination, Button, Image } from "@heroui/react";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";

export default function MesLikesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUserLikes(page);
  const toggleLike = useToggleLike();
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Mes favoris</h2>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner color="primary" /></div>
      ) : !data?.data?.length ? (
        <div className="text-center py-12">
          <Heart size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">Aucun favori pour le moment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.data.map((like: any) => {
              const product = like.product;
              if (!product) return null;
              const images = (product.images as string[]) || [];
              return (
                <Card key={like.id} className="border border-gray-100">
                  <CardBody className="flex flex-row gap-4 p-3">
                    <Link href={`/boutique/${product.slug}`} className="shrink-0">
                      <div className="w-20 h-20 bg-bichri-50 rounded-lg overflow-hidden">
                        <img src={images[0] || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/boutique/${product.slug}`}>
                        <h3 className="font-medium text-sm truncate hover:text-bichri-600">{product.name}</h3>
                      </Link>
                      <p className="text-sm font-semibold text-bichri-600 mt-1">{formatPrice(Number(product.price))}</p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          radius="full"
                          startContent={<ShoppingBag size={14} />}
                          onPress={() => {
                            addItem(product, 1);
                            toast.success("Ajouté au panier");
                          }}
                        >
                          Panier
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          radius="full"
                          onPress={() => toggleLike.mutate(product.id)}
                        >
                          <Heart size={16} className="fill-current" />
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination total={data.totalPages} page={page} onChange={setPage} color="primary" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
