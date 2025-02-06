import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers"; 
import { auth } from "../../../../lib/auth";
import { IncomingMessage } from "node:http";
import formidable from "formidable";  // Import formidable
import fs from "fs";  // For handling files



const prisma = new PrismaClient();


export async function POST(req: Request) {
    try {
      // ✅ Get the session using Better Auth's API
      const session = await auth.api.getSession({
        headers: await headers(), // Pass request headers
      });
  
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      // ✅ Parse the request body
      const { itemName, description, location, contact, date, image, status } = await req.json();
  
      // ✅ Create a new lost item in Prisma
      const newItem = await prisma.lostItem.create({
        data: {
          itemName,
          description,
          location,
          contact,
          date: new Date(date),
          image,
          status,
          userId: session.user.id, // Link item to logged-in user
        },
      });
  
      return NextResponse.json({ message: "Item added successfully", newItem }, { status: 201 });
    } catch (error) {
      console.error("Failed to create item:", error);
      return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }
  }
  