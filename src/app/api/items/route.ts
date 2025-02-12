import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers"; 
import { auth } from "../../../../lib/auth";
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// GET endpoint with filtering, sorting, and pagination
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Pagination
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 15);
    const skip = (page - 1) * limit;

    // Filtering
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const sort = searchParams.get('sort') || 'date_desc';

    // Build where clause
    const where: any = {};
    
    if (status !== 'all') {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { itemName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    // Build orderBy
    const orderBy: any = {};
    const [sortField, sortOrder] = sort.split('_');
    orderBy[sortField] = sortOrder === 'desc' ? 'desc' : 'asc';

    // Get paginated results
    const [items, totalItems] = await Promise.all([
      prisma.lostItem.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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
      }),
      prisma.lostItem.count({ where })
    ]);

    return NextResponse.json({
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    }, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}



// POST endpoint
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    // Validate required fields
    const requiredFields = ['itemName', 'status'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` }, 
          { status: 400 }
        );
      }
    }

    // Handle image upload
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;
    
    if (imageFile) {
      try {
        const buffer = await imageFile.arrayBuffer();
        const base64String = Buffer.from(buffer).toString('base64');

        const uploadResult = await cloudinary.uploader.upload(
          `data:${imageFile.type};base64,${base64String}`, 
          { folder: 'lost-and-found', resource_type: 'auto' }
        );
        
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return NextResponse.json(
          { error: "Image upload failed" }, 
          { status: 500 }
        );
      }
    }

    // Validate date format
    const dateString = formData.get('date') as string;
    const date = dateString ? new Date(dateString) : new Date();
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" }, 
        { status: 400 }
      );
    }

    // Create item
    const newItem = await prisma.lostItem.create({
      data: {
        itemName: formData.get('itemName') as string,
        description: formData.get('description') as string,
        location: formData.get('location') as string,
        contact: formData.get('contact') as string,
        date,
        status: formData.get('status') as string,
        image: imageUrl,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Item added successfully", item: newItem }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Item creation failed:", error);
    return NextResponse.json(
      { error: "Item creation failed" }, 
      { status: 500 }
    );
  }
}