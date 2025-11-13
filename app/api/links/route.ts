import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Link from '@/models/Link';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const links = await Link.find({ userId: (session.user as any).id })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ links });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, url, icon } = await req.json();

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get the highest order number for this user
    const maxOrderLink = await Link.findOne({ userId: (session.user as any).id })
      .sort({ order: -1 })
      .select('order');

    const newOrder = maxOrderLink ? maxOrderLink.order + 1 : 0;

    const link = await Link.create({
      userId: (session.user as any).id,
      title,
      url,
      icon,
      order: newOrder,
    });

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}
