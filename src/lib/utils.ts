import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("fr-SN", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function generateOrderNumber(): string {
  const prefix = "BO";
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${dateStr}-${random}`;
}

export function generateInvoiceNumber(): string {
  const prefix = "FAC";
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${dateStr}-${random}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getStatusColor(status: string): "default" | "primary" | "secondary" | "success" | "warning" | "danger" {
  const map: Record<string, any> = {
    en_attente: "warning",
    confirmee: "primary",
    en_preparation: "secondary",
    expediee: "primary",
    livree: "success",
    annulee: "danger",
    remboursee: "danger",
    payee: "success",
    echouee: "danger",
  };
  return map[status] || "default";
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    en_attente: "En attente",
    confirmee: "Confirmée",
    en_preparation: "En préparation",
    expediee: "Expédiée",
    livree: "Livrée",
    annulee: "Annulée",
    remboursee: "Remboursée",
    payee: "Payée",
    echouee: "Échouée",
  };
  return map[status] || status;
}

export function getProductTypeLabel(type: string): string {
  const map: Record<string, string> = {
    monture: "Monture",
    lunettes_soleil: "Lunettes de soleil",
    lunettes_vue: "Lunettes de vue",
    lunettes_ordonnance: "Lunettes sous ordonnance",
    lentilles: "Lentilles",
    accessoires: "Accessoires",
  };
  return map[type] || type;
}

export function getGenderLabel(gender: string): string {
  const map: Record<string, string> = {
    homme: "Homme",
    femme: "Femme",
    enfant: "Enfant",
    unisexe: "Unisexe",
  };
  return map[gender] || gender;
}

export function calculateDiscount(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (seconds < 60) return "il y a quelques secondes";
  if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)} h`;
  if (seconds < 2592000) return `il y a ${Math.floor(seconds / 86400)} j`;
  if (seconds < 31536000) return `il y a ${Math.floor(seconds / 2592000)} mois`;
  return `il y a ${Math.floor(seconds / 31536000)} ans`;
}
