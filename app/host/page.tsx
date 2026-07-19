"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Rsvp = {
  id: string;
  guestName: string;
  acceptedAt: string;
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function HostPage() {
  const [pin, setPin] = useState("");
  const [rsvps, setRsvps] = useState<Rsvp[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadGuestList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/host/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const result = (await response.json()) as { rsvps?: Rsvp[]; error?: string };

      if (!response.ok || !result.rsvps) {
        throw new Error(result.error || "The guest list could not be loaded.");
      }

      setRsvps(result.rsvps);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The guest list could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  function downloadCsv() {
    if (!rsvps) return;

    const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = [
      ["Guest name", "Accepted at"],
      ...rsvps.map((rsvp) => [rsvp.guestName, formatTime(rsvp.acceptedAt)]),
    ];
    const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "jasmine-baby-shower-rsvps.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="host-shell">
      <div className="host-floral" aria-hidden="true" />
      <section className="host-panel" aria-labelledby="host-title">
        <Link className="host-back" href="/">← Invitation</Link>
        <p className="host-eyebrow">Ryan &amp; Karen · Host view</p>
        <h1 id="host-title">Jasmine’s guest list</h1>

        {rsvps === null ? (
          <form className="host-login" onSubmit={loadGuestList}>
            <p>Enter the private host PIN to view accepted invitations.</p>
            <label htmlFor="host-pin">Host PIN</label>
            <input
              id="host-pin"
              type="password"
              inputMode="text"
              autoComplete="current-password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              placeholder="Enter host PIN"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Opening guest list…" : "View guest list"}
            </button>
            <p className="host-error" aria-live="polite">{error}</p>
          </form>
        ) : (
          <div className="guest-log">
            <div className="guest-log-toolbar">
              <div>
                <strong>{rsvps.length}</strong>
                <span>{rsvps.length === 1 ? "accepted RSVP" : "accepted RSVPs"}</span>
              </div>
              <button type="button" onClick={downloadCsv} disabled={rsvps.length === 0}>
                Download CSV
              </button>
            </div>

            {rsvps.length === 0 ? (
              <div className="empty-list">
                <span>♡</span>
                <p>No one has accepted yet. New RSVPs will appear here.</p>
              </div>
            ) : (
              <ol className="guest-list">
                {rsvps.map((rsvp, index) => (
                  <li key={rsvp.id}>
                    <span className="guest-number">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{rsvp.guestName}</strong>
                      <time dateTime={rsvp.acceptedAt}>{formatTime(rsvp.acceptedAt)}</time>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
