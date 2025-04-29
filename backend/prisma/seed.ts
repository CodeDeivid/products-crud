import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.category.deleteMany({});

  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
    },
  });

  const furniture = await prisma.category.create({
    data: {
      name: 'Furniture',
    },
  });

  await prisma.category.create({
    data: {
      name: 'Computers',
      parentCategory: {
        connect: { id: electronics.id },
      },
    },
  });

  await prisma.category.create({
    data: {
      name: 'Smartphones',
      parentCategory: {
        connect: { id: electronics.id },
      },
    },
  });

  await prisma.category.create({
    data: {
      name: 'Chairs',
      parentCategory: {
        connect: { id: furniture.id },
      },
    },
  });

  await prisma.category.create({
    data: {
      name: 'Tables',
      parentCategory: {
        connect: { id: furniture.id },
      },
    },
  });
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
