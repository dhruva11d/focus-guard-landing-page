"use client";

import { useId, useState } from "react";

const ITEMS = [
  {
    q: "Where does FocusGuard run?",
    a: "In your browser, with nothing to download from a store. Add it to your home screen and it opens full screen like an app. To join a room, open the link on your phone: Safari on iPhone, Chrome on Android.",
  },
  {
    q: "How does a room know my phone is face down?",
    a: "FocusGuard reads your phone's motion sensor through the browser. On iPhone you tap Allow when it asks for motion access. While a session runs, your screen is kept awake so the page stays open.",
  },
  {
    q: "What counts as an interruption in a room?",
    a: "Leaving the tab, or lifting your phone for more than a couple of seconds. It stays counted until you place the phone face down again.",
  },
  {
    q: "What happens if I leave during a solo session?",
    a: "Personal focus runs on its own, without the sensor. Leaving the tab ends the session right away, an alarm sounds and the session is saved as interrupted.",
  },
  {
    q: "How do rooms work?",
    a: "A host creates a room with a name and a focus length, then shares the room code. You enter the code once to become a member. When the host starts a session, everyone counts down the same timer.",
  },
  {
    q: "What does the host see?",
    a: "A list of everyone in the session with their status: preparing, focused, not focused, away or disconnected. The host can also end the session for everyone.",
  },
  {
    q: "Can I join a room from a laptop?",
    a: "Members need a phone, because the face-down check uses its motion sensor. A host can run the dashboard from any device.",
  },
  {
    q: "Do I need an account?",
    a: "Yes. You sign in with your email and confirm it through a link we send you. Your history belongs to your account.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className="faq">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div className="faq-item" data-open={isOpen} key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${base}-${i}`}
                id={`${base}-h${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </h3>
            <div className="faq-panel" id={`${base}-${i}`} role="region" aria-labelledby={`${base}-h${i}`}>
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
