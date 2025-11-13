'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink } from 'lucide-react';

interface Link {
  _id: string;
  title: string;
  url: string;
  icon?: string;
}

interface User {
  displayName: string;
  bio?: string;
  avatar?: string;
  theme: {
    backgroundColor: string;
    buttonColor: string;
    buttonTextColor: string;
    fontFamily: string;
  };
}

interface Props {
  user: User;
  links: Link[];
}

export default function ProfileClient({ user, links }: Props) {
  async function handleLinkClick(linkId: string, url: string) {
    // Track click
    try {
      await fetch(`/api/links/${linkId}/click`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to track click:', error);
    }

    // Open link
    window.open(url, '_blank');
  }

  return (
    <div
      className="min-h-screen p-4 py-12"
      style={{
        backgroundColor: user.theme.backgroundColor,
        fontFamily: user.theme.fontFamily,
      }}
    >
      <div className="mx-auto max-w-2xl">
        {/* Profile Header */}
        <div className="mb-8 text-center">
          <Avatar className="mx-auto mb-4 h-24 w-24">
            <AvatarImage src={user.avatar} alt={user.displayName} />
            <AvatarFallback className="text-2xl">
              {user.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="mb-2 text-2xl font-bold">{user.displayName}</h1>
          {user.bio && <p className="text-muted-foreground">{user.bio}</p>}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.length === 0 ? (
            <p className="text-center text-muted-foreground">No links available</p>
          ) : (
            links.map((link) => (
              <button
                key={link._id}
                onClick={() => handleLinkClick(link._id, link.url)}
                className="group w-full rounded-lg p-4 transition-all hover:scale-105"
                style={{
                  backgroundColor: user.theme.buttonColor,
                  color: user.theme.buttonTextColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{link.title}</span>
                  <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Create your own link page</p>
        </div>
      </div>
    </div>
  );
}
