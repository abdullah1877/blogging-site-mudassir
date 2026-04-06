  import { connectDB } from '@/lib/mongodb';
  import { Manual } from '@/lib/models/Manual';
  import { verifyToken } from '@/lib/jwt';
  import { NextRequest, NextResponse } from 'next/server';
// import { createInitialRSCPayloadFromFallbackPrerender } from 'next/dist/client/flight-data-helpers'; 

  // Generate slug from title
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

  export async function GET(req: NextRequest) {
    try {
      await connectDB();

      const { searchParams } = new URL(req.url);
      const category = searchParams.get('category');
      const limit = parseInt(searchParams.get('limit') || '10');
      const page = parseInt(searchParams.get('page') || '1');

      let query: any = {};
      if (category) {
        query.category = category;
      }

      const skip = (page - 1) * limit;

      const manuals = await Manual.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email');

      const total = await Manual.countDocuments(query);

      return NextResponse.json(
        {
          manuals,
          pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('[v0] Get manuals error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch manuals' },
        { status: 500 }
      );
    }
  }

 export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { title, content, excerpt, category } = await req.json();

    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { error: "Missing fields (title, content, excerpt)" },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);

    const manual = await Manual.create({
      title,
      content,
      excerpt,
      category: category || "reference", // default category
      slug,
      author: "demo-user",
    });

    return NextResponse.json(
      { message: "Manual created successfully", manual },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Manual error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}