import { db } from "../src/db";
import { users, categories, brands, products } from "../src/db/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const [admin] = await db
    .insert(users)
    .values({
      email: "admin@bichri-optique.sn",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "Bichri",
      role: "admin",
      phone: "+221770000000",
      city: "Dakar",
      country: "Sénégal",
      isActive: true,
    })
    .onConflictDoNothing()
    .returning();

  console.log("✅ Admin user created:", admin?.email || "already exists");

  // Create categories
  const categoryData = [
    { name: "Montures", slug: "montures", description: "Montures tendance pour tous les styles" },
    { name: "Lunettes de soleil", slug: "lunettes-de-soleil", description: "Protection UV et style" },
    { name: "Lunettes de vue", slug: "lunettes-de-vue", description: "Lunettes optiques de qualité" },
    { name: "Lunettes sous ordonnance", slug: "lunettes-ordonnance", description: "Verres correcteurs sur mesure" },
    { name: "Lentilles", slug: "lentilles", description: "Lentilles de contact" },
    { name: "Accessoires", slug: "accessoires", description: "Étuis, cordons, nettoyants" },
  ];

  const insertedCategories = [];
  for (const cat of categoryData) {
    const [c] = await db.insert(categories).values(cat).onConflictDoNothing().returning();
    if (c) insertedCategories.push(c);
  }
  console.log(`✅ ${insertedCategories.length} categories created`);

  // Create brands
  const brandData = [
    { name: "Ray-Ban", slug: "ray-ban", description: "L'icône des lunettes depuis 1937" },
    { name: "Oakley", slug: "oakley", description: "Performance et style sportif" },
    { name: "Gucci", slug: "gucci", description: "Luxe et élégance italienne" },
    { name: "Tom Ford", slug: "tom-ford", description: "Design sophistiqué" },
    { name: "Carrera", slug: "carrera", description: "L'esprit racing et sport" },
    { name: "Prada", slug: "prada", description: "Mode italienne haut de gamme" },
  ];

  const insertedBrands = [];
  for (const b of brandData) {
    const [brand] = await db.insert(brands).values(b).onConflictDoNothing().returning();
    if (brand) insertedBrands.push(brand);
  }
  console.log(`✅ ${insertedBrands.length} brands created`);

  // Create sample products
  const catMap: Record<string, string> = {};
  for (const c of insertedCategories) {
    catMap[c.slug] = c.id;
  }
  const brandMap: Record<string, string> = {};
  for (const b of insertedBrands) {
    brandMap[b.slug] = b.id;
  }

  const sampleProducts = [
    {
      name: "Ray-Ban Aviator Classic",
      slug: "ray-ban-aviator-classic",
      shortDescription: "L'iconique Aviator avec verres verts classiques G-15",
      description: "Les lunettes de soleil Ray-Ban Aviator Classic sont le modèle qui a lancé un phénomène culturel. Depuis leur création pour les pilotes de l'armée américaine en 1937, le design Aviator est devenu un classique intemporel.",
      price: "89000",
      comparePrice: "110000",
      sku: "RB-AVI-001",
      stock: 25,
      categoryId: catMap["lunettes-de-soleil"],
      brandId: brandMap["ray-ban"],
      type: "lunettes_soleil" as const,
      gender: "unisexe" as const,
      material: "Métal",
      frameShape: "Aviator",
      frameColor: "Or",
      lensType: "Verre minéral",
      lensColor: "Vert G-15",
      uvProtection: true,
      polarized: false,
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"],
    },
    {
      name: "Oakley Holbrook",
      slug: "oakley-holbrook",
      shortDescription: "Style rétro-moderne avec technologie Prizm",
      description: "Un design classique américain avec des matériaux modernes. Le Holbrook combine l'élégance vintage avec la technologie Oakley High Definition Optics.",
      price: "75000",
      sku: "OAK-HOL-001",
      stock: 18,
      categoryId: catMap["lunettes-de-soleil"],
      brandId: brandMap["oakley"],
      type: "lunettes_soleil" as const,
      gender: "homme" as const,
      material: "O-Matter",
      frameShape: "Rectangulaire",
      frameColor: "Noir mat",
      lensType: "Prizm",
      lensColor: "Gris",
      uvProtection: true,
      polarized: true,
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"],
    },
    {
      name: "Gucci GG Cat-Eye",
      slug: "gucci-gg-cat-eye",
      shortDescription: "Monture cat-eye élégante en acétate avec logo GG",
      description: "Une monture cat-eye féminine et audacieuse. L'acétate de haute qualité et le logo GG emblématique en font un accessoire de mode incontournable.",
      price: "145000",
      comparePrice: "175000",
      sku: "GUC-CAT-001",
      stock: 10,
      categoryId: catMap["montures"],
      brandId: brandMap["gucci"],
      type: "monture" as const,
      gender: "femme" as const,
      material: "Acétate",
      frameShape: "Cat-eye",
      frameColor: "Noir / Or",
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600"],
    },
    {
      name: "Tom Ford Blue Block",
      slug: "tom-ford-blue-block",
      shortDescription: "Lunettes anti lumière bleue pour écrans",
      description: "Les Tom Ford Blue Block protègent vos yeux de la lumière bleue nocive des écrans. Design élégant pour un usage quotidien au bureau ou à la maison.",
      price: "120000",
      sku: "TF-BB-001",
      stock: 15,
      categoryId: catMap["lunettes-de-vue"],
      brandId: brandMap["tom-ford"],
      type: "lunettes_vue" as const,
      gender: "unisexe" as const,
      material: "Acétate",
      frameShape: "Rectangulaire",
      frameColor: "Havane",
      lensType: "Blue Block",
      uvProtection: false,
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600"],
    },
    {
      name: "Carrera Champion",
      slug: "carrera-champion",
      shortDescription: "L'iconique Champion avec verres miroir",
      description: "Le Carrera Champion est un classique intemporel du monde des lunettes de sport. Son design audacieux et ses verres miroir en font un must-have.",
      price: "65000",
      sku: "CAR-CHA-001",
      stock: 20,
      categoryId: catMap["lunettes-de-soleil"],
      brandId: brandMap["carrera"],
      type: "lunettes_soleil" as const,
      gender: "homme" as const,
      material: "Plastique",
      frameShape: "Masque",
      frameColor: "Noir",
      lensColor: "Miroir argent",
      uvProtection: true,
      polarized: false,
      isFeatured: false,
      images: ["https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600"],
    },
    {
      name: "Prada Linea Rossa",
      slug: "prada-linea-rossa",
      shortDescription: "Monture sport-chic de la ligne Prada Sport",
      description: "La collection Linea Rossa de Prada allie performance sportive et design contemporain. Légère et confortable pour un usage quotidien actif.",
      price: "135000",
      comparePrice: "160000",
      sku: "PRA-LS-001",
      stock: 8,
      categoryId: catMap["montures"],
      brandId: brandMap["prada"],
      type: "monture" as const,
      gender: "unisexe" as const,
      material: "Nylon",
      frameShape: "Rectangulaire",
      frameColor: "Bleu marine",
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1577803645773-f96470509666?w=600"],
    },
    {
      name: "Kit nettoyage lunettes",
      slug: "kit-nettoyage-lunettes",
      shortDescription: "Spray nettoyant + chiffon microfibre premium",
      description: "Kit complet pour l'entretien quotidien de vos lunettes. Spray anti-buée et anti-traces, accompagné d'un chiffon microfibre ultra-doux.",
      price: "5000",
      sku: "ACC-KIT-001",
      stock: 100,
      categoryId: catMap["accessoires"],
      type: "accessoires" as const,
      gender: "unisexe" as const,
      images: ["https://images.unsplash.com/photo-1589642380614-4a8c2147b857?w=600"],
    },
    {
      name: "Étui rigide cuir",
      slug: "etui-rigide-cuir",
      shortDescription: "Étui de protection en cuir véritable",
      description: "Protégez vos lunettes avec style. Cet étui rigide en cuir véritable offre une protection optimale contre les chocs et les rayures.",
      price: "12000",
      comparePrice: "15000",
      sku: "ACC-ETU-001",
      stock: 50,
      categoryId: catMap["accessoires"],
      type: "accessoires" as const,
      gender: "unisexe" as const,
      images: ["https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600"],
    },
  ];

  for (const product of sampleProducts) {
    await db.insert(products).values(product).onConflictDoNothing();
  }
  console.log(`✅ ${sampleProducts.length} sample products created`);

  console.log("\n🎉 Seed complete!");
  console.log("Admin login: admin@bichri-optique.sn / admin123");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
