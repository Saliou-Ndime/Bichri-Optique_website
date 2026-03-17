"use client";

import { useState } from "react";
import { useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { formatPrice, getProductTypeLabel } from "@/lib/utils";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Input, Chip, Spinner, Pagination, Modal, ModalContent,
  ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea, Select, SelectItem, Switch,
} from "@heroui/react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PRODUCT_TYPES, GENDERS, MATERIALS, FRAME_SHAPES } from "@/lib/constants";
import { useCategories } from "@/hooks/useApi";

const emptyProduct = {
  name: "", description: "", shortDescription: "", price: "", comparePrice: "",
  sku: "", stock: "0", type: "monture", gender: "unisexe", categoryId: "",
  material: "", frameShape: "", frameColor: "", lensType: "", lensColor: "",
  uvProtection: false, polarized: false, isFeatured: false, images: "[]", tags: "[]",
};

export default function AdminProduitsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAdminProducts(page, search);
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyProduct);

  const handleOpen = (product?: any) => {
    if (product) {
      setEditing(product);
      setForm({
        name: product.name || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        price: String(product.price || ""),
        comparePrice: String(product.comparePrice || ""),
        sku: product.sku || "",
        stock: String(product.stock || 0),
        type: product.type || "monture",
        gender: product.gender || "unisexe",
        categoryId: product.categoryId || "",
        material: product.material || "",
        frameShape: product.frameShape || "",
        frameColor: product.frameColor || "",
        lensType: product.lensType || "",
        lensColor: product.lensColor || "",
        uvProtection: product.uvProtection || false,
        polarized: product.polarized || false,
        isFeatured: product.isFeatured || false,
        images: JSON.stringify(product.images || []),
        tags: JSON.stringify(product.tags || []),
      });
    } else {
      setEditing(null);
      setForm(emptyProduct);
    }
    onOpen();
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.sku) {
      toast.error("Nom, prix et SKU sont requis");
      return;
    }
    const payload = {
      ...form,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
      stock: Number(form.stock),
      images: JSON.parse(form.images || "[]"),
      tags: JSON.parse(form.tags || "[]"),
      categoryId: form.categoryId || null,
    };

    if (editing) {
      updateProduct.mutate(
        { id: editing.id, data: payload },
        { onSuccess: () => { toast.success("Produit modifié"); onClose(); } }
      );
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => { toast.success("Produit créé"); onClose(); },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce produit ?")) {
      deleteProduct.mutate(id, {
        onSuccess: () => toast.success("Produit supprimé"),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-sm text-gray-500">{data?.total || 0} produits au total</p>
        </div>
        <Button
          color="primary"
          radius="full"
          startContent={<Plus size={18} />}
          onPress={() => handleOpen()}
          className="bg-gradient-to-r from-bichri-700 to-bichri-500"
        >
          Nouveau produit
        </Button>
      </div>

      <Input
        placeholder="Rechercher un produit..."
        startContent={<Search size={16} className="text-gray-400" />}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner color="primary" /></div>
      ) : (
        <>
          <Table aria-label="Produits" removeWrapper>
            <TableHeader>
              <TableColumn>Produit</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Prix</TableColumn>
              <TableColumn>Stock</TableColumn>
              <TableColumn>Statut</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {(data?.data || []).map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-bichri-50 rounded-lg overflow-hidden shrink-0">
                        <img src={(product.images as string[])?.[0] || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.sku}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat">{getProductTypeLabel(product.type)}</Chip>
                  </TableCell>
                  <TableCell className="font-medium">{formatPrice(Number(product.price))}</TableCell>
                  <TableCell>
                    <Chip size="sm" color={product.stock > 0 ? "success" : "danger"} variant="flat">
                      {product.stock}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" color={product.isFeatured ? "primary" : "default"} variant="flat">
                      {product.isFeatured ? "Mis en avant" : "Normal"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button isIconOnly size="sm" variant="light" onPress={() => handleOpen(product)}>
                        <Pencil size={16} />
                      </Button>
                      <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(product.id)}>
                        <Trash2 size={16} />
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

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>{editing ? "Modifier le produit" : "Nouveau produit"}</ModalHeader>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nom" isRequired value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              <Input label="SKU" isRequired value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} />
              <Input label="Prix (FCFA)" type="number" isRequired value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
              <Input label="Ancien prix" type="number" value={form.comparePrice} onChange={(e) => setForm((f) => ({ ...f, comparePrice: e.target.value }))} />
              <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
              <Select label="Type" selectedKeys={[form.type]} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                {PRODUCT_TYPES.map((t) => <SelectItem key={t.value}>{t.label}</SelectItem>)}
              </Select>
              <Select label="Genre" selectedKeys={[form.gender]} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}>
                {GENDERS.map((g) => <SelectItem key={g.value}>{g.label}</SelectItem>)}
              </Select>
              <Select label="Catégorie" selectedKeys={form.categoryId ? [form.categoryId] : []} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
                {(categories || []).map((c: any) => <SelectItem key={c.id}>{c.name}</SelectItem>)}
              </Select>
              <Input label="Matériau" value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))} />
              <Input label="Forme monture" value={form.frameShape} onChange={(e) => setForm((f) => ({ ...f, frameShape: e.target.value }))} />
              <Input label="Couleur monture" value={form.frameColor} onChange={(e) => setForm((f) => ({ ...f, frameColor: e.target.value }))} />
              <Input label="Type de verre" value={form.lensType} onChange={(e) => setForm((f) => ({ ...f, lensType: e.target.value }))} />
            </div>
            <Input
              label="Images (JSON array d'URLs)"
              value={form.images}
              onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
              description='Ex: ["https://...jpg", "https://...jpg"]'
            />
            <Textarea label="Description courte" value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} />
            <Textarea label="Description complète" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} minRows={3} />
            <div className="flex gap-6">
              <Switch isSelected={form.uvProtection as boolean} onValueChange={(v) => setForm((f) => ({ ...f, uvProtection: v }))}>Protection UV</Switch>
              <Switch isSelected={form.polarized as boolean} onValueChange={(v) => setForm((f) => ({ ...f, polarized: v }))}>Polarisé</Switch>
              <Switch isSelected={form.isFeatured as boolean} onValueChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))}>Mis en avant</Switch>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Annuler</Button>
            <Button
              color="primary"
              onPress={handleSave}
              isLoading={createProduct.isPending || updateProduct.isPending}
              className="bg-gradient-to-r from-bichri-700 to-bichri-500"
            >
              {editing ? "Modifier" : "Créer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
