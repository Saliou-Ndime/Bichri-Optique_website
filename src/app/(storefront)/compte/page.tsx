"use client";

import { useSession } from "next-auth/react";
import { useUserOrders } from "@/hooks/useApi";
import { formatPrice, getStatusColor, getStatusLabel, timeAgo } from "@/lib/utils";
import { Card, CardBody, Chip, Spinner } from "@heroui/react";
import { Package, Heart, MessageSquare, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function ComptePage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const { data: ordersData, isLoading } = useUserOrders(1);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-bichri-600 to-bichri-400 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold">
          Bonjour, {user?.firstName} ! 👋
        </h2>
        <p className="text-bichri-100 text-sm mt-1">
          Bienvenue dans votre espace personnel.
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: "/compte/commandes", icon: Package, label: "Commandes", count: ordersData?.total || 0 },
          { href: "/compte/likes", icon: Heart, label: "Favoris" },
          { href: "/compte/commentaires", icon: MessageSquare, label: "Avis" },
          { href: "/boutique", icon: ShoppingBag, label: "Boutique" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="hover:border-bichri-200 transition-colors border border-gray-100">
                <CardBody className="flex flex-col items-center gap-2 py-4">
                  <Icon size={24} className="text-bichri-500" />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  {"count" in item && (
                    <span className="text-xs text-gray-400">{item.count}</span>
                  )}
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent orders */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Commandes récentes</h3>
        {isLoading ? (
          <Spinner color="primary" />
        ) : ordersData?.data?.length ? (
          <div className="space-y-3">
            {ordersData.data.slice(0, 3).map((order: any) => (
              <Link key={order.id} href={`/compte/commandes`}>
                <Card className="hover:border-bichri-200 transition-colors border border-gray-100">
                  <CardBody className="flex flex-row items-center justify-between py-3 px-4">
                    <div>
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{timeAgo(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{formatPrice(Number(order.total))}</span>
                      <Chip size="sm" color={getStatusColor(order.status)} variant="flat">
                        {getStatusLabel(order.status)}
                      </Chip>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Aucune commande pour le moment.</p>
        )}
      </div>
    </div>
  );
}
