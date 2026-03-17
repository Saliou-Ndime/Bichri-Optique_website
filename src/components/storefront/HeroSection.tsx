"use client";

import { Button } from "@heroui/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-bichri-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-bichri-400/20 blur-3xl animate-float" />
        <div
          className="absolute top-1/2 -left-20 w-[300px] h-[300px] rounded-full bg-bichri-500/15 blur-3xl"
          style={{ animationDelay: "2s", animation: "float 8s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-10 right-1/4 w-[200px] h-[200px] rounded-full bg-white/5 blur-2xl"
          style={{ animationDelay: "4s", animation: "float 10s ease-in-out infinite" }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container-bichri relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm"
            >
              <Sparkles size={16} className="text-bichri-300" />
              Nouvelle Collection 2025
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] text-balance">
              Voyez le monde avec{" "}
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-bichri-300 via-white to-bichri-300">
                  style
                </span>
              </span>
              <br />& élégance
            </h1>

            <p className="text-lg text-bichri-200/80 max-w-lg leading-relaxed">
              Découvrez notre collection exclusive de lunettes de vue, solaires et montures.
              Qualité premium, style unique, livrée partout au Sénégal.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-bichri-700 font-semibold hover:bg-bichri-50 px-8"
                endContent={<ArrowRight size={18} />}
                onPress={() => router.push("/boutique")}
              >
                Découvrir la boutique
              </Button>
              <Button
                size="lg"
                variant="bordered"
                className="border-white/30 text-white hover:bg-white/10 px-8"
                onPress={() => router.push("/boutique?type=lunettes_soleil")}
              >
                Solaires
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 pt-4"
            >
              {[
                { value: "500+", label: "Modèles" },
                { value: "50+", label: "Marques" },
                { value: "10K+", label: "Clients satisfaits" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-bichri-300/70">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Featured glasses visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center items-center relative"
          >
            <div className="relative w-[450px] h-[450px]">
              {/* Decorative rings */}
              <div className="absolute inset-0 border-2 border-white/10 rounded-full animate-spin" style={{ animationDuration: "30s" }} />
              <div className="absolute inset-8 border border-bichri-400/20 rounded-full animate-spin" style={{ animationDuration: "20s", animationDirection: "reverse" }} />
              
              {/* Center content */}
              <div className="absolute inset-16 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <div className="text-8xl mb-2">👓</div>
                  <p className="text-white/60 text-sm font-medium">Collection Premium</p>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                className="absolute -top-4 right-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-white font-semibold text-sm">🕶️ Lunettes de Soleil</p>
                <p className="text-bichri-300 text-xs">À partir de 15 000 F</p>
              </motion.div>

              <motion.div
                className="absolute bottom-10 -left-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <p className="text-white font-semibold text-sm">👁️ Lunettes de Vue</p>
                <p className="text-bichri-300 text-xs">Sur ordonnance</p>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <p className="text-white font-semibold text-sm">⭐ Livraison gratuite</p>
                <p className="text-bichri-300 text-xs">Dès 50 000 FCFA</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
