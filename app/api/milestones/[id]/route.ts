import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';

const schema = z.object({ status: z.enum(['not_started', 'in_progress', 'blocked', 'done']) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { id } = await params;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid_request' }, { status: 400 });

  const sql = db();
  const rows = await sql`
    update milestones m set status = ${parsed.data.status}, updated_at = now()
    from launches l
    where m.id = ${id} and m.launch_id = l.id and l.owner_id = ${userId}
    returning m.*
  `;
  const milestone = rows[0];
  if (!milestone) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ milestone });
}
