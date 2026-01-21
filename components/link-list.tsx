'use client';

import { Link } from '@/lib/types';
import { LinkItem } from './link-item';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { read } from 'fs';

export function LinkList({ links: initialLinks }: { links: Link[] }) {
    const router = useRouter();
    const [links, setLinks] = useState(initialLinks);
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter') || 'unread';

    // Update local state when server props change
    useEffect(() => {
        setLinks(initialLinks);
    }, [initialLinks]);

    const handleMarkAsRead = (id: string) => {
        setLinks(prev => prev.map(l => l.id === id ? { ...l, read: 1 } : l));
    };

    const filteredLinks = links.filter(link => {
        if (filter === 'read') return link.read === 1;
        return link.read === 0;
    });

    const readLinksCount = links.filter(link => link.read === 1).length;
    const unreadLinksCount = links.filter(link => link.read === 0).length;

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
        <div className=""> {/* Mobile container with padding for bottom safe area */}

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-lg mb-6 top-2 z-10 backdrop-blur-sm">
                <button
                    onClick={() => setFilter('unread')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all hover:cursor-pointer ${filter === 'unread'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Unread {unreadLinksCount}
                </button>
                <button
                    onClick={() => setFilter('read')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all hover:cursor-pointer ${filter === 'read'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Read {readLinksCount}
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
                        <LinkItem key={link.id} link={link} onMarkAsRead={handleMarkAsRead} />
                    ))
                )}
            </div>
        </div>
    );
}
