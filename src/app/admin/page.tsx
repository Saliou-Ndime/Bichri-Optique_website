"use client";

import { useAdminStats } from "@/hooks/useApi";
import { formatPrice, getStatusColor, getStatusLabel, timeAgo } from "@/lib/utils";
import { Card, CardBody, CardHeader, Spinner, Chip } from "@heroui/react";
import {
  ShoppingCart, DollarSign, Package, Users, MessageSquare,
  TrendingUp, Clock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20"><Spinner color="primary" size="lg" /></div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Commandes", value: stats.totalOrders, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Revenu total", value: formatPrice(stats.totalRevenue || 0), icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Produits", value: stats.totalProducts, icon: Package, color: "text-bichri-600", bg: "bg-bichri-50" },
    { label: "Clients", value: stats.totalClients, icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500">Vue d&apos;ensemble de votre boutique</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border border-gray-100">
              <CardBody className="flex flex-row items-center gap-4 py-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon size={22} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Comments */}
        {stats.pendingComments > 0 && (
          <Card className="border border-amber-200 bg-amber-50/50">
            <CardBody className="flex flex-row items-center gap-3 py-3">
              <MessageSquare size={20} className="text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                {stats.pendingComments} commentaire{stats.pendingComments > 1 ? "s" : ""} en attente de modération
              </span>
            </CardBody>
          </Card>
        )}

        {/* Orders by Status */}
        {stats.ordersByStatus && (
          <Card className="border border-gray-100">
            <CardHeader className="pb-2">
              <h3 className="font-semibold text-gray-900">Commandes par statut</h3>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="flex flex-wrap gap-2">
                {stats.ordersByStatus.map((os: any) => (
                  <Chip key={os.status} variant="flat" color={getStatusColor(os.status)} size="sm">
                    {getStatusLabel(os.status)}: {os.count}
                  </Chip>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gray-400" />
              <h3 className="font-semibold text-gray-900">Commandes récentes</h3>
            </div>
          </CardHeader>
          <CardBody className="pt-0 space-y-2">
            {stats.recentOrders?.length ? (
              stats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{timeAgo(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{formatPrice(Number(order.total))}</span>
                    <Chip size="sm" variant="flat" color={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Chip>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">Aucune commande</p>
            )}
          </CardBody>
        </Card>

        {/* Top Products */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-gray-400" />
              <h3 className="font-semibold text-gray-900">Produits les plus vendus</h3>
            </div>
          </CardHeader>
          <CardBody className="pt-0 space-y-2">
            {stats.topProducts?.length ? (
              stats.topProducts.map((product: any, i: number) => (
                <div key={product.productId || i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-bichri-50 flex items-center justify-center text-xs font-bold text-bichri-600">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium truncate">{product.productName}</span>
                  </div>
                  <span className="text-sm text-gray-500">{product.totalSold} vendus</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">Aucune donnée</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Revenue by Month */}
      {stats.revenueByMonth?.length > 0 && (
        <Card className="border border-gray-100">
          <CardHeader className="pb-2">
            <h3 className="font-semibold text-gray-900">Revenu mensuel</h3>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="flex items-end gap-3 h-40">
              {stats.revenueByMonth.map((rm: any) => {
                const maxRevenue = Math.max(...stats.revenueByMonth.map((r: any) => r.revenue || 1));
                const height = ((rm.revenue || 0) / maxRevenue) * 100;
                return (
                  <div key={rm.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500 font-medium">
                      {formatPrice(rm.revenue || 0)}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-bichri-600 to-bichri-300 rounded-t-lg"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                    <span className="text-xs text-gray-400">{rm.month}</span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
