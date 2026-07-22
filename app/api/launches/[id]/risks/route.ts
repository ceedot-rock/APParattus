import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';

const schema = z.object({
  description: z.string().min(1).max(1000),
  severity: z.enum(['low', 'medium', 'high']).default('medium'),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { id: launchId } = await params;

  const sql = db();
  const owned = (await sql`select id from launches where id = ${launchId} and owner_id = ${userId}`) as { id: string }[];
  if (owned.length === 0) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid_request', issues: parsed.error.issues }, { status: 400 });

  const inserted = (await sql`
    insert into risks (launch_id, description, severity)
    values (${launchId}, ${parsed.data.description}, ${parsed.data.severity})
    returning *
  `) as Record<string, any>[];
  return NextResponse.json({ risk: inserted[0] }, { status: 201 });
}
