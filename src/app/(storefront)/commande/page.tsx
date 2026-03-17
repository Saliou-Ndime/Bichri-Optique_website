"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store";
import { useCreateOrder } from "@/hooks/useApi";
import { formatPrice } from "@/lib/utils";
import { Input, Button, Textarea, Breadcrumbs, BreadcrumbItem, RadioGroup, Radio } from "@heroui/react";
import { ShoppingBag, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CommandePage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const createOrder = useCreateOrder();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    shippingAddress: "",
    shippingCity: "Dakar",
    shippingCountry: "Sénégal",
    shippingPhone: "",
    notes: "",
  });

  const subtotal = getSubtotal();
  const shipping = subtotal > 50000 ? 0 : 3000;
  const total = subtotal + shipping;

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = () => {
    if (!user) {
      if (!form.guestPhone && !form.guestEmail) {
        toast.error("Veuillez fournir un email ou un numéro de téléphone");
        return;
      }
      if (!form.guestName) {
        toast.error("Veuillez fournir votre nom");
        return;
      }
    }
    if (!form.shippingAddress || !form.shippingCity) {
      toast.error("Veuillez remplir l'adresse de livraison");
      return;
    }

    const orderItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.variant?.price ?? item.product.price,
    }));

    createOrder.mutate(
      {
        items: orderItems,
        ...form,
        shippingPhone: form.shippingPhone || form.guestPhone,
        paymentMethod,
      },
      {
        onSuccess: (data: any) => {
          setOrderPlaced(true);
          setOrderNumber(data.orderNumber || "");
          clearCart();
        },
        onError: () => {
          toast.error("Erreur lors de la commande. Veuillez réessayer.");
        },
      }
    );
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-bichri-50 rounded-full flex items-center justify-center">
          <ShoppingBag size={40} className="text-bichri-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Panier vide</h1>
        <p className="text-gray-500 mb-6">Ajoutez des produits à votre panier avant de commander.</p>
        <Button as={Link} href="/boutique" color="primary" radius="full" className="bg-gradient-to-r from-bichri-700 to-bichri-500">
          Explorer la boutique
        </Button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
        <p className="text-gray-500 mb-2">
          Merci pour votre commande. Votre numéro de commande est :
        </p>
        <p className="text-xl font-bold gradient-text mb-6">{orderNumber}</p>
        <p className="text-sm text-gray-400 mb-8">
          Vous recevrez un email de confirmation avec les détails de votre commande.
        </p>
        <div className="flex gap-3 justify-center">
          <Button as={Link} href="/boutique" variant="flat" radius="full">
            Continuer mes achats
          </Button>
          {user && (
            <Button as={Link} href="/compte/commandes" color="primary" radius="full" className="bg-gradient-to-r from-bichri-700 to-bichri-500">
              Mes commandes
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/">Accueil</BreadcrumbItem>
        <BreadcrumbItem href="/panier">Panier</BreadcrumbItem>
        <BreadcrumbItem>Commande</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Info (if not logged in) */}
          {!user && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Vos informations</h2>
              <p className="text-sm text-gray-500">
                Pas de compte ? Pas de souci — renseignez au moins votre email ou téléphone.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nom complet"
                  isRequired
                  value={form.guestName}
                  onChange={(e) => handleChange("guestName", e.target.value)}
                />
                <Input
                  label="Téléphone"
                  type="tel"
                  value={form.guestPhone}
                  onChange={(e) => handleChange("guestPhone", e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  value={form.guestEmail}
                  onChange={(e) => handleChange("guestEmail", e.target.value)}
                  className="sm:col-span-2"
                />
              </div>
              <p className="text-xs text-gray-400">
                <Link href="/auth/connexion" className="text-bichri-600 hover:underline">
                  Se connecter
                </Link>{" "}
                pour un suivi plus facile de vos commandes.
              </p>
            </div>
          )}

          {/* Shipping Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Adresse de livraison</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label="Adresse"
                isRequired
                value={form.shippingAddress}
                onChange={(e) => handleChange("shippingAddress", e.target.value)}
                className="sm:col-span-2"
                minRows={2}
              />
              <Input
                label="Ville"
                isRequired
                value={form.shippingCity}
                onChange={(e) => handleChange("shippingCity", e.target.value)}
              />
              <Input
                label="Pays"
                value={form.shippingCountry}
                onChange={(e) => handleChange("shippingCountry", e.target.value)}
              />
              <Input
                label="Téléphone livraison"
                type="tel"
                value={form.shippingPhone}
                onChange={(e) => handleChange("shippingPhone", e.target.value)}
              />
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Mode de paiement</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <Radio value="cash" description="Payez à la réception de votre commande">
                Paiement à la livraison
              </Radio>
              <Radio value="wave" description="Paiement mobile via Wave">
                Wave
              </Radio>
              <Radio value="orange_money" description="Paiement mobile via Orange Money">
                Orange Money
              </Radio>
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Notes (optionnel)</h2>
            <Textarea
              placeholder="Instructions spéciales pour votre commande..."
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              minRows={2}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-b from-bichri-50/50 to-white rounded-2xl p-6 border border-bichri-100/50 sticky top-24 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Récapitulatif</h2>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="w-14 h-14 bg-bichri-50 rounded-lg overflow-hidden shrink-0">
                    <img src={(item.product.images as string[])?.[0] || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">×{item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(parseFloat(item.variant?.price ?? item.product.price) * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Livraison</span>
                <span>{shipping === 0 ? <span className="text-green-600">Gratuite</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold gradient-text">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              color="primary"
              size="lg"
              fullWidth
              radius="full"
              className="font-semibold bg-gradient-to-r from-bichri-700 to-bichri-500 shadow-lg shadow-bichri-200"
              onPress={handleSubmit}
              isLoading={createOrder.isPending}
            >
              Confirmer la commande
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
