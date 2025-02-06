import { PrismaClient } from '@prisma/client';
import data from './total_words.json';

const prisma = new PrismaClient();

interface Word {
  english: string;
  partOfSpeech: string;
  chinese: string;
}

const words: Word[] = data.map(({ word, translate, part_of_speech }) => ({
  english: word,
  partOfSpeech: part_of_speech,
  chinese: translate
}));

async function main() {
  // Seed Words
  await prisma.word.deleteMany({});

  await prisma.word.createMany({
    data: words,
  });

  console.log("Database seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
