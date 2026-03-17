"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useUpdateProfile, useUpdatePassword } from "@/hooks/useApi";
import { Input, Button, Divider } from "@heroui/react";
import { toast } from "sonner";

export default function ParametresPage() {
  const { data: session, update } = useSession();
  const user = session?.user as any;
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(profile, {
      onSuccess: () => {
        toast.success("Profil mis à jour !");
        update();
      },
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) {
      toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    updatePassword.mutate(
      { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword },
      {
        onSuccess: () => {
          toast.success("Mot de passe modifié !");
          setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        },
        onError: () => {
          toast.error("Mot de passe actuel incorrect");
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Paramètres</h2>

        {/* Profile */}
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-900">Informations personnelles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Prénom"
              value={profile.firstName}
              onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
            />
            <Input
              label="Nom"
              value={profile.lastName}
              onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
            />
            <Input
              label="Téléphone"
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            />
            <Input
              label="Ville"
              value={profile.city}
              onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
            />
            <Input
              label="Adresse"
              value={profile.address}
              onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
              className="sm:col-span-2"
            />
          </div>
          <Button
            type="submit"
            color="primary"
            radius="full"
            isLoading={updateProfile.isPending}
            className="bg-gradient-to-r from-bichri-700 to-bichri-500"
          >
            Sauvegarder
          </Button>
        </form>
      </div>

      <Divider />

      {/* Password */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
        <h3 className="font-semibold text-gray-900">Changer le mot de passe</h3>
        <Input
          label="Mot de passe actuel"
          type="password"
          value={passwords.currentPassword}
          onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
          isRequired
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nouveau mot de passe"
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
            isRequired
          />
          <Input
            label="Confirmer"
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
            isRequired
          />
        </div>
        <Button
          type="submit"
          color="primary"
          variant="flat"
          radius="full"
          isLoading={updatePassword.isPending}
        >
          Modifier le mot de passe
        </Button>
      </form>
    </div>
  );
}
