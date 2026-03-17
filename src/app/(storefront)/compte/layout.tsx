"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, MessageSquare, Settings } from "lucide-react";

const accountLinks = [
  { href: "/compte", label: "Mon compte", icon: User },
  { href: "/compte/commandes", label: "Mes commandes", icon: Package },
  { href: "/compte/likes", label: "Mes favoris", icon: Heart },
  { href: "/compte/commentaires", label: "Mes commentaires", icon: MessageSquare },
  { href: "/compte/parametres", label: "Paramètres", icon: Settings },
];

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "unauthenticated") {
    redirect("/auth/connexion");
  }

  if (status === "loading") {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon espace</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-56 shrink-0">
          <nav className="space-y-1 bg-white rounded-xl border border-gray-100 p-2">
            {accountLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-bichri-50 text-bichri-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
