"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

const petals = [
  { left: "7%", delay: "0s", duration: "13s" },
  { left: "18%", delay: "-5s", duration: "17s" },
  { left: "42%", delay: "-10s", duration: "16s" },
  { left: "67%", delay: "-2s", duration: "14s" },
  { left: "84%", delay: "-8s", duration: "18s" },
  { left: "94%", delay: "-12s", duration: "15s" },
];

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M7 3v3m10-3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="M9.2 14.1c.9-1.1 2.7-.4 2.8.8.1-1.2 1.9-1.9 2.8-.8 1.4 1.8-2.8 4.2-2.8 4.2s-4.2-2.4-2.8-4.2Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20.8 5.9c-1.8-1.9-4.8-2-6.7-.1L12 7.9 9.9 5.8A4.7 4.7 0 0 0 3.2 12L12 20.5l8.8-8.5a4.4 4.4 0 0 0 0-6.1Z" />
    </svg>
  );
}

export default function Home() {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const guestName = name.trim();

    if (guestName.length < 2) {
      setState("error");
      setMessage("Please enter your name so we know who is coming.");
      return;
    }

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName, website }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error || "We could not save your RSVP.");
      }

      setState("success");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not save your RSVP. Please try again.",
      );
    }
  }

  return (
    <main className="invitation-shell">
      <div className="paper-texture" aria-hidden="true" />
      <div className="floral-border" aria-hidden="true" />
      <div className="petal-field" aria-hidden="true">
        {petals.map((petal, index) => (
          <span
            className="falling-petal"
            key={index}
            style={{
              left: petal.left,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
            }}
          />
        ))}
      </div>

      <header className="wordmark" aria-label="Jasmine baby shower">
        <span>Jasmine</span>
        <span className="wordmark-flourish" aria-hidden="true">
          <i />
          <b>✿</b>
          <i />
        </span>
      </header>

      <div className="invitation-grid">
        <section className="invitation-copy" aria-labelledby="invitation-title">
          <p className="eyebrow">You’re invited</p>
          <h1 id="invitation-title">
            Celebrating
            <br />
            baby <em>Jasmine</em>
          </h1>
          <div className="heart-divider" aria-hidden="true">
            <span />
            <HeartIcon />
            <span />
          </div>
          <p className="hosts">Ryan &amp; Karen’s Baby Shower</p>

          <dl className="event-details">
            <div>
              <dt><CalendarIcon /><span className="sr-only">Date and time</span></dt>
              <dd>August 22 <span>·</span> 5:00 PM</dd>
            </div>
            <div>
              <dt><LocationIcon /><span className="sr-only">Location</span></dt>
              <dd>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=6582+Violet+Breeze+Way"
                  target="_blank"
                  rel="noreferrer"
                >
                  6582 Violet Breeze Way
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section
          className={`rsvp-card ${state === "success" ? "is-success" : ""}`}
          aria-labelledby={state === "success" ? undefined : "rsvp-title"}
          aria-label={state === "success" ? "RSVP confirmation" : undefined}
        >
          <div className="card-corner card-corner-top" aria-hidden="true">❀</div>
          <div className="card-corner card-corner-bottom" aria-hidden="true">⌁</div>

          {state === "success" ? (
            <div className="success-state" role="status" aria-live="polite">
              <div className="success-heart"><HeartIcon /></div>
              <p className="card-kicker">RSVP received</p>
              <h2>We can’t wait to celebrate with you, {name.trim().split(/\s+/)[0]}!</h2>
              <p>Your name has been added to Jasmine’s guest list.</p>
              <a className="calendar-button" href="/jasmine-baby-shower.ics" download>
                <CalendarIcon />
                <span>Add to calendar</span>
              </a>
              <div className="sparkles" aria-hidden="true">
                <i>✦</i><i>✧</i><i>✦</i><i>✧</i><i>✦</i>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="card-heart" aria-hidden="true"><HeartIcon /></div>
              <p className="card-kicker">Kindly respond</p>
              <h2 id="rsvp-title">Will you be joining us?</h2>
              <p className="card-note">Enter your name to accept the invitation.</p>

              <label htmlFor="guest-name">Your name</label>
              <input
                id="guest-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={80}
                placeholder="First and last name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (state === "error") setState("idle");
                }}
                aria-describedby={message ? "form-message" : undefined}
                aria-invalid={state === "error"}
                disabled={state === "submitting"}
                required
              />

              <div className="honeypot" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </div>

              <button type="submit" disabled={state === "submitting"}>
                <span>{state === "submitting" ? "Saving your RSVP…" : "Accept invitation"}</span>
                {state === "submitting" ? <i className="spinner" aria-hidden="true" /> : <HeartIcon />}
              </button>

              <p
                id="form-message"
                className={`form-message ${state === "error" ? "visible" : ""}`}
                aria-live="polite"
              >
                {message}
              </p>
            </form>
          )}
        </section>
      </div>

      <footer>With love, Ryan &amp; Karen</footer>
    </main>
  );
}
