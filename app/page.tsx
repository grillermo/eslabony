import Image from 'next/image';
import { LinkList } from '@/components/link-list';
import { Link } from '@/lib/types';

// Force dynamic rendering to ensure fresh data on every request
export const dynamic = 'force-dynamic';

async function getLinks(): Promise<Link[]> {
  const { default: db } = await import('@/lib/db');
  const stmt = db.prepare('SELECT * FROM links ORDER BY timestamp DESC');
  return stmt.all() as Link[];
}

export default async function Home() {
  const links = await getLinks();

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 font-sans p-4 flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <header className="text-center justify-center">
          <Image
            src="/logo.png"
            alt="Link Saver Logo"
            width={120}
            height={40}
            priority
            className="h-auto w-auto inline-block"
          />
        </header>
        <LinkList links={links} />
      </div>
    </main>
  );
}
