
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [lostCount, foundCount] = await Promise.all([
      prisma.lostItem.count({ where: { status: 'lost' }}),
      prisma.lostItem.count({ where: { status: 'found' }})
    ]);

    return NextResponse.json({
      lost: lostCount,
      found: foundCount
    }, { status: 200 });
    
  } catch (error) {
    console.error("Failed to fetch counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch counts" },
      { status: 500 }
    );
  }
}