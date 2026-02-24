  import { connectDB } from '@/lib/mongodb';
  import { Blog } from '@/lib/models/Blog';
  import { verifyToken } from '@/lib/jwt';
  import { NextRequest, NextResponse } from 'next/server';

  // Generate slug from title
  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-') 
      .replace(/-+/g, '-');
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

      const blogs = await Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email');

      const total = await Blog.countDocuments(query);

      return NextResponse.json(
        {
          blogs,
          pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('[v0] Get blogs error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blogs' },
        { status: 500 }
      );
    }
  }

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { title, category, content, excerpt } = await req.json();

    if (!title || !category || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);

    const blog = await Blog.create({
      title,
      slug,
      category,
      content,
      excerpt,
      author: "demo-user",
    });

    return NextResponse.json(
      { message: 'Blog created successfully', blog },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
