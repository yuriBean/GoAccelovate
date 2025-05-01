import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function GET(req) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json([], { status: 401 });
  
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
  
    if (id) {
      const task = await prisma.task.findUnique({
        where: { id },
      });
      return NextResponse.json(task);
    }
  
    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  
    return NextResponse.json(tasks);
  }
  
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { title } = await req.json();
  const task = await prisma.task.create({
    data: {
      title,
      userId: session.user.id,
    },
  });

  return NextResponse.json(task);
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

export async function PUT(req) {
    const body = await req.json();
    const { id, title } = body;
  
    if (!id || !title) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
  
    const task = await prisma.task.update({
      where: { id },
      data: { title },
    });
  
    return NextResponse.json(task);
  }
  