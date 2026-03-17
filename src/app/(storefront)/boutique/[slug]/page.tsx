"use client";

import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProducts";
import { useProductComments, useCreateComment, useToggleLike, useUserLikedIds } from "@/hooks/useApi";
import { useCartStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { formatPrice, calculateDiscount, getProductTypeLabel, getGenderLabel, timeAgo } from "@/lib/utils";
import {
  Spinner, Button, Chip, Breadcrumbs, BreadcrumbItem, Avatar, Textarea,
  Divider, Image, Tabs, Tab,
} from "@heroui/react";
import {
  ShoppingBag, Heart, Star, Minus, Plus, ChevronLeft, ChevronRight,
  Shield, Truck, RotateCcw, Eye,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: product, isLoading } = useProduct(slug);
  const { data: comments } = useProductComments(product?.id || "");
  const { data: session } = useSession();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleLikeMutation = useToggleLike();
  const createCommentMutation = useCreateComment();
  const { data: likedIds } = useUserLikedIds();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit introuvable</h1>
        <Button as={Link} href="/boutique" color="primary" variant="flat" radius="full">
          Retour à la boutique
        </Button>
      </div>
    );
  }

  const images = (product.images as string[]) || ["/placeholder.jpg"];
  const discount = calculateDiscount(Number(product.price), Number(product.comparePrice));
  const isLiked = likedIds?.includes(product.id);
  const avgRating = comments?.length
    ? (comments.reduce((a: number, c: any) => a + (c.rating || 0), 0) / comments.length).toFixed(1)
    : null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    openCart();
    toast.success("Ajouté au panier !");
  };

  const handleToggleLike = () => {
    if (!session?.user) {
      toast.error("Connectez-vous pour aimer un produit");
      return;
    }
    toggleLikeMutation.mutate(product.id);
  };

  const handleComment = () => {
    if (!session?.user) {
      toast.error("Connectez-vous pour commenter");
      return;
    }
    if (!comment.trim()) return;
    createCommentMutation.mutate(
      { productId: product.id, content: comment, rating },
      {
        onSuccess: () => {
          setComment("");
          toast.success("Commentaire envoyé ! Il sera visible après modération.");
        },
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/">Accueil</BreadcrumbItem>
        <BreadcrumbItem href="/boutique">Boutique</BreadcrumbItem>
        <BreadcrumbItem>{product.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gradient-to-br from-bichri-50 to-white rounded-2xl overflow-hidden border border-bichri-100/50">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              className="object-cover w-full h-full"
              removeWrapper
            />
            {discount > 0 && (
              <Chip
                color="danger"
                size="sm"
                className="absolute top-4 left-4 font-bold"
              >
                -{discount}%
              </Chip>
            )}
            {images.length > 1 && (
              <>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  radius="full"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur"
                  onPress={() => setSelectedImage((p) => (p === 0 ? images.length - 1 : p - 1))}
                >
                  <ChevronLeft size={18} />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  radius="full"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur"
                  onPress={() => setSelectedImage((p) => (p === images.length - 1 ? 0 : p + 1))}
                >
                  <ChevronRight size={18} />
                </Button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                    i === selectedImage
                      ? "border-bichri-500 ring-2 ring-bichri-200"
                      : "border-gray-200 hover:border-bichri-300"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.category && (
                <Chip size="sm" variant="flat" color="secondary">
                  {product.category.name}
                </Chip>
              )}
              <Chip size="sm" variant="flat">{getProductTypeLabel(product.type)}</Chip>
              {product.gender && <Chip size="sm" variant="flat">{getGenderLabel(product.gender)}</Chip>}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.brand && (
              <p className="text-sm text-gray-500">par <span className="font-medium text-bichri-600">{product.brand.name}</span></p>
            )}
          </div>

          {/* Rating & Views */}
          <div className="flex items-center gap-4">
            {avgRating && (
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="font-medium">{avgRating}</span>
                <span className="text-sm text-gray-500">({comments?.length} avis)</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Eye size={14} />
              <span>{product.viewCount} vues</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold gradient-text">{formatPrice(Number(product.price))}</span>
            {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(Number(product.comparePrice))}</span>
            )}
          </div>

          {/* Description */}
          {product.shortDescription && (
            <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Stock */}
          <div>
            {product.stock > 0 ? (
              <Chip color="success" variant="flat" size="sm">
                En stock ({product.stock} disponibles)
              </Chip>
            ) : (
              <Chip color="danger" variant="flat" size="sm">
                Rupture de stock
              </Chip>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-full">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="full"
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={16} />
              </Button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="full"
                onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              >
                <Plus size={16} />
              </Button>
            </div>

            <Button
              color="primary"
              size="lg"
              radius="full"
              className="flex-1 font-semibold bg-gradient-to-r from-bichri-700 to-bichri-500 shadow-lg shadow-bichri-200"
              startContent={<ShoppingBag size={20} />}
              isDisabled={product.stock === 0}
              onPress={handleAddToCart}
            >
              Ajouter au panier
            </Button>

            <Button
              isIconOnly
              size="lg"
              variant="flat"
              radius="full"
              className={isLiked ? "text-red-500 bg-red-50" : "text-gray-400"}
              onPress={handleToggleLike}
            >
              <Heart size={22} className={isLiked ? "fill-current" : ""} />
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck size={20} className="text-bichri-500" />
              <span className="text-xs text-gray-500">Livraison rapide</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Shield size={20} className="text-bichri-500" />
              <span className="text-xs text-gray-500">Garantie qualité</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <RotateCcw size={20} className="text-bichri-500" />
              <span className="text-xs text-gray-500">Retour 14 jours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specs, Comments */}
      <div className="mt-12">
        <Tabs
          aria-label="Informations produit"
          color="primary"
          variant="underlined"
          classNames={{ tabList: "gap-6", tab: "font-medium" }}
        >
          <Tab key="description" title="Description">
            <div className="py-6 prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap text-gray-600 leading-relaxed">
                {product.description || "Pas de description disponible."}
              </p>
            </div>
          </Tab>

          <Tab key="specs" title="Caractéristiques">
            <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Matériau", value: product.material },
                { label: "Forme", value: product.frameShape },
                { label: "Couleur monture", value: product.frameColor },
                { label: "Type de verre", value: product.lensType },
                { label: "Couleur verre", value: product.lensColor },
                { label: "Protection UV", value: product.uvProtection ? "Oui" : "Non" },
                { label: "Polarisé", value: product.polarized ? "Oui" : "Non" },
                { label: "SKU", value: product.sku },
              ]
                .filter((s) => s.value)
                .map((spec) => (
                  <div key={spec.label} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">{spec.label}</span>
                    <span className="text-sm font-medium text-gray-900">{spec.value}</span>
                  </div>
                ))}
            </div>
          </Tab>

          <Tab key="comments" title={`Avis (${comments?.length || 0})`}>
            <div className="py-6 space-y-6">
              {/* Add comment form */}
              <div className="bg-bichri-50/50 rounded-xl p-4 space-y-3 border border-bichri-100/50">
                <h3 className="font-medium text-gray-900">Laisser un avis</h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setRating(s)}>
                      <Star
                        size={20}
                        className={s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Partagez votre expérience avec ce produit..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  minRows={3}
                  classNames={{
                    inputWrapper: "bg-white border border-bichri-100",
                  }}
                />
                <Button
                  color="primary"
                  size="sm"
                  radius="full"
                  onPress={handleComment}
                  isLoading={createCommentMutation.isPending}
                >
                  Publier
                </Button>
              </div>

              {/* Comments list */}
              {comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((c: any) => (
                    <div key={c.id} className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar
                          size="sm"
                          name={(c.user?.firstName || "A")[0]}
                          color="primary"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {c.user?.firstName} {c.user?.lastName}
                          </p>
                          <p className="text-xs text-gray-400">{timeAgo(c.createdAt)}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              className={s <= (c.rating || 0) ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{c.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">Aucun avis pour le moment.</p>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
