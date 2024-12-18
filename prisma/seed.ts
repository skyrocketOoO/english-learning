import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  // const user = await prisma.user.create({
  //   data: { name: "username" },
  // });

  // Seed Words
  await prisma.word.deleteMany({});

  const words = await prisma.word.createMany({
    data: [
      { english: "apple", partOfSpeech: "N", chinese: "蘋果" },
      { english: "eat", partOfSpeech: "V", chinese: "吃" },
      { english: "sleep", partOfSpeech: "V", chinese: "睡" },
      { english: "pig", partOfSpeech: "N", chinese: "豬" },
    ],
  });

  // Seed Test Records
  // await prisma.userTestRecord.create({
  //   data: {
  //     userId: user.id,
  //     wordId: 1,
  //     isCorrect: true,
  //   },
  // });

  console.log("Database seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
