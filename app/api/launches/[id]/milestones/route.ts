import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';

const schema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  ownerName: z.string().min(1).max(120),
  ownerEmail: z.string().email().optional().or(z.literal('')),
  dueDate: z.string().optional(),
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

  const orderRows = (await sql`select coalesce(max(sort_order), -1) + 1 as next_order from milestones where launch_id = ${launchId}`) as {
    next_order: number;
  }[];
  const nextOrder = orderRows[0].next_order;

  const inserted = (await sql`
    insert into milestones (launch_id, title, description, owner_name, owner_email, due_date, sort_order)
    values (
      ${launchId},
      ${parsed.data.title},
      ${parsed.data.description ?? null},
      ${parsed.data.ownerName},
      ${parsed.data.ownerEmail || null},
      ${parsed.data.dueDate || null},
      ${nextOrder}
    )
    returning *
  `) as Record<string, any>[];
  return NextResponse.json({ milestone: inserted[0] }, { status: 201 });
}
