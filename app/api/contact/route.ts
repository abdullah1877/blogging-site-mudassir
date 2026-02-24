import { connectDB } from '@/lib/mongodb';
import { Contact } from '@/lib/models/Contact';
import { sendContactReply, sendAdminNotification } from '@/lib/mail';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, subject, message } = await req.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create contact record
    const contact = await Contact.create({
      name,
      email: email.toLowerCase(),
      subject,
      message,
    });

    // Send emails
    try {
      await Promise.all([
        sendContactReply(email, name, subject, message),
        sendAdminNotification({ name, email, subject, message }),
      ]);
      console.log('[v0] Emails sent successfully');
    } catch (emailError) {
      console.error('[v0] Error sending emails:', emailError);
      // Don't fail the API call if email fails
    }

    return NextResponse.json(
      { message: 'Message received successfully', contactId: contact._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');

    let query: any = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    return NextResponse.json(
      {
        contacts,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Get contacts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
