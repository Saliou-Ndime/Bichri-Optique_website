"use client";

import { useState } from "react";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/useApi";
import { formatPrice, getStatusColor, getStatusLabel, timeAgo } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Chip, Spinner, Pagination, Select, SelectItem, Modal, ModalContent,
  ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
} from "@heroui/react";
import { Eye } from "lucide-react";
import { toast } from "sonner";

export default function AdminCommandesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading } = useAdminOrders(page, statusFilter || undefined);
  const updateStatus = useUpdateOrderStatus();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");

  const handleView = (order: any) => {
    setSelected(order);
    setNewStatus(order.status);
    onOpen();
  };

  const handleUpdateStatus = () => {
    if (!selected || !newStatus) return;
    updateStatus.mutate(
      { id: selected.id, status: newStatus },
      { onSuccess: () => { toast.success("Statut mis à jour"); onClose(); } }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-sm text-gray-500">{data?.total || 0} commandes</p>
        </div>
        <Select
          label="Filtrer par statut"
          className="max-w-[200px]"
          size="sm"
          selectedKeys={statusFilter ? [statusFilter] : []}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          {ORDER_STATUSES.map((s) => <SelectItem key={s.value}>{s.label}</SelectItem>)}
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner color="primary" /></div>
      ) : (
        <>
          <Table aria-label="Commandes" removeWrapper>
            <TableHeader>
              <TableColumn>N° Commande</TableColumn>
              <TableColumn>Client</TableColumn>
              <TableColumn>Total</TableColumn>
              <TableColumn>Statut</TableColumn>
              <TableColumn>Paiement</TableColumn>
              <TableColumn>Date</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {(data?.data || []).map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{order.user?.firstName || order.guestName || "—"} {order.user?.lastName || ""}</p>
                      <p className="text-xs text-gray-400">{order.user?.email || order.guestEmail || order.guestPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{formatPrice(Number(order.total))}</TableCell>
                  <TableCell>
                    <Chip size="sm" color={getStatusColor(order.status)} variant="flat">
                      {getStatusLabel(order.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" color={order.paymentStatus === "payee" ? "success" : "warning"} variant="flat">
                      {order.paymentStatus === "payee" ? "Payée" : "En attente"}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{timeAgo(order.createdAt)}</TableCell>
                  <TableCell>
                    <Button isIconOnly size="sm" variant="light" onPress={() => handleView(order)}>
                      <Eye size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination total={data.totalPages} page={page} onChange={setPage} color="primary" />
            </div>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>Commande {selected?.orderNumber}</ModalHeader>
          <ModalBody className="space-y-4">
            {selected && (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Client</p>
                    <p className="font-medium">{selected.user?.firstName || selected.guestName} {selected.user?.lastName || ""}</p>
                    <p className="text-gray-400">{selected.user?.email || selected.guestEmail}</p>
                    <p className="text-gray-400">{selected.guestPhone || selected.shippingPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Livraison</p>
                    <p className="font-medium">{selected.shippingAddress}</p>
                    <p className="text-gray-400">{selected.shippingCity}, {selected.shippingCountry}</p>
                  </div>
                </div>

                {selected.items?.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Articles</p>
                    {selected.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50">
                        <div className="w-10 h-10 bg-bichri-50 rounded overflow-hidden">
                          <img src={item.productImage || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.productName}</p>
                          <p className="text-xs text-gray-400">×{item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium">{formatPrice(Number(item.totalPrice))}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span>Sous-total</span><span>{formatPrice(Number(selected.subtotal))}</span></div>
                  <div className="flex justify-between"><span>Livraison</span><span>{formatPrice(Number(selected.shippingCost))}</span></div>
                  {Number(selected.discount) > 0 && <div className="flex justify-between text-green-600"><span>Remise</span><span>-{formatPrice(Number(selected.discount))}</span></div>}
                  <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span>{formatPrice(Number(selected.total))}</span></div>
                </div>

                <Select
                  label="Changer le statut"
                  selectedKeys={[newStatus]}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {ORDER_STATUSES.map((s) => <SelectItem key={s.value}>{s.label}</SelectItem>)}
                </Select>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Fermer</Button>
            <Button color="primary" onPress={handleUpdateStatus} isLoading={updateStatus.isPending} className="bg-gradient-to-r from-bichri-700 to-bichri-500">
              Mettre à jour
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
