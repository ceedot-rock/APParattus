'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  endpoint: string;
  currentStatus: string;
  options: readonly string[];
}

export default function StatusSelect({ endpoint, currentStatus, options }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [pending, setPending] = useState(false);

  async function handleChange(next: string) {
    setStatus(next);
    setPending(true);
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    setPending(false);
    if (res.ok) router.refresh();
    else setStatus(currentStatus);
  }

  return (
    <select
      className={`select statusSelect status-${status}`}
      value={status}
      disabled={pending}
      onChange={(e) => handleChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.replace(/_/g, ' ')}
        </option>
      ))}
    </select>
  );
}
