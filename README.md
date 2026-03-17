# 🕶️ Bichri Optique — E-commerce de lunettes

Boutique en ligne complète pour la vente de lunettes, montures, lunettes de soleil, lunettes de vue, lentilles et accessoires. Conçu pour le marché sénégalais.

## 🚀 Stack technique

- **Framework** : Next.js 16.1.6 (App Router)
- **UI** : HeroUI 2.8.8 + Tailwind CSS + Framer Motion
- **Base de données** : PostgreSQL + Drizzle ORM
- **Auth** : NextAuth.js (credentials)
- **State** : Zustand (panier) + TanStack React Query (API)
- **Design** : Thème violet (#7c1aff) / blanc avec gradients

## 📦 Fonctionnalités

### Storefront
- 🏠 Page d'accueil avec hero, produits vedettes, nouvelles arrivées, catégories
- 🛍️ Boutique avec filtres (type, genre, prix, catégorie, marque, tri)
- 📄 Pages produit détaillées avec galerie, avis, produits similaires
- 🛒 Panier avec gestion des quantités
- 💳 Commande en tant qu'invité (téléphone/email) ou connecté
- ❤️ Système de likes/favoris
- 💬 Commentaires avec modération
- 👤 Espace client (commandes, favoris, commentaires, paramètres)
- 🔐 Authentification (connexion/inscription)

### Admin
- 📊 Tableau de bord avec statistiques, revenus, commandes récentes
- 📦 Gestion des produits (CRUD complet)
- 📂 Gestion des catégories
- 🛒 Gestion des commandes (changement de statut)
- 👥 Gestion des clients
- 💬 Modération des commentaires

### Données de prescription
- Support des ordonnances avec sphère, cylindre, axe, addition
- Œil droit / Œil gauche
- Écart pupillaire

## 🛠️ Installation

```bash
# 1. Cloner et installer
cd bichri-optique
npm install

# 2. Configurer la base de données
cp .env.example .env
# Remplir DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# 3. Générer et pousser le schema
npx drizzle-kit push

# 4. Seed (données initiales + admin)
npx tsx scripts/seed.ts

# 5. Lancer le dev server
npm run dev
```

## 🔑 Accès admin

```
Email: admin@bichri-optique.sn
Mot de passe: admin123
```

## 📁 Structure du projet

```
src/
├── app/
│   ├── (storefront)/     # Pages publiques
│   │   ├── auth/         # Connexion, inscription
│   │   ├── boutique/     # Liste + détail produit
│   │   ├── compte/       # Espace client
│   │   ├── commande/     # Checkout
│   │   └── panier/       # Panier
│   ├── admin/            # Panel administration
│   └── api/              # API routes
├── components/
│   ├── shared/           # Logo, UI partagée
│   └── storefront/       # Navbar, Footer, Hero, ProductCard, etc.
├── db/                   # Schema Drizzle + connexion
├── hooks/                # React Query hooks
├── lib/                  # Utils, store, auth, constants
├── services/             # Logique métier (Product, Order, User, etc.)
└── types/                # TypeScript types
```

## 💰 Devise

Tous les prix sont en **FCFA (XOF)** — devise ouest-africaine.
Livraison gratuite à partir de 50 000 FCFA.

## 📱 Responsive

Design mobile-first, entièrement responsive.

---

Fait avec 💜 pour Bichri Optique
