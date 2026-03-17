"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRegister } from "@/hooks/useApi";
import { Input, Button } from "@heroui/react";
import { Logo } from "@/components/shared/Logo";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function InscriptionPage() {
  const router = useRouter();
  const register = useRegister();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    register.mutate(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      },
      {
        onSuccess: async () => {
          toast.success("Inscription réussie !");
          await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
          });
          router.push("/");
          router.refresh();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.error || "Erreur lors de l'inscription");
        },
      }
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-1">Rejoignez Bichri Optique</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-bichri-100/20 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prénom"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              startContent={<User size={16} className="text-gray-400" />}
              isRequired
            />
            <Input
              label="Nom"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              isRequired
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            startContent={<Mail size={16} className="text-gray-400" />}
            isRequired
          />
          <Input
            label="Téléphone (optionnel)"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            startContent={<Phone size={16} className="text-gray-400" />}
          />
          <Input
            label="Mot de passe"
            type={showPw ? "text" : "password"}
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            startContent={<Lock size={16} className="text-gray-400" />}
            endContent={
              <button type="button" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
              </button>
            }
            isRequired
          />
          <Input
            label="Confirmer le mot de passe"
            type={showPw ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            startContent={<Lock size={16} className="text-gray-400" />}
            isRequired
          />

          <Button
            type="submit"
            color="primary"
            fullWidth
            size="lg"
            radius="full"
            className="font-semibold bg-gradient-to-r from-bichri-700 to-bichri-500"
            isLoading={register.isPending}
          >
            S&apos;inscrire
          </Button>

          <p className="text-center text-sm text-gray-500">
            Déjà un compte ?{" "}
            <Link href="/auth/connexion" className="text-bichri-600 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
