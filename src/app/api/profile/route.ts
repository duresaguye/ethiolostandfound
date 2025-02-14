
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

import { auth } from "../../../../lib/auth";



const prisma = new PrismaClient();
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.lostItem.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        itemName: true,
        description: true,
        location: true,
        contact: true,
        image: true,
        date: true,
        status: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve items" },
      { status: 500 }
    );
  }
}