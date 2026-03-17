"use client";

import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { Button, Image, Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PanierPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = getSubtotal();
  const shipping = subtotal > 50000 ? 0 : 3000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-bichri-50 rounded-full flex items-center justify-center">
          <ShoppingBag size={40} className="text-bichri-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
        <p className="text-gray-500 mb-6">Découvrez nos collections et trouvez vos lunettes idéales.</p>
        <Button
          as={Link}
          href="/boutique"
          color="primary"
          radius="full"
          size="lg"
          className="font-semibold bg-gradient-to-r from-bichri-700 to-bichri-500"
        >
          Explorer la boutique
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/">Accueil</BreadcrumbItem>
        <BreadcrumbItem>Panier</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Mon panier ({items.length} article{items.length > 1 ? "s" : ""})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
            >
              <Link href={`/boutique/${item.product.slug}`} className="shrink-0">
                <div className="w-24 h-24 bg-bichri-50 rounded-lg overflow-hidden">
                  <img
                    src={(item.product.images as string[])?.[0] || "/placeholder.jpg"}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/boutique/${item.product.slug}`}>
                  <h3 className="font-medium text-gray-900 truncate hover:text-bichri-600 transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-sm text-bichri-600 font-semibold mt-1">
                  {formatPrice(parseFloat(item.variant?.price ?? item.product.price))}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-full">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      radius="full"
                      onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      radius="full"
                      onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      {formatPrice(parseFloat(item.variant?.price ?? item.product.price) * item.quantity)}
                    </span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      radius="full"
                      onPress={() => removeItem(item.productId)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="light"
            color="danger"
            size="sm"
            onPress={clearCart}
          >
            Vider le panier
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-b from-bichri-50/50 to-white rounded-2xl p-6 border border-bichri-100/50 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Livraison</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Gratuite</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-bichri-500">
                  Livraison gratuite à partir de {formatPrice(50000)}
                </p>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold gradient-text">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              as={Link}
              href="/commande"
              color="primary"
              size="lg"
              fullWidth
              radius="full"
              className="mt-6 font-semibold bg-gradient-to-r from-bichri-700 to-bichri-500 shadow-lg shadow-bichri-200"
              endContent={<ArrowRight size={18} />}
            >
              Commander
            </Button>

            <Button
              as={Link}
              href="/boutique"
              variant="light"
              fullWidth
              className="mt-2 text-gray-500"
            >
              Continuer mes achats
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
