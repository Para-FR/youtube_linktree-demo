import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <main className="container px-4 text-center">
        <h1 className="mb-4 text-6xl font-bold tracking-tight">
          Your Links, <span className="text-primary">One Place</span>
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Share all your important links in one simple, beautiful page
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
