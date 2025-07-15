import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "Toiletries",
      presets: [
        { name: "Toothbrush" },
        { name: "Toothpaste" },
        { name: "Deodorant" },
        { name: "Shampoo" },
      ],
    },
    {
      name: "Clothing",
      presets: [
        { name: "Shirts" },
        { name: "Pants" },
        { name: "Socks" },
        { name: "Underwear" },
      ],
    },
    {
      name: "Electronics",
      presets: [
        { name: "Phone Charger" },
        { name: "Laptop" },
        { name: "Headphones" },
      ],
    },
  ];

  for (const category of categories) {
    const createdCategory = await prisma.packingCategory.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        presets: {
          create: category.presets.map((preset) => ({
            name: preset.name,
            quantity: 1,
          })),
        },
      },
    });
    console.log(`Seeded category: ${createdCategory.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
