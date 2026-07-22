import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid_request' }, { status: 400 });

  const sql = db();
  const rows = await sql`select id, password_hash from users where email = ${parsed.data.email}`;
  const user = rows[0] as { id: string; password_hash: string } | undefined;
  if (!user) return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });

  const valid = await verifyPassword(parsed.data.password, user.password_hash);
  if (!valid) return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
