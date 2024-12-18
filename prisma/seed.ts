import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const user = await prisma.user.create({
    data: { name: "username" },
  });

  // Seed Words
  const words = await prisma.word.createMany({
    data: [
      { text: "example", meaning: "a representative form or pattern" },
      { text: "challenge", meaning: "a task or situation that tests someone's abilities" },
    ],
  });

  // Seed Test Records
  await prisma.userTestRecord.create({
    data: {
      userId: user.id,
      wordId: 1,
      isCorrect: true,
    },
  });

  console.log("Database seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
