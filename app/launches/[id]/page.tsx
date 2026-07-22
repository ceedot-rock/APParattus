import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';
import LogoutButton from '@/components/LogoutButton';
import MilestoneForm from '@/components/MilestoneForm';
import RiskForm from '@/components/RiskForm';
import StatusSelect from '@/components/StatusSelect';

export const dynamic = 'force-dynamic';

const LAUNCH_STATUSES = ['planning', 'in_progress', 'at_risk', 'shipped', 'archived'] as const;
const MILESTONE_STATUSES = ['not_started', 'in_progress', 'blocked', 'done'] as const;
const RISK_STATUSES = ['open', 'mitigated', 'closed'] as const;

export default async function LaunchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');
  const { id } = await params;

  const sql = db();
  const launchRows = await sql`select * from launches where id = ${id} and owner_id = ${userId}`;
  const launch = launchRows[0] as any;
  if (!launch) notFound();

  const milestones = await sql`select * from milestones where launch_id = ${id} order by sort_order asc, created_at asc`;
  const risks = await sql`select * from risks where launch_id = ${id} order by created_at desc`;

  const total = milestones.length;
  const done = milestones.filter((m: any) => m.status === 'done').length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <main className="appShell">
      <nav className="appNav">
        <Link className="brand" href="/">
          <span className="brandMark">A</span>
          <span>APParattus</span>
        </Link>
        <LogoutButton />
      </nav>

      <p className="breadcrumb">
        <Link href="/dashboard">Dashboard</Link> / {launch.name}
      </p>

      <div className="panel launchDetailHead">
        <div>
          <h1 className="appTitle">{launch.name}</h1>
          {launch.summary && <p className="launchSummary">{launch.summary}</p>}
          {launch.success_criteria && (
            <p className="successCriteria">
              <strong>Success looks like:</strong> {launch.success_criteria}
            </p>
          )}
        </div>
        <StatusSelect endpoint={`/api/launches/${launch.id}`} currentStatus={launch.status} options={LAUNCH_STATUSES} />
      </div>

      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="sectionHead">
          <h3>
            Milestones <span className="muted">({done}/{total})</span>
          </h3>
          <MilestoneForm launchId={launch.id} />
        </div>
        <div className="progress" style={{ marginBottom: 18 }}>
          <span style={{ width: `${pct}%` }} />
        </div>
        {milestones.length === 0 ? (
          <p className="muted">No milestones yet — break this launch into sequenced steps with owners and dates.</p>
        ) : (
          <table className="dataTable">
            <thead>
              <tr>
                <th>Milestone</th>
                <th>Owner</th>
                <th>Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((m: any) => (
                <tr key={m.id}>
                  <td>{m.title}</td>
                  <td>{m.owner_name}</td>
                  <td>{m.due_date ? new Date(m.due_date).toLocaleDateString() : '—'}</td>
                  <td>
                    <StatusSelect endpoint={`/api/milestones/${m.id}`} currentStatus={m.status} options={MILESTONE_STATUSES} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="panel">
        <div className="sectionHead">
          <h3>Risks</h3>
          <RiskForm launchId={launch.id} />
        </div>
        {risks.length === 0 ? (
          <p className="muted">No risks flagged. Good — or nobody's looked hard enough yet.</p>
        ) : (
          <table className="dataTable">
            <thead>
              <tr>
                <th>Risk</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r: any) => (
                <tr key={r.id}>
                  <td>{r.description}</td>
                  <td>
                    <span className={`severityPill severity-${r.severity}`}>{r.severity}</span>
                  </td>
                  <td>
                    <StatusSelect endpoint={`/api/risks/${r.id}`} currentStatus={r.status} options={RISK_STATUSES} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
