import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers"; 
import { auth } from "../../../../../lib/auth";

const prisma = new PrismaClient();

//
// ─── GET: Retrieve Only the User’s Uploaded Items ─────────────────────────────
//
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retrieve just the items that the logged-in user uploaded.
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
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Failed to retrieve items:", error);
    return NextResponse.json(
      { error: "Failed to retrieve items" },
      { status: 500 }
    );
  }
}

//
// ─── DELETE: Remove an Uploaded Item ──────────────────────────────────────────
//
export async function DELETE(req: Request) {
  try {
    console.log("DELETE request received");

    const sessionHeaders = headers();
    console.log("Headers:", sessionHeaders);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      console.log("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await req.json();
    if (!itemId) {
      console.log("Missing item ID");
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const item = await prisma.lostItem.findUnique({ where: { id: itemId } });

    if (!item || item.userId !== session.user.id) {
      console.log("Forbidden: Item not found or user mismatch");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.lostItem.delete({ where: { id: itemId } });

    console.log("Item deleted successfully");
    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Failed to delete item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}