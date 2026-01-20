'use client';

import { Link } from '@/lib/types';
import { LinkItem } from './link-item';
import { useRouter, useSearchParams } from 'next/navigation';

export function LinkList({ links }: { links: Link[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter') || 'unread';

    const filteredLinks = links.filter(link => {
        if (filter === 'read') return link.read === 1;
        return link.read === 0;
    });

    const setFilter = (newFilter: 'read' | 'unread') => {
        const params = new URLSearchParams(searchParams);
        if (newFilter === 'unread') {
            params.delete('filter'); // Default
        } else {
            params.set('filter', newFilter);
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-md mx-auto pb-20"> {/* Mobile container with padding for bottom safe area */}

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-lg mb-6 sticky top-2 z-10 shadow-sm backdrop-blur-sm bg-opacity-90">
                <button
                    onClick={() => setFilter('unread')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${filter === 'unread'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Unread
                </button>
                <button
                    onClick={() => setFilter('read')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${filter === 'read'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Read
                </button>
            </div>

            {/* List */}
            <div className="space-y-1 min-h-[50vh]">
                {filteredLinks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No links found.</p>
                    </div>
                ) : (
                    filteredLinks.map(link => (
                        <LinkItem key={link.id} link={link} />
                    ))
                )}
            </div>
        </div>
    );
}
