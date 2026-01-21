'use client';

import { Link } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AUTH_TOKEN = '44p9Wq6iJRxp4DE2vp4b3Yw6KWhRjcNohjDetwwRNy4K7cyUcxdwuWTUxVZUJkhWVjU';

export function LinkItem({ link, onMarkAsRead }: { link: Link, onMarkAsRead?: (id: string) => void }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const markAsRead = async () => {
        if (loading || link.read) return;
        setLoading(true);
        if (onMarkAsRead) {
            onMarkAsRead(link.id);
        }

        try {
            const res = await fetch('/api/links', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify({ id: link.id, read: true })
            });

            if (res.ok) {
                // Refresh the current route to fetch updated data
                router.refresh();
            } else {
                console.error('Failed to mark as read');
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={markAsRead}
            className={`
        block p-4 mb-3 rounded-xl border border-blue-200 transition-all active:scale-[0.98] cursor-pointer text-inherit no-underline hover:cursor-pointer
        ${link.read
                    ? 'bg-gray-100 opacity-60'
                    : '' // Active/Unread state
                }
        ${loading ? 'animate-pulse' : ''}
      `}
        >
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 overflow-hidden">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                        {link.note || link.url}
                    </h3>
                    <p className="text-sm text-gray-500 truncate mt-1 font-mono">
                        {link.url}
                    </p>
                </div>
                {!link.read && (
                    <span className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2" title="Unread" />
                )}
            </div>
            <div className="mt-2 text-xs text-gray-400">
                {new Date(link.timestamp).toLocaleString()}
            </div>
        </a>
    );
}
