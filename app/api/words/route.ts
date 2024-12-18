// File: /app/api/words/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const words = await prisma.word.findMany({
    select: { text: true }, // Only fetch the word text
  });
  return NextResponse.json(words);
}