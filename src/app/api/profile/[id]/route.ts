import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers"; 
import { auth } from "../../../../../lib/auth";

const prisma = new PrismaClient();



//
// ─── DELETE: Remove an Uploaded Item ──────────────────────────────────────────
//
export async function DELETE(req: NextRequest) {
  try {
    console.log("DELETE request received");

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      console.log("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itemId = req.nextUrl.pathname.split('/').pop();  // Get ID from URL params
    console.log("Deleting item ID:", itemId);

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