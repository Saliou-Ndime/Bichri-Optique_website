"use client";

import { useState } from "react";
import { useUserComments } from "@/hooks/useApi";
import { timeAgo } from "@/lib/utils";
import { Card, CardBody, Chip, Spinner, Pagination } from "@heroui/react";
import { Star, MessageSquare } from "lucide-react";

export default function MesCommentairesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUserComments(page);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Mes commentaires</h2>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner color="primary" /></div>
      ) : !data?.data?.length ? (
        <div className="text-center py-12">
          <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">Aucun commentaire pour le moment.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data.data.map((comment: any) => (
              <Card key={comment.id} className="border border-gray-100">
                <CardBody className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className={s <= (comment.rating || 0) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color={comment.isApproved ? "success" : "warning"}>
                        {comment.isApproved ? "Approuvé" : "En attente"}
                      </Chip>
                      <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{comment.content}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination total={data.totalPages} page={page} onChange={setPage} color="primary" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
