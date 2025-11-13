import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Link from '@/models/Link';
import ProfileClient from './profile-client';

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  await connectDB();

  const user = await User.findOne({ username: username.toLowerCase() }).lean();

  if (!user) {
    notFound();
  }

  const links = await Link.find({ userId: user._id, active: true })
    .sort({ order: 1 })
    .select('-clicks')
    .lean();

  return (
    <ProfileClient
      user={{
        displayName: user.displayName,
        bio: user.bio,
        avatar: user.avatar,
        theme: user.theme,
      }}
      links={links.map((link) => ({
        _id: link._id.toString(),
        title: link.title,
        url: link.url,
        icon: link.icon,
      }))}
    />
  );
}
