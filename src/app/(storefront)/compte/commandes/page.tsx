"use client";

import { useState } from "react";
import { useUserOrders } from "@/hooks/useApi";
import { formatPrice, getStatusColor, getStatusLabel, timeAgo } from "@/lib/utils";
import { Card, CardBody, Chip, Spinner, Pagination } from "@heroui/react";

export default function MesCommandesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUserOrders(page);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Mes commandes</h2>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner color="primary" /></div>
      ) : !data?.data?.length ? (
        <p className="text-gray-400 text-center py-12">Aucune commande pour le moment.</p>
      ) : (
        <>
          <div className="space-y-3">
            {data.data.map((order: any) => (
              <Card key={order.id} className="border border-gray-100">
                <CardBody className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{timeAgo(order.createdAt)}</p>
                    </div>
                    <Chip size="sm" color={getStatusColor(order.status)} variant="flat">
                      {getStatusLabel(order.status)}
                    </Chip>
                  </div>

                  {order.items && (
                    <div className="flex gap-2 overflow-x-auto">
                      {order.items.slice(0, 4).map((item: any) => (
                        <div key={item.id} className="w-14 h-14 bg-bichri-50 rounded-lg shrink-0 overflow-hidden">
                          <img src={item.productImage || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <span className="text-sm text-gray-500">
                      {order.items?.length || 0} article{(order.items?.length || 0) > 1 ? "s" : ""}
                    </span>
                    <span className="font-bold text-bichri-600">{formatPrice(Number(order.total))}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                total={data.totalPages}
                page={page}
                onChange={setPage}
                color="primary"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
