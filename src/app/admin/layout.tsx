"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart, Users,
  MessageSquare, Settings, ArrowLeft,
} from "lucide-react";
import { Button } from "@heroui/react";

const adminLinks = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/categories", label: "Catégories", icon: FolderOpen },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/commentaires", label: "Commentaires", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const user = session?.user as any;

  if (status === "loading") return null;
  if (status === "unauthenticated" || user?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-4 border-b border-gray-100">
          <Logo size="sm" />
          <p className="text-xs text-bichri-500 font-medium mt-1">Administration</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-bichri-600 to-bichri-400 text-white shadow-md shadow-bichri-200"
                    : "text-gray-600 hover:bg-bichri-50 hover:text-bichri-700"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <Button
            as={Link}
            href="/"
            variant="light"
            fullWidth
            startContent={<ArrowLeft size={16} />}
            className="justify-start text-gray-500"
          >
            Retour au site
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
