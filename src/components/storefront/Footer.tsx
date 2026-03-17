"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Divider, Input, Button } from "@heroui/react";
import { Mail, Phone, MapPin, Instagram, Facebook, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("Inscription réussie !");
        setEmail("");
      } else {
        toast.error("Erreur lors de l'inscription");
      }
    } catch {
      toast.success("Merci pour votre inscription !");
      setEmail("");
    }
  };

  return (
    <footer className="bg-gradient-to-br from-bichri-950 via-bichri-900 to-bichri-800 text-white">
      <div className="container-bichri py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Logo variant="full" size="md" />
            <p className="text-bichri-200/80 text-sm leading-relaxed">
              Votre opticien de confiance au Sénégal. Découvrez notre collection de lunettes de vue,
              solaires et montures de grandes marques.
            </p>
            <div className="flex gap-3 pt-2">
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                className="bg-white/10 text-white hover:bg-bichri-500"
                as="a"
                href="#"
              >
                <Facebook size={18} />
              </Button>
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                className="bg-white/10 text-white hover:bg-bichri-500"
                as="a"
                href="#"
              >
                <Instagram size={18} />
              </Button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Boutique</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Lunettes de soleil", href: "/boutique?type=lunettes_soleil" },
                { label: "Lunettes de vue", href: "/boutique?type=lunettes_vue" },
                { label: "Montures", href: "/boutique?type=monture" },
                { label: "Lentilles", href: "/boutique?type=lentilles" },
                { label: "Accessoires", href: "/boutique?type=accessoires" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-bichri-200/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Informations</h3>
            <ul className="space-y-2.5">
              {[
                { label: "À propos", href: "/a-propos" },
                { label: "Contact", href: "/contact" },
                { label: "FAQ", href: "/faq" },
                { label: "Livraison", href: "/livraison" },
                { label: "Politique de retour", href: "/retours" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-bichri-200/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-bichri-200/70">
                  <MapPin size={16} className="text-bichri-400 flex-shrink-0" />
                  Dakar, Sénégal
                </li>
                <li className="flex items-center gap-2 text-sm text-bichri-200/70">
                  <Phone size={16} className="text-bichri-400 flex-shrink-0" />
                  +221 77 000 00 00
                </li>
                <li className="flex items-center gap-2 text-sm text-bichri-200/70">
                  <Mail size={16} className="text-bichri-400 flex-shrink-0" />
                  contact@bichri-optique.sn
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-3">Newsletter</h4>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <Input
                  size="sm"
                  placeholder="Votre email"
                  type="email"
                  value={email}
                  onValueChange={setEmail}
                  classNames={{
                    input: "text-white placeholder:text-bichri-300/50",
                    inputWrapper: "bg-white/10 border-white/10 hover:bg-white/15",
                  }}
                />
                <Button
                  isIconOnly
                  type="submit"
                  size="sm"
                  className="bg-bichri-500 text-white min-w-10"
                >
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </div>
        </div>

        <Divider className="my-8 bg-white/10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-bichri-300/50">
          <p>&copy; {new Date().getFullYear()} Bichri Optique. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="/cgv" className="hover:text-white transition-colors">
              CGV
            </Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
