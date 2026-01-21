import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

const AUTH_TOKEN = process.env.AUTH_TOKEN;

function isAuthenticated(req: NextRequest) {
    const token = req.headers.get('authorization');
    return token === AUTH_TOKEN;
}

export async function GET(req: NextRequest) {
    try {
        const stmt = db.prepare('SELECT * FROM links ORDER BY timestamp DESC');
        const links = stmt.all();
        return NextResponse.json(links);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function getTitle(url: string): Promise<string | null> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; LinkSaver/1.0)',
            },
            signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (!response.ok) return null;

        const html = await response.text();
        const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

        if (match && match[1]) {
            // Basic HTML entity decoding for common ones
            return match[1]
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#039;/g, "'")
                .trim();
        }
        return null;
    } catch (error) {
        console.error('Error fetching title:', error);
        return null;
    }
}

export async function POST(req: NextRequest) {
    if (!isAuthenticated(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { link } = body;
        let { note } = body;

        if (!link || typeof link !== 'string') {
            return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
        }

        // If note is missing or empty, try to fetch the title
        if (!note || typeof note !== 'string' || note.trim() === '') {
            const fetchedTitle = await getTitle(link);
            note = fetchedTitle || '';
        }

        const id = crypto.randomUUID();
        const timestamp = Date.now();
        const stmt = db.prepare('INSERT INTO links (id, url, note, read, timestamp) VALUES (?, ?, ?, 0, ?)');
        stmt.run(id, link, note || '', timestamp);

        return NextResponse.json({ message: 'Link saved', id, note }, { status: 201 });
    } catch (error) {
        console.error('Error saving link:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    if (!isAuthenticated(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, read } = body;

        if (!id || typeof id !== 'string' || typeof read !== 'boolean') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const stmt = db.prepare('UPDATE links SET read = ? WHERE id = ?');
        const result = stmt.run(read ? 1 : 0, id);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Link updated' });
    } catch (error) {
        console.error('Error updating link:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    if (!isAuthenticated(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id } = body;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const stmt = db.prepare('DELETE FROM links WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Link deleted' });
    } catch (error) {
        console.error('Error deleting link:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
