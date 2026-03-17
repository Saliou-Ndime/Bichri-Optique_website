"use client";

import { useState } from "react";
import { useAdminClients } from "@/hooks/useApi";
import { timeAgo } from "@/lib/utils";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Avatar, Chip, Spinner, Pagination, Input, Button,
} from "@heroui/react";
import { Search, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";

export default function AdminClientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAdminClients(page, search);

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        toast.success(isActive ? "Client désactivé" : "Client activé");
        window.location.reload();
      }
    } catch {
      toast.error("Erreur");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="text-sm text-gray-500">{data?.total || 0} clients inscrits</p>
      </div>

      <Input
        placeholder="Rechercher un client..."
        startContent={<Search size={16} className="text-gray-400" />}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner color="primary" /></div>
      ) : (
        <>
          <Table aria-label="Clients" removeWrapper>
            <TableHeader>
              <TableColumn>Client</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Téléphone</TableColumn>
              <TableColumn>Ville</TableColumn>
              <TableColumn>Statut</TableColumn>
              <TableColumn>Inscrit</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {(data?.data || []).map((client: any) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" name={`${(client.firstName || "")[0]}${(client.lastName || "")[0]}`} color="primary" />
                      <span className="font-medium text-sm">{client.firstName} {client.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{client.email}</TableCell>
                  <TableCell className="text-sm text-gray-500">{client.phone || "—"}</TableCell>
                  <TableCell className="text-sm text-gray-500">{client.city || "—"}</TableCell>
                  <TableCell>
                    <Chip size="sm" color={client.isActive ? "success" : "danger"} variant="flat">
                      {client.isActive ? "Actif" : "Inactif"}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">{timeAgo(client.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color={client.isActive ? "danger" : "success"}
                      onPress={() => toggleActive(client.id, client.isActive)}
                    >
                      {client.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
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
    </div>
  );
}
