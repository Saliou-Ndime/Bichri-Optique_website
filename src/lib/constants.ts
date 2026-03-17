export const APP_NAME = "Bichri Optique";
export const APP_DESCRIPTION =
  "Votre opticien en ligne de confiance. Découvrez notre collection de lunettes de vue, lunettes de soleil, montures et lentilles de contact.";

export const PRODUCT_TYPES = [
  { value: "monture", label: "Montures" },
  { value: "lunettes_soleil", label: "Lunettes de soleil" },
  { value: "lunettes_vue", label: "Lunettes de vue" },
  { value: "lunettes_ordonnance", label: "Lunettes sous ordonnance" },
  { value: "lentilles", label: "Lentilles" },
  { value: "accessoires", label: "Accessoires" },
] as const;

export const GENDERS = [
  { value: "homme", label: "Homme" },
  { value: "femme", label: "Femme" },
  { value: "enfant", label: "Enfant" },
  { value: "unisexe", label: "Unisexe" },
] as const;

export const FRAME_SHAPES = [
  "Rectangulaire",
  "Ronde",
  "Ovale",
  "Carrée",
  "Aviateur",
  "Cat-eye",
  "Papillon",
  "Wayfarer",
  "Sport",
  "Sans monture",
  "Demi-cerclée",
] as const;

export const MATERIALS = [
  "Métal",
  "Acétate",
  "Titane",
  "Plastique",
  "Bois",
  "Mixte",
  "TR90",
  "Nylon",
] as const;

export const ORDER_STATUSES = [
  { value: "en_attente", label: "En attente", color: "warning" },
  { value: "confirmee", label: "Confirmée", color: "primary" },
  { value: "en_preparation", label: "En préparation", color: "secondary" },
  { value: "expediee", label: "Expédiée", color: "primary" },
  { value: "livree", label: "Livrée", color: "success" },
  { value: "annulee", label: "Annulée", color: "danger" },
  { value: "remboursee", label: "Remboursée", color: "danger" },
] as const;

export const ITEMS_PER_PAGE = 12;

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/categories/lunettes-de-soleil", label: "Solaire" },
  { href: "/categories/lunettes-de-vue", label: "Optique" },
  { href: "/categories/montures", label: "Montures" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  boutique: [
    { href: "/boutique", label: "Tous les produits" },
    { href: "/categories/lunettes-de-soleil", label: "Lunettes de soleil" },
    { href: "/categories/lunettes-de-vue", label: "Lunettes de vue" },
    { href: "/categories/montures", label: "Montures" },
    { href: "/categories/lentilles", label: "Lentilles" },
  ],
  aide: [
    { href: "/a-propos", label: "À propos" },
    { href: "/contact", label: "Contact" },
    { href: "#", label: "FAQ" },
    { href: "#", label: "Livraison" },
    { href: "#", label: "Retours" },
  ],
  legal: [
    { href: "#", label: "Conditions générales" },
    { href: "#", label: "Politique de confidentialité" },
    { href: "#", label: "Mentions légales" },
  ],
} as const;
