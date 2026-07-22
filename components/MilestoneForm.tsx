'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MilestoneForm({ launchId }: { launchId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return (
      <button className="button secondary" onClick={() => setOpen(true)}>
        Add milestone
      </button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch(`/api/launches/${launchId}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, ownerName, ownerEmail: ownerEmail || undefined, dueDate: dueDate || undefined }),
    });
    setSubmitting(false);
    if (res.ok) {
      setOpen(false);
      setTitle('');
      setOwnerName('');
      setOwnerEmail('');
      setDueDate('');
      router.refresh();
    }
  }

  return (
    <form className="inlineForm" onSubmit={handleSubmit}>
      <input className="input" placeholder="Milestone title" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
      <input className="input" placeholder="Owner" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
      <input
        className="input"
        placeholder="Owner email (optional)"
        type="email"
        value={ownerEmail}
        onChange={(e) => setOwnerEmail(e.target.value)}
      />
      <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <div className="formActions">
        <button className="button primary" type="submit" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add'}
        </button>
        <button className="button secondary" type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
