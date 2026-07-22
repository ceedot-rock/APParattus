'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RiskForm({ launchId }: { launchId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return (
      <button className="button secondary" onClick={() => setOpen(true)}>
        Flag a risk
      </button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch(`/api/launches/${launchId}/risks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, severity }),
    });
    setSubmitting(false);
    if (res.ok) {
      setOpen(false);
      setDescription('');
      setSeverity('medium');
      router.refresh();
    }
  }

  return (
    <form className="inlineForm" onSubmit={handleSubmit}>
      <input
        className="input"
        placeholder="What's the risk?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        autoFocus
      />
      <select className="select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
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
