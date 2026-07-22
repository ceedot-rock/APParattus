'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateLaunchForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return (
      <button className="button primary" onClick={() => setOpen(true)}>
        New launch
      </button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/launches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        summary: summary || undefined,
        successCriteria: successCriteria || undefined,
        targetDate: targetDate || undefined,
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      setOpen(false);
      setName('');
      setSummary('');
      setSuccessCriteria('');
      setTargetDate('');
      router.refresh();
    }
  }

  return (
    <form className="panel formPanel" onSubmit={handleSubmit}>
      <h3>New launch</h3>
      <label className="formField">
        <span>Name</span>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} autoFocus />
      </label>
      <label className="formField">
        <span>Summary</span>
        <textarea className="textarea" value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} />
      </label>
      <label className="formField">
        <span>Success criteria</span>
        <textarea
          className="textarea"
          value={successCriteria}
          onChange={(e) => setSuccessCriteria(e.target.value)}
          rows={2}
          placeholder="What does 'shipped' actually mean for this launch?"
        />
      </label>
      <label className="formField">
        <span>Target date</span>
        <input className="input" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
      </label>
      <div className="formActions">
        <button className="button primary" type="submit" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create launch'}
        </button>
        <button className="button secondary" type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
