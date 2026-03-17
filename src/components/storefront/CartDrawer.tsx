"use client";

import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Divider,
} from "@heroui/react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getItemCount } =
    useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push("/commande");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeCart}
      placement="center"
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        header: "border-b border-default-100",
        footer: "border-t border-default-100",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <ShoppingBag size={20} className="text-bichri-600" />
          <span>Mon Panier ({getItemCount()})</span>
        </ModalHeader>

        <ModalBody className="py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag size={48} className="text-default-200 mb-4" />
              <p className="text-default-500 font-medium">Votre panier est vide</p>
              <p className="text-default-400 text-sm mt-1">
                Découvrez notre collection de lunettes
              </p>
              <Button
                color="primary"
                variant="flat"
                className="mt-4"
                onPress={() => {
                  closeCart();
                  router.push("/boutique");
                }}
              >
                Voir la boutique
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "default"}`}
                  className="flex gap-3 p-3 rounded-xl bg-default-50 group"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    <Image
                      src={item.variant?.image || (item.product.images as string[])?.[0] || "/images/placeholder.jpg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.product.name}</p>
                    {item.variant?.name && (
                      <p className="text-xs text-default-400">{item.variant.name}</p>
                    )}
                    <p className="text-bichri-600 font-semibold text-sm mt-1">
                      {formatPrice(parseFloat(item.variant?.price ?? item.product.price))}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="min-w-7 h-7 w-7"
                        onPress={() =>
                          updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                        }
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="min-w-7 h-7 w-7"
                        onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        className="ml-auto min-w-7 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onPress={() => removeItem(item.productId)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ModalBody>

        {items.length > 0 && (
          <ModalFooter className="flex-col gap-3">
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-default-500">Sous-total</span>
                <span className="font-semibold">{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-default-500">Livraison</span>
                <span className="text-default-400">Calculée à la commande</span>
              </div>
              <Divider className="my-1" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-bichri-600">{formatPrice(getSubtotal())}</span>
              </div>
            </div>
            <Button
              color="primary"
              className="w-full bg-bichri-gradient font-semibold"
              size="lg"
              endContent={<ArrowRight size={18} />}
              onPress={handleCheckout}
            >
              Commander
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
