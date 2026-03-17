"use client";

import { useState } from "react";
import { useAdminCategories, useCreateCategory, useUpdateCategory } from "@/hooks/useApi";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Input, Spinner, Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, useDisclosure, Textarea, Chip, Switch,
} from "@heroui/react";
import { Plus, Pencil, FolderOpen } from "lucide-react";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", image: "", isActive: true });

  const handleOpen = (cat?: any) => {
    if (cat) {
      setEditing(cat);
      setForm({ name: cat.name, description: cat.description || "", image: cat.image || "", isActive: cat.isActive });
    } else {
      setEditing(null);
      setForm({ name: "", description: "", image: "", isActive: true });
    }
    onOpen();
  };

  const handleSave = () => {
    if (!form.name) { toast.error("Le nom est requis"); return; }
    if (editing) {
      updateCategory.mutate({ id: editing.id, data: form }, {
        onSuccess: () => { toast.success("Catégorie modifiée"); onClose(); },
      });
    } else {
      createCategory.mutate(form, {
        onSuccess: () => { toast.success("Catégorie créée"); onClose(); },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
          <p className="text-sm text-gray-500">{categories?.length || 0} catégories</p>
        </div>
        <Button color="primary" radius="full" startContent={<Plus size={18} />} onPress={() => handleOpen()} className="bg-gradient-to-r from-bichri-700 to-bichri-500">
          Nouvelle catégorie
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner color="primary" /></div>
      ) : (
        <Table aria-label="Catégories" removeWrapper>
          <TableHeader>
            <TableColumn>Catégorie</TableColumn>
            <TableColumn>Slug</TableColumn>
            <TableColumn>Statut</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {(categories || []).map((cat: any) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <FolderOpen size={18} className="text-bichri-400" />
                    <span className="font-medium">{cat.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">{cat.slug}</TableCell>
                <TableCell>
                  <Chip size="sm" color={cat.isActive ? "success" : "default"} variant="flat">
                    {cat.isActive ? "Active" : "Inactive"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Button isIconOnly size="sm" variant="light" onPress={() => handleOpen(cat)}>
                    <Pencil size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader>{editing ? "Modifier la catégorie" : "Nouvelle catégorie"}</ModalHeader>
          <ModalBody className="space-y-4">
            <Input label="Nom" isRequired value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input label="Image URL" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} />
            <Textarea label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <Switch isSelected={form.isActive} onValueChange={(v) => setForm((f) => ({ ...f, isActive: v }))}>Active</Switch>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Annuler</Button>
            <Button color="primary" onPress={handleSave} isLoading={createCategory.isPending || updateCategory.isPending} className="bg-gradient-to-r from-bichri-700 to-bichri-500">
              {editing ? "Modifier" : "Créer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
