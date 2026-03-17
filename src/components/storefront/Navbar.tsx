"use client";

import { useState } from "react";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Badge,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Kbd,
} from "@heroui/react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { Logo } from "@/components/shared/Logo";
import { NAV_LINKS } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  LogOut,
  Package,
  Settings,
  MessageSquare,
  LayoutDashboard,
  Menu,
} from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const cartCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);

  const user = session?.user as any;
  const isAdmin = user?.role === "admin";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/boutique?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <HeroNavbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="2xl"
      className="bg-white/80 backdrop-blur-xl border-b border-bichri-100/50 shadow-sm"
      height="4.5rem"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Fermer" : "Ouvrir"}
          icon={<Menu size={22} />}
        />
      </NavbarContent>

      <NavbarBrand>
        <Logo size="md" />
      </NavbarBrand>

      {/* Desktop navigation */}
      <NavbarContent className="hidden md:flex gap-6" justify="center">
        {NAV_LINKS.slice(0, 5).map((link) => (
          <NavbarItem key={link.href}>
            <Link
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-bichri-600 transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-bichri-600 to-bichri-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        {/* Search */}
        <NavbarItem className="hidden lg:flex">
          <form onSubmit={handleSearch}>
            <Input
              classNames={{
                base: "max-w-[220px]",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-9 bg-bichri-50/50 border border-bichri-100 hover:border-bichri-300 focus-within:!border-bichri-500 rounded-full",
              }}
              placeholder="Rechercher..."
              size="sm"
              startContent={<Search size={16} className="text-bichri-400" />}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </NavbarItem>

        {/* Likes */}
        {user && (
          <NavbarItem>
            <Button
              as={Link}
              href="/compte/likes"
              isIconOnly
              variant="light"
              radius="full"
              size="sm"
              className="text-gray-500 hover:text-bichri-600"
            >
              <Heart size={20} />
            </Button>
          </NavbarItem>
        )}

        {/* Cart */}
        <NavbarItem>
          <Badge
            content={cartCount}
            color="primary"
            size="sm"
            isInvisible={cartCount === 0}
          >
            <Button
              isIconOnly
              variant="light"
              radius="full"
              size="sm"
              className="text-gray-500 hover:text-bichri-600"
              onPress={openCart}
            >
              <ShoppingBag size={20} />
            </Button>
          </Badge>
        </NavbarItem>

        {/* User menu */}
        <NavbarItem>
          {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={getInitials(user.firstName || "", user.lastName || "")}
                  size="sm"
                  src={user.avatar || undefined}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Menu utilisateur" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile">
                  <p className="font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </DropdownItem>
                {isAdmin ? (
                  <DropdownItem
                    key="admin"
                    startContent={<LayoutDashboard size={16} />}
                    onPress={() => router.push("/admin")}
                  >
                    Administration
                  </DropdownItem>
                ) : null as any}
                <DropdownItem
                  key="dashboard"
                  startContent={<User size={16} />}
                  onPress={() => router.push("/compte")}
                >
                  Mon compte
                </DropdownItem>
                <DropdownItem
                  key="orders"
                  startContent={<Package size={16} />}
                  onPress={() => router.push("/compte/commandes")}
                >
                  Mes commandes
                </DropdownItem>
                <DropdownItem
                  key="comments"
                  startContent={<MessageSquare size={16} />}
                  onPress={() => router.push("/compte/commentaires")}
                >
                  Mes commentaires
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  startContent={<Settings size={16} />}
                  onPress={() => router.push("/compte/parametres")}
                >
                  Paramètres
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<LogOut size={16} />}
                  onPress={() => signOut({ callbackUrl: "/" })}
                >
                  Déconnexion
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              as={Link}
              href="/auth/connexion"
              color="primary"
              variant="flat"
              size="sm"
              radius="full"
              className="font-medium"
            >
              Connexion
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu className="bg-white/95 backdrop-blur-xl pt-6">
        {/* Mobile search */}
        <form onSubmit={handleSearch} className="mb-4">
          <Input
            placeholder="Rechercher des lunettes..."
            size="lg"
            startContent={<Search size={18} className="text-bichri-400" />}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            classNames={{
              inputWrapper: "bg-bichri-50 border border-bichri-100",
            }}
          />
        </form>

        {NAV_LINKS.map((link) => (
          <NavbarMenuItem key={link.href}>
            <Link
              href={link.href}
              className="w-full text-lg font-medium text-gray-700 hover:text-bichri-600 py-2 block"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          </NavbarMenuItem>
        ))}

        {!user && (
          <NavbarMenuItem className="mt-4">
            <Button
              as={Link}
              href="/auth/connexion"
              color="primary"
              fullWidth
              size="lg"
              radius="lg"
              className="font-semibold bg-gradient-to-r from-bichri-700 to-bichri-500"
            >
              Se connecter
            </Button>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </HeroNavbar>
  );
}
