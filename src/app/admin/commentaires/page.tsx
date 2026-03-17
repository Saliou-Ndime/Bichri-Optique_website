"use client";

import { useState } from "react";
import { useAdminComments, useApproveComment } from "@/hooks/useApi";
import { timeAgo } from "@/lib/utils";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Chip, Spinner, Pagination, Button, Select, SelectItem, Avatar,
} from "@heroui/react";
import { Check, X, Star } from "lucide-react";
import { toast } from "sonner";

export default function AdminCommentairesPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>("");
  const approvedFilter = filter === "" ? undefined : filter === "true";
  const { data, isLoading } = useAdminComments(page, approvedFilter);
  const approveComment = useApproveComment();

  const handleApprove = (id: string) => {
    approveComment.mutate(
      { id, action: "approve" },
      { onSuccess: () => toast.success("Commentaire approuvé") }
    );
  };

  const handleReject = (id: string) => {
    approveComment.mutate(
      { id, action: "reject" },
      { onSuccess: () => toast.success("Commentaire rejeté") }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commentaires</h1>
          <p className="text-sm text-gray-500">{data?.total || 0} commentaires</p>
        </div>
        <Select
          label="Filtrer"
          className="max-w-[180px]"
          size="sm"
          selectedKeys={filter !== "" ? [filter] : []}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
        >
          <SelectItem key="false">En attente</SelectItem>
          <SelectItem key="true">Approuvés</SelectItem>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner color="primary" /></div>
      ) : (
        <>
          <Table aria-label="Commentaires" removeWrapper>
            <TableHeader>
              <TableColumn>Auteur</TableColumn>
              <TableColumn>Commentaire</TableColumn>
              <TableColumn>Note</TableColumn>
              <TableColumn>Statut</TableColumn>
              <TableColumn>Date</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {(data?.data || []).map((comment: any) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm" name={(comment.user?.firstName || "A")[0]} color="primary" />
                      <span className="text-sm font-medium">
                        {comment.user?.firstName} {comment.user?.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600 max-w-xs truncate">{comment.content}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className={s <= (comment.rating || 0) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" color={comment.isApproved ? "success" : "warning"} variant="flat">
                      {comment.isApproved ? "Approuvé" : "En attente"}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">{timeAgo(comment.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {!comment.isApproved && (
                        <Button isIconOnly size="sm" variant="flat" color="success" onPress={() => handleApprove(comment.id)}>
                          <Check size={16} />
                        </Button>
                      )}
                      <Button isIconOnly size="sm" variant="flat" color="danger" onPress={() => handleReject(comment.id)}>
                        <X size={16} />
                      </Button>
                    </div>
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
