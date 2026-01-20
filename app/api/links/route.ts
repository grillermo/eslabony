import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

const AUTH_TOKEN = 'SECRET_TOKEN_123';

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

export async function POST(req: NextRequest) {
    if (!isAuthenticated(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { link, note } = body;

        if (!link || typeof link !== 'string') {
            return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
        }

        const id = crypto.randomUUID();
        const timestamp = Date.now();
        const stmt = db.prepare('INSERT INTO links (id, url, note, read, timestamp) VALUES (?, ?, ?, 0, ?)');
        stmt.run(id, link, note || '', timestamp);

        return NextResponse.json({ message: 'Link saved', id }, { status: 201 });
    } catch (error) {
        console.error('Error saving link:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    // Assuming basic auth for patch as well, or maybe public if simpler? 
    // User said "PATCH link: allows you to update the read property".
    // I'll stick to requiring auth for consistency, but if the UI is client-side public, this might be an issue.
    // Ideally, clicking a link to mark it as read should be seamless. 
    // If this is a personal tool, maybe I check for a cookie or just allow it if the ID exists?
    // Let's enforce auth for now as per "POST link: accepts an authentication token".
    // Actually, for the UI to be seamless, the UI needs the token.

    // Re-reading: "POST link: accepts an authentication token... GET links: ... when a link is clicked, it is marked as read... PATCH link: allows you to update the read property".
    // It doesn't explicitly say PATCH needs auth, but POST does. 
    // If I put auth on PATCH, the client needs the token. 
    // For this demo, I'll relax auth on PATCH or assume the client has it. 
    // Let's create a .env.local like setup for the client later?
    // For now, I'll Require Auth. I will hardcode the token in the client for the demo.

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
