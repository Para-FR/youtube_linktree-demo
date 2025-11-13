'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Trash2, ExternalLink, BarChart3, LogOut, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Link {
  _id: string;
  title: string;
  url: string;
  active: boolean;
  clicks: number;
  order: number;
  icon?: string;
}

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  username?: string;
}

// Composant sortable pour chaque lien
function SortableLink({
  link,
  onToggle,
  onDelete,
}: {
  link: Link;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 rounded-lg border p-4 bg-white"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{link.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{link.url}</p>
        <p className="text-xs text-muted-foreground mt-1">
          <BarChart3 className="inline h-3 w-3 mr-1" />
          {link.clicks} clicks
        </p>
      </div>
      <Switch
        checked={link.active}
        onCheckedChange={(checked) => onToggle(link._id, checked)}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(link._id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function DashboardClient({ user }: { user: User }) {
  const [links, setLinks] = useState<Link[]>([]);
  const [profile, setProfile] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isLoading, setIsLoading] = useState(true);
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchLinks();
    fetchProfile();
  }, []);

  async function fetchLinks() {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data.links || []);
    } catch (error) {
      toast.error('Failed to fetch links');
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      setProfile(data.user);
    } catch (error) {
      toast.error('Failed to fetch profile');
    }
  }

  async function addLink(e: React.FormEvent) {
    e.preventDefault();

    if (!newLink.title || !newLink.url) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink),
      });

      if (res.ok) {
        toast.success('Link added successfully');
        setNewLink({ title: '', url: '' });
        fetchLinks();
      } else {
        toast.error('Failed to add link');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  }

  async function toggleLink(id: string, active: boolean) {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });

      if (res.ok) {
        toast.success(active ? 'Link activated' : 'Link deactivated');
        fetchLinks();
      }
    } catch (error) {
      toast.error('Failed to update link');
    }
  }

  async function deleteLink(id: string) {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Link deleted');
        fetchLinks();
      }
    } catch (error) {
      toast.error('Failed to delete link');
    }
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: formData.get('displayName'),
          bio: formData.get('bio'),
        }),
      });

      if (res.ok) {
        toast.success('Profile updated');
        fetchProfile();
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: '/login' });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = links.findIndex((link) => link._id === active.id);
    const newIndex = links.findIndex((link) => link._id === over.id);

    const newLinks = arrayMove(links, oldIndex, newIndex);

    // Mettre à jour l'UI immédiatement
    setLinks(newLinks);

    // Mettre à jour l'ordre dans la base de données
    try {
      const updates = newLinks.map((link, index) => ({
        id: link._id,
        order: index,
      }));

      const res = await fetch('/api/links/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      if (!res.ok) {
        // Revenir à l'ancien ordre si l'API échoue
        toast.error('Failed to update order');
        fetchLinks();
      } else {
        toast.success('Order updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update order');
      fetchLinks();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.open(`/${user.username}`, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Page
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Tabs defaultValue="links" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Link</CardTitle>
                <CardDescription>Create a new link for your page</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={addLink} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="My Website"
                        value={newLink.title}
                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://example.com"
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Link
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Links</CardTitle>
                <CardDescription>Drag to reorder your links</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading...</p>
                ) : links.length === 0 ? (
                  <p className="text-muted-foreground">No links yet. Add your first link above!</p>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={links.map((link) => link._id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {links.map((link) => (
                          <SortableLink
                            key={link._id}
                            link={link}
                            onToggle={toggleLink}
                            onDelete={deleteLink}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                {profile && (
                  <form onSubmit={updateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        name="displayName"
                        defaultValue={profile.displayName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about yourself..."
                        maxLength={160}
                        defaultValue={profile.bio || ''}
                      />
                      <p className="text-xs text-muted-foreground">Max 160 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input value={profile.username} disabled />
                      <p className="text-xs text-muted-foreground">
                        Your page: /{profile.username}
                      </p>
                    </div>
                    <Button type="submit">Save Changes</Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
