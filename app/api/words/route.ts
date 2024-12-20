import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

// Helper function to generate random integers between min and max
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization");
  if (!token) {
    return new Response("Authorization token is missing", { status: 401 });
  }
  const ss = await prisma.session.findFirst({
    where: {token: token}
  })
  const userId = ss?.userId;
  if (!userId) {
    return new Response("Invalid or expired token", { status: 403 });
  }
  const correctIds = await prisma.userTestRecord.findMany({
    where: {
      userId: userId,
      isCorrect: true,
    },
    select: {
      wordId: true,
    },
  });

  const wordIds = []
  for (const v of correctIds){
    wordIds.push(v.wordId);
  }

  const allwordsID = await prisma.word.findMany({
    where: {
      id: {
        notIn: wordIds, // Use `notIn` to filter for IDs not in the provided list
      },
    },
    select: {
      id: true, // Select only the `id` field
    },
  });

  

  // Step 2: Generate 10 random Indexs
  const randomIds: number[] = [];
  while (randomIds.length < 10) {
    const randomId = getRandomInt(0, allwordsID.length-1);
    if (!randomIds.includes(randomId)) {
      randomIds.push(randomId);
    }
  }

  const secIds: number[] = [];
  for (const ind of randomIds){
    secIds.push(allwordsID[ind].id);
  }

  // Step 3: Fetch the records with the random IDs
  const randomWords = await prisma.word.findMany({
    where: {
      id: {
        in: secIds, // Fetch words with the generated random IDs
      },
    },
  });

  return NextResponse.json(randomWords);
}
