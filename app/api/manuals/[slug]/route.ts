import { connectDB } from '@/lib/db';
import { Manual } from '@/lib/models';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const manual = await Manual.findOne({ slug }).populate('author', 'name email');

    if (!manual) {
      return NextResponse.json(
        { error: 'Manual not found' },
        { status: 404 }
      );
    }

    // Increment views
    manual.views += 1;
    await manual.save();

    return NextResponse.json(manual, { status: 200 });
  } catch (error) {
    console.error('[v0] Get manual error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch manual' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const { title, category, content, excerpt, tags, documentUrl } = await req.json();

    const manual = await Manual.findOne({ slug });

    if (!manual) {
      return NextResponse.json(
        { error: 'Manual not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (manual.author.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update manual
    if (title) manual.title = title;
    if (category) manual.category = category;
    if (content) manual.content = content;
    if (excerpt) manual.excerpt = excerpt;
    if (tags) manual.tags = tags;
    if (documentUrl) manual.documentUrl = documentUrl;

    await manual.save();

    return NextResponse.json(
      { message: 'Manual updated successfully', manual },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Update manual error:', error);
    return NextResponse.json(
      { error: 'Failed to update manual' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { slug } = await params;

    const manual = await Manual.findOne({ slug });

    if (!manual) {
      return NextResponse.json(
        { error: 'Manual not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (manual.author.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await Manual.deleteOne({ slug });

    return NextResponse.json(
      { message: 'Manual deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Delete manual error:', error);
    return NextResponse.json(
      { error: 'Failed to delete manual' },
      { status: 500 }
    );
  }
}
