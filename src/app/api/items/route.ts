import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers"; 
import { auth } from "../../../../lib/auth";
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});



export async function GET(req: Request) {
  try {
    const items = await prisma.lostItem.findMany({
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

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    // Handle file upload to Cloudinary
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;
    
    if (imageFile) {
      try {
        const buffer = await imageFile.arrayBuffer();
        const base64String = Buffer.from(buffer).toString('base64');

        const uploadResult = await cloudinary.uploader.upload(
          `data:${imageFile.type};base64,${base64String}`, 
          {
            folder: 'lost-and-found',
            resource_type: 'auto'
          }
        );
        
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Failed to upload image:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" }, 
          { status: 500 }
        );
      }
    }

    // Create new item in database
    const newItem = await prisma.lostItem.create({
      data: {
        itemName: formData.get('itemName') as string,
        description: formData.get('description') as string,
        location: formData.get('location') as string,
        contact: formData.get('contact') as string,
        date: new Date(formData.get('date') as string),
        status: formData.get('status') as string,
        image: imageUrl,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Item added successfully", newItem }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Failed to create item:", error);
    return NextResponse.json(
      { error: "Failed to create item" }, 
      { status: 500 }
    );
  }
}