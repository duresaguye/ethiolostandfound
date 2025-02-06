import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authClient } from "../../../../../lib/auth-client";  

const prisma = new PrismaClient();

// Define the type of session returned by the authClient.useSession() function
interface Session {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

// 📌 GET: Fetch all lost items by the logged-in user
export async function GET(req: Request) {
  const { data: session} = authClient.useSession() as { data: Session | null };

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.lostItem.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json({ items });
}

// 📌 POST: Add a new lost item (Authenticated)
export async function POST(req: Request) {
  const { data: session} = authClient.useSession() as { data: Session | null };

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemName, description, location, contact, date, image, status } = await req.json();

  const newItem = await prisma.lostItem.create({
    data: {
      itemName,
      description,
      location,
      contact,
      date: new Date(date),
      image,
      status,
      userId: session.user.id, // Link the item to the logged-in user
    },
  });

  return NextResponse.json({ message: "Item added successfully", newItem });
}

// 📌 PATCH: Update a lost item by ID (Authenticated & Own Item)
export async function PATCH(req: Request) {
  const { data: session} = authClient.useSession() as { data: Session | null };

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, ...updates } = await req.json();

  // Ensure the item belongs to the logged-in user
  const item = await prisma.lostItem.findUnique({ where: { id } });
  if (!item || item.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updatedItem = await prisma.lostItem.update({
    where: { id },
    data: updates,
  });

  return NextResponse.json({ message: "Item updated successfully", updatedItem });
}

// 📌 DELETE: Remove a lost item by ID (Authenticated & Own Item)
export async function DELETE(req: Request) {
  const { data: session} = authClient.useSession() as { data: Session | null };

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  // Ensure the item belongs to the logged-in user
  const item = await prisma.lostItem.findUnique({ where: { id } });
  if (!item || item.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.lostItem.delete({ where: { id } });

  return NextResponse.json({ message: "Item deleted successfully" });
}
