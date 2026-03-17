"use client";

import { ProductWithRelations } from "@/types";
import { Card, CardBody, CardFooter, Button, Chip, Image } from "@heroui/react";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { formatPrice, calculateDiscount, getProductTypeLabel } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { useToggleLike, useUserLikedIds } from "@/hooks/useApi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: ProductWithRelations;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { data: session } = useSession();
  const { addItem } = useCartStore();
  const router = useRouter();
  const toggleLike = useToggleLike();
  const { data: likedIds } = useUserLikedIds();
  const [imageLoaded, setImageLoaded] = useState(false);

  const isLiked = likedIds?.includes(product.id);
  const discount = calculateDiscount(Number(product.price), Number(product.comparePrice));
  const mainImage =
    product.images && product.images.length > 0
      ? (product.images as string[])[0]
      : "/images/placeholder.jpg";

  const avgRating =
    product.comments && product.comments.length > 0
      ? product.comments.reduce((sum: number, c: { rating: number | null }) => sum + (c.rating || 0), 0) /
        product.comments.length
      : 0;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      toast.error("Connectez-vous pour aimer un produit");
      return;
    }
    toggleLike.mutate(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    toast.success("Ajouté au panier !");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card
        isPressable
        onPress={() => router.push(`/boutique/${product.slug}`)}
        className="product-card border-none bg-white overflow-hidden group"
        shadow="sm"
      >
        <CardBody className="p-0 overflow-hidden">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-bichri-50 to-white">
            <Image
              src={mainImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImageLoaded(true)}
              removeWrapper
            />
            {!imageLoaded && (
              <div className="absolute inset-0 shimmer rounded-lg" />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {discount > 0 && (
                <Chip size="sm" color="danger" variant="flat" className="font-semibold">
                  -{discount}%
                </Chip>
              )}
              {product.isFeatured && (
                <Chip size="sm" className="bg-bichri-gradient text-white font-medium">
                  Vedette
                </Chip>
              )}
            </div>

            {/* Like button */}
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              className={`absolute top-3 right-3 z-10 min-w-8 w-8 h-8 backdrop-blur-md ${
                isLiked
                  ? "bg-red-100 text-red-500"
                  : "bg-white/80 text-default-500 hover:text-red-500"
              }`}
              onPress={(e) => handleLike(e as unknown as React.MouseEvent)}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
            </Button>

            {/* Hover actions */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex gap-2 justify-center">
              <Button
                size="sm"
                variant="flat"
                className="bg-white/90 text-bichri-700 font-medium"
                startContent={<Eye size={14} />}
                onPress={() => router.push(`/boutique/${product.slug}`)}
              >
                Voir
              </Button>
              <Button
                size="sm"
                className="bg-bichri-gradient text-white font-medium"
                startContent={<ShoppingCart size={14} />}
                onPress={(e) => handleAddToCart(e as unknown as React.MouseEvent)}
              >
                Ajouter
              </Button>
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex-col items-start p-4 gap-1.5">
          {/* Category */}
          <p className="text-[11px] font-medium text-bichri-500 uppercase tracking-wide">
            {product.category?.name || getProductTypeLabel(product.type)}
          </p>

          {/* Name */}
          <h3 className="font-semibold text-sm line-clamp-1 text-default-800">
            {product.name}
          </h3>

          {/* Rating */}
          {avgRating > 0 && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-default-200"}
                />
              ))}
              <span className="text-[11px] text-default-400 ml-1">
                ({product._count?.comments || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-bichri-700">{formatPrice(product.price)}</span>
            {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
              <span className="text-xs text-default-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Stock */}
          {product.stock <= 3 && product.stock > 0 && (
            <p className="text-[11px] text-warning-600 font-medium">
              Plus que {product.stock} en stock
            </p>
          )}
          {product.stock === 0 && (
            <Chip size="sm" variant="flat" color="danger" className="mt-1">
              Rupture de stock
            </Chip>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
