"use client";

import { useFeaturedProducts, useNewArrivals } from "@/hooks/useProducts";
import { useCategoriesWithCount } from "@/hooks/useApi";
import { ProductCard } from "./ProductCard";
import { Card, CardBody, Button, Spinner, Chip } from "@heroui/react";
import { ArrowRight, TrendingUp, Clock, ShieldCheck, Truck, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/* ──────── Featured Products ──────── */
export function FeaturedProducts() {
  const { data, isLoading } = useFeaturedProducts(8);
  const router = useRouter();

  return (
    <section className="py-20 bg-gradient-to-b from-white to-bichri-50/30">
      <div className="container-bichri">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Chip size="sm" variant="flat" className="bg-bichri-100 text-bichri-700 mb-4">
            <TrendingUp size={14} className="mr-1" /> Sélection
          </Chip>
          <h2 className="text-3xl md:text-4xl font-bold">
            Nos <span className="gradient-text">produits vedettes</span>
          </h2>
          <p className="text-default-500 mt-3 max-w-md mx-auto">
            Les lunettes les plus populaires choisies par nos clients
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" color="secondary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {data?.data?.slice(0, 8).map((product: any, i: number) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button
            size="lg"
            variant="flat"
            color="secondary"
            endContent={<ArrowRight size={18} />}
            onPress={() => router.push("/boutique")}
            className="font-medium"
          >
            Voir toute la collection
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ──────── New Arrivals ──────── */
export function NewArrivals() {
  const { data, isLoading } = useNewArrivals(4);
  const router = useRouter();

  return (
    <section className="py-20">
      <div className="container-bichri">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Chip size="sm" variant="flat" className="bg-bichri-100 text-bichri-700 mb-4">
            <Clock size={14} className="mr-1" /> Nouveau
          </Chip>
          <h2 className="text-3xl md:text-4xl font-bold">
            Nouveautés <span className="gradient-text">récentes</span>
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" color="secondary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data?.data?.slice(0, 4).map((product: any, i: number) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ──────── Categories Grid ──────── */
export function CategoriesSection() {
  const { data: categories } = useCategoriesWithCount();
  const router = useRouter();

  const categoryIcons: Record<string, string> = {
    monture: "🖼️",
    lunettes_soleil: "🕶️",
    lunettes_vue: "👓",
    lunettes_ordonnance: "🔬",
    lentilles: "👁️",
    accessoires: "✨",
  };

  return (
    <section className="py-20 bg-gradient-to-br from-bichri-950 via-bichri-900 to-bichri-800 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-bichri-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-bichri-400/10 rounded-full blur-3xl" />

      <div className="container-bichri relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Explorez nos <span className="text-bichri-300">catégories</span>
          </h2>
          <p className="text-bichri-200/60 mt-3">
            Trouvez exactement ce que vous cherchez
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories?.slice(0, 6).map((cat: any, i: number) => (
            <motion.div
              key={cat.id || cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                isPressable
                onPress={() => router.push(`/categories/${cat.slug}`)}
                className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-bichri-400/30 transition-all duration-300"
              >
                <CardBody className="items-center text-center py-8 gap-3">
                  <span className="text-4xl">
                    {categoryIcons[cat.slug] || "📦"}
                  </span>
                  <h3 className="font-semibold text-white text-sm">{cat.name}</h3>
                  <p className="text-bichri-300/60 text-xs">
                    {cat.productCount || 0} articles
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────── Features / Trust Bar ──────── */
export function FeaturesBar() {
  const features = [
    {
      icon: <Truck size={28} />,
      title: "Livraison gratuite",
      desc: "Dès 50 000 FCFA d'achat",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Garantie qualité",
      desc: "Verres et montures certifiés",
    },
    {
      icon: <Star size={28} />,
      title: "Service client",
      desc: "Support réactif 7j/7",
    },
    {
      icon: <Clock size={28} />,
      title: "Livraison rapide",
      desc: "48h dans tout Dakar",
    },
  ];

  return (
    <section className="py-16 border-y border-default-100">
      <div className="container-bichri">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-bichri-50 text-bichri-600 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-semibold text-sm">{f.title}</h3>
              <p className="text-default-400 text-xs">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────── CTA Banner ──────── */
export function CtaBanner() {
  const router = useRouter();

  return (
    <section className="py-20">
      <div className="container-bichri">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-bichri-gradient rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Besoin de lunettes sur ordonnance ?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Notre équipe d&apos;opticiens qualifiés est prête à vous accompagner.
              Envoyez votre ordonnance et recevez vos lunettes chez vous.
            </p>
            <Button
              size="lg"
              className="bg-white text-bichri-700 font-semibold px-8 hover:bg-bichri-50"
              endContent={<ArrowRight size={18} />}
              onPress={() => router.push("/contact")}
            >
              Nous contacter
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
