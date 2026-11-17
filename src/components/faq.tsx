"use client";

import { useId, useState } from "react";

const ITEMS = [
  {
    q: "Where does FocusGuard run?",
    a: "In your browser, on your phone or your computer. There is nothing to download from a store. Add it to your home screen and it opens full screen like an app.",
  },
  {
    q: "What happens if I leave the tab?",
    a: "Closing the tab, switching to another tab or app, or locking your screen ends the session right away. On your own, an alarm sounds and the session is saved as interrupted. In a room, it ends for you and the host sees you as not focused.",
  },
  {
    q: "Can I use it alone?",
    a: "Yes. Personal focus is a timer just for you. Your history shows total focus time, completed and interrupted sessions, average length and your longest uninterrupted session.",
  },
  {
    q: "How do rooms work?",
    a: "A host creates a room with a name and a focus length, then shares the room code. You enter the code once to become a member. When the host starts a session, everyone counts down the same timer.",
  },
  {
    q: "Who can create a room?",
    a: "Hosts can. Everyone else joins with a room code.",
  },
  {
    q: "What does the host see?",
    a: "A list of everyone in the session with their status: preparing, focused, not focused, away or disconnected. The host can also end the session for everyone.",
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
