"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@heroui/react";
import { Logo } from "@/components/shared/Logo";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      toast.error("Email ou mot de passe incorrect");
    } else {
      toast.success("Connexion réussie !");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Bienvenue</h1>
          <p className="text-gray-500 text-sm mt-1">Connectez-vous à votre compte</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-bichri-100/20 space-y-5"
        >
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startContent={<Mail size={16} className="text-gray-400" />}
            isRequired
          />
          <Input
            label="Mot de passe"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startContent={<Lock size={16} className="text-gray-400" />}
            endContent={
              <button type="button" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
              </button>
            }
            isRequired
          />

          <Button
            type="submit"
            color="primary"
            fullWidth
            size="lg"
            radius="full"
            className="font-semibold bg-gradient-to-r from-bichri-700 to-bichri-500"
            isLoading={loading}
          >
            Se connecter
          </Button>

          <p className="text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link href="/auth/inscription" className="text-bichri-600 font-medium hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
