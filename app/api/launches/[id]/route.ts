import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';

const patchSchema = z.object({
  status: z.enum(['planning', 'in_progress', 'at_risk', 'shipped', 'archived']),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { id } = await params;

  const sql = db();
  const rows = (await sql`select * from launches where id = ${id} and owner_id = ${userId}`) as Record<string, any>[];
  const launch = rows[0];
  if (!launch) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const milestones = await sql`select * from milestones where launch_id = ${id} order by sort_order asc, created_at asc`;
  const risks = await sql`select * from risks where launch_id = ${id} order by created_at desc`;

  return NextResponse.json({ launch, milestones, risks });
}

// Status-only updates for now — the launch's name/summary/criteria are set
// once at creation. Broader inline editing is a reasonable v2, not needed
// to make the core loop (plan -> track -> ship) work.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { id } = await params;

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid_request', issues: parsed.error.issues }, { status: 400 });

  const sql = db();
  const rows = (await sql`
    update launches set status = ${parsed.data.status}, updated_at = now()
    where id = ${id} and owner_id = ${userId}
    returning *
  `) as Record<string, any>[];
  const launch = rows[0];
  if (!launch) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ launch });
}
