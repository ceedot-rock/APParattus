import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';

const createSchema = z.object({
  name: z.string().min(1).max(120),
  summary: z.string().max(2000).optional(),
  successCriteria: z.string().max(2000).optional(),
  targetDate: z.string().optional(),
});

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const sql = db();
  const launches = await sql`
    select l.*,
      (select count(*) from milestones m where m.launch_id = l.id) as milestone_count,
      (select count(*) from milestones m where m.launch_id = l.id and m.status = 'done') as milestones_done,
      (select count(*) from risks r where r.launch_id = l.id and r.status = 'open') as open_risks
    from launches l
    where l.owner_id = ${userId}
    order by l.created_at desc
  `;
  return NextResponse.json({ launches });
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request', issues: parsed.error.issues }, { status: 400 });
  }

  const sql = db();
  const inserted = (await sql`
    insert into launches (owner_id, name, summary, success_criteria, target_date)
    values (
      ${userId},
      ${parsed.data.name},
      ${parsed.data.summary ?? null},
      ${parsed.data.successCriteria ?? null},
      ${parsed.data.targetDate ?? null}
    )
    returning *
  `) as Record<string, any>[];
  return NextResponse.json({ launch: inserted[0] }, { status: 201 });
}
