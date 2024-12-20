import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const req = await request.json();

  const wordID = req["wordID"];
  const correct = req["correct"];
  if (isNaN(wordID)) {
    return new Response("Invalid word ID", { status: 400 });
  }
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

  const res = await prisma.userTestRecord.findFirst({
    where: {"wordId": wordID, userId: userId}
  })
  if (res == null){
    await prisma.userTestRecord.create({
      data: {
        userId: userId,
        wordId: wordID,
        isCorrect: correct,
      }
    })
  }else{ // not correct
    if (!correct){
      res.correctTimes = 0;
      await prisma.userTestRecord.update({
        where: {id: res.id},
        data: res
      });
    }else{
      if (res.correctTimes == 2){
        res.correctTimes = 0;
        res.isCorrect = true;
      }else{
        res.correctTimes += 1;
      }

      await prisma.userTestRecord.update({
        where: {id: res.id},
        data: res
      });
    }
  }

  return NextResponse.json({ success: true });
}
