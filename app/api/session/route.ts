// import { PrismaClient } from '@prisma/client';
// import { NextResponse, NextRequest } from 'next/server';

// const prisma = new PrismaClient();


// export async function GET(request: NextRequest) {
//   try {
//     const token = request.headers.get("Authorization");
//     if (!token) {
//       return NextResponse.json({ error: "Authorization token is missing" }, { status: 401 });
//     }

//     const res = await prisma.session.findFirst({ where: { token } });
//     if (!res) {
//       return NextResponse.json({ error: "Session not found" }, { status: 404 });
//     }
//     return NextResponse.json(res);
//   } catch (error) {
//     console.error("Error in GET:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const token = request.headers.get("Authorization");
//     if (!token) {
//       return NextResponse.json({ error: "Authorization token is missing" }, { status: 401 });
//     }

//     const res = await prisma.session.findFirst({ where: { token } });
//     if (!res) {
//       return NextResponse.json({ error: "Session not found" }, { status: 404 });
//     }
//     return NextResponse.json(res);
//   } catch (error) {
//     console.error("Error in POST:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     // Assuming the request body contains userId
//     const { userId } = await request.json();

//     if (typeof userId !== 'number') {
//       return NextResponse.json({ error: "Invalid userId, it should be a number" }, { status: 400 });
//     }

//     // Find the session by userId to get the session's id
//     const session = await prisma.session.findFirst({
//       where: { userId: userId },
//     });

//     if (!session) {
//       return NextResponse.json({ error: "Session not found" }, { status: 404 });
//     }

//     // Delete session by the unique 'id'
//     const deletedSession = await prisma.session.delete({
//       where: { id: session.id }, // Use session.id here as it is unique
//     });

//     return NextResponse.json({ success: true, deleted: deletedSession });
//   } catch (error) {
//     console.error("Error in DELETE:", error);
//     return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
//   }
// }
