import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "Toiletries",
    },
    {
      name: "Clothing",
    },
    {
      name: "Electronics",
    },
  ];

  for (const category of categories) {
    const createdCategory = await prisma.packingCategory.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
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
