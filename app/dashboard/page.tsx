import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';
import CreateLaunchForm from '@/components/CreateLaunchForm';
import LogoutButton from '@/components/LogoutButton';

// Reads the caller's live launch list on every request — without this,
// Next.js would cache the underlying Neon query and this page could freeze
// on whatever data existed at build time (see APParattus's own history:
// the marketing page shipped for a week before the database even existed).
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard — APParattus',
};

const STATUS_LABEL: Record<string, string> = {
  planning: 'Planning',
  in_progress: 'In progress',
  at_risk: 'At risk',
  shipped: 'Shipped',
  archived: 'Archived',
};

export default async function DashboardPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const sql = db();
  const launches = (await sql`
    select l.*,
      (select count(*) from milestones m where m.launch_id = l.id) as milestone_count,
      (select count(*) from milestones m where m.launch_id = l.id and m.status = 'done') as milestones_done,
      (select count(*) from risks r where r.launch_id = l.id and r.status = 'open') as open_risks
    from launches l
    where l.owner_id = ${userId}
    order by l.created_at desc
  `) as Record<string, any>[];

  return (
    <main className="appShell">
      <nav className="appNav">
        <Link className="brand" href="/">
          <span className="brandMark">A</span>
          <span>APParattus</span>
        </Link>
        <LogoutButton />
      </nav>

      <div className="appHeader">
        <div>
          <p className="eyebrow">Your launches</p>
          <h1 className="appTitle">Dashboard</h1>
        </div>
        <CreateLaunchForm />
      </div>

      {launches.length === 0 ? (
        <div className="panel emptyState">
          <h3>No launches yet</h3>
          <p>Create your first launch to start sequencing milestones and tracking risk.</p>
        </div>
      ) : (
        <div className="launchGrid">
          {launches.map((l: any) => {
            const total = Number(l.milestone_count);
            const done = Number(l.milestones_done);
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <Link key={l.id} href={`/launches/${l.id}`} className="panel launchCard">
                <div className="launchCardHead">
                  <h3>{l.name}</h3>
                  <span className={`statusPill status-${l.status}`}>{STATUS_LABEL[l.status] ?? l.status}</span>
                </div>
                {l.summary && <p className="launchSummary">{l.summary}</p>}
                <div className="progress">
                  <span style={{ width: `${pct}%` }} />
                </div>
                <div className="launchMeta">
                  <span>
                    {done}/{total} milestones
                  </span>
                  {Number(l.open_risks) > 0 && <span className="riskBadge">{l.open_risks} open risk{Number(l.open_risks) === 1 ? '' : 's'}</span>}
                  {l.target_date && <span>Target {new Date(l.target_date).toLocaleDateString()}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
