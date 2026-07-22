import { neon } from '@neondatabase/serverless';

// Lazy singleton — a top-level neon() call would throw at build time before
// DATABASE_URL exists (e.g. first deploy before the Neon integration is
// connected), since Next.js evaluates module-level code during `next build`.
let _sql: ReturnType<typeof neon> | null = null;

export function db() {
  if (!_sql) _sql = neon(process.env.DATABASE_URL!);
  return _sql;
}
