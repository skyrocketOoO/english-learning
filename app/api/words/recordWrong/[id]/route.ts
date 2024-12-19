import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const wordID = Number((await params).id);
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

  let res = await prisma.userTestRecord.findFirst({
    where: {"wordId": wordID, userId: userId}
  })
  if (res == null){
    await prisma.userTestRecord.create({
      data: {
        userId: userId,
        wordId: wordID,
        isCorrect: false,
      }
    })
  }else{

  }


  // Example database operation (replace with your logic)
  // const result = await prisma.someModel.create({
  //   data: {
  //     field1: param1,
  //     field2: param2,
  //   },
  // });

  return NextResponse.json({ success: true });
}
