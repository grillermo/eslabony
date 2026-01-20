import { NextRequest } from 'next/server';
import { POST, PATCH } from '@/app/api/links/route';

// Mock the db module
jest.mock('@/lib/db', () => {
    const Database = require('better-sqlite3');
    const db = new Database(':memory:');
    db.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      note TEXT,
      read INTEGER DEFAULT 0,
      timestamp INTEGER NOT NULL
    )
  `);
    return {
        __esModule: true,
        default: db,
    };
});

describe('Links API', () => {
    const AUTH_TOKEN = 'SECRET_TOKEN_123';

    describe('POST /api/links', () => {
        it('should create a link when authenticated', async () => {
            const body = { link: 'https://example.com', note: 'Test Note' };
            const req = new NextRequest('http://localhost:3000/api/links', {
                method: 'POST',
                headers: {
                    'authorization': AUTH_TOKEN,
                    'content-type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const res = await POST(req);
            const json = await res.json();

            expect(res.status).toBe(201);
            expect(json.message).toBe('Link saved');
            expect(json.id).toBeDefined();
        });

        it('should return 401 when unauthenticated', async () => {
            const body = { link: 'https://example.com' };
            const req = new NextRequest('http://localhost:3000/api/links', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const res = await POST(req);
            expect(res.status).toBe(401);
        });

        it('should return 400 for invalid body', async () => {
            const body = { note: 'Missing link' };
            const req = new NextRequest('http://localhost:3000/api/links', {
                method: 'POST',
                headers: {
                    'authorization': AUTH_TOKEN,
                    'content-type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const res = await POST(req);
            expect(res.status).toBe(400);
        });
    });

    describe('PATCH /api/links', () => {
        let linkId: string;

        beforeAll(async () => {
            // Create a link to patch
            const body = { link: 'https://patch-test.com', note: 'To be patched' };
            const req = new NextRequest('http://localhost:3000/api/links', {
                method: 'POST',
                headers: { 'authorization': AUTH_TOKEN },
                body: JSON.stringify(body),
            });
            const res = await POST(req);
            const json = await res.json();
            linkId = json.id;
        });

        it('should mark link as read', async () => {
            const body = { id: linkId, read: true };
            const req = new NextRequest('http://localhost:3000/api/links', {
                method: 'PATCH',
                headers: {
                    'authorization': AUTH_TOKEN,
                    'content-type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const res = await PATCH(req);
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json.message).toBe('Link updated');
        });

        it('should return 404 for non-existent id', async () => {
            const body = { id: 'non-existent-id', read: true };
            const req = new NextRequest('http://localhost:3000/api/links', {
                method: 'PATCH',
                headers: {
                    'authorization': AUTH_TOKEN,
                    'content-type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const res = await PATCH(req);
            expect(res.status).toBe(404);
        });
    });
});
