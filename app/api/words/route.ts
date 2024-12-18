import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Helper function to generate random integers between min and max
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function GET() {
  // Step 1: Get the maximum ID
  const maxId = await prisma.word.aggregate({
    _max: {
      id: true, // Get the max id
    },
  });

  if (!maxId._max.id) {
    return NextResponse.json([]);
  }

  // Step 2: Generate 10 random IDs
  const randomIds: number[] = [];
  while (randomIds.length < 10) {
    const randomId = getRandomInt(1, maxId._max.id);
    if (!randomIds.includes(randomId)) {
      randomIds.push(randomId);
    }
  }

  // Step 3: Fetch the records with the random IDs
  const randomWords = await prisma.word.findMany({
    where: {
      id: {
        in: randomIds, // Fetch words with the generated random IDs
      },
    },
  });

  return NextResponse.json(randomWords);
}
