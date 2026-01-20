import Image from 'next/image';
import { LinkList } from '@/components/link-list';
import { Link } from '@/lib/types';

// Force dynamic rendering to ensure fresh data on every request
export const dynamic = 'force-dynamic';

async function getLinks(): Promise<Link[]> {
  // In a real production app we might use an absolute URL or call DB directly
  // Since we are server-side, we can call DB directly to avoid "localhost" issues or overhead
  // But to strictly follow the "GET links" endpoint requirement, the UI *could* call it.
  // However, calling "http://localhost:3000/api/links" from the server during build/runtime can be flaky.
  // Best practice in Next.js App Router for Server Components is to call the DB logic directly.
  // "GET links displays all the links..." - I implemented the endpoint. I will use the endpoint logic logic directly or valid fetch.
  // I will use direct DB access here for reliability, as the endpoint is just a wrapper.

  const { default: db } = await import('@/lib/db');
  const stmt = db.prepare('SELECT * FROM links ORDER BY timestamp DESC');
  return stmt.all() as Link[];
}

export default async function Home() {
  const links = await getLinks();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 safe-area-inset-bottom">
      <header className="mb-6 pt-2 flex justify-center">
        <Image
          src="/logo.png"
          alt="Link Saver Logo"
          width={180}
          height={60}
          priority
          className="h-auto w-auto"
        />
      </header>

      <LinkList links={links} />
    </main>
  );
}
