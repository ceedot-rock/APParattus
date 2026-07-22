import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(60),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request', issues: parsed.error.issues }, { status: 400 });
  }
  const { email, password, displayName } = parsed.data;

  const sql = db();
  const existing = (await sql`select id from users where email = ${email}`) as { id: string }[];
  if (existing.length > 0) {
    return NextResponse.json({ error: 'email_taken' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const inserted = (await sql`
    insert into users (email, password_hash, display_name)
    values (${email}, ${passwordHash}, ${displayName})
    returning id
  `) as { id: string }[];

  await createSession(inserted[0].id);
  return NextResponse.json({ ok: true });
}
