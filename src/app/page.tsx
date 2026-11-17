import Image from "next/image";
import { Faq } from "@/components/faq";
import { LetterDrop } from "@/components/letter-drop";
import { MeshDrift } from "@/components/mesh-drift";
import { RoomScene } from "@/components/room-scene";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const HOW = [
  {
    n: "1",
    title: "Pick a length",
    body: "Choose how long to focus. Start on your own, or join a room with its code.",
  },
  {
    n: "2",
    title: "Stay with it",
    body: "On your own, keep the tab open: leaving it ends the session and sounds an alarm. In a room, place your phone face down and leave it there.",
  },
  {
    n: "3",
    title: "Check your history",
    body: "Every session is saved: how long you focused, whether you finished, and how often you were interrupted.",
  },
];

export default function Home() {
  return (
    <>
      <MeshDrift />
      <div className="grain" aria-hidden="true" />

      <header className="nav">
        <a href="#top" className="nav-logo" aria-label="FocusGuard home">
          <Image src="/icons/icon-192.png" alt="" width={28} height={28} />
          <span>FocusGuard</span>
        </a>
        <nav aria-label="Sections" className="nav-links">
          <a href="#rooms">Rooms</a>
          <a href="#how">How it works</a>
          <a href="#faq">Questions</a>
        </nav>
        <a className="nav-cta" href={APP_URL}>
          Install app
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <LetterDrop lines={["Phones down.", "Focus together."]} />
            <p className="hero-sub">
              FocusGuard is a focus timer that runs in your browser. On your own, it notices when you leave the tab. In
              a room, it notices when you pick up your phone, and the host sees who stayed focused.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={APP_URL}>
                Install FocusGuard
              </a>
              <a className="btn btn-quiet" href="#rooms">
                See how a room works
              </a>
            </div>
          </div>
          <Image
            className="hero-phone"
            src="/images/Floating Smartphone.png"
            alt="The FocusGuard timer on a phone: Focus is active, 24:18 remaining, You're focused."
            width={1122}
            height={1402}
            priority
            sizes="(min-width: 1000px) 40vw, 70vw"
          />
        </section>

        <RoomScene />

        <section id="host" className="section host" aria-labelledby="host-title">
          <div className="host-copy">
            <h2 id="host-title" className="section-title">
              The host sees everyone at a glance.
            </h2>
            <p>
              During a session the host gets a list of every member and their status: preparing, focused, not
              focused, away or disconnected. The host can end the session for everyone.
            </p>
          </div>
          <Image
            className="host-phone"
            src="/images/Study Room Smartphone Mockup.png"
            alt="The host's view of a study room: Ana, Ben and Emi are focused, Chloe is not focused, Dev is away."
            width={1122}
            height={1402}
            sizes="(min-width: 900px) 40vw, 80vw"
          />
        </section>

        <section id="how" className="section" aria-labelledby="how-title">
          <h2 id="how-title" className="section-title">
            A session takes three steps.
          </h2>
          <ol className="how">
            {HOW.map((s) => (
              <li key={s.n}>
                <span className="how-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="faq" className="section faq-section" aria-labelledby="faq-title">
          <div className="faq-head">
            <h2 id="faq-title" className="section-title">
              Questions people ask first.
            </h2>
            <p>
              Something missing? Install the app and start a session. It takes under a minute to see how it feels.
            </p>
          </div>
          <Faq />
        </section>
      </main>

      <footer className="foot">
        <div className="foot-inner">
          <p className="foot-line">Put the phone down. Stay for the whole session.</p>
          <a className="btn btn-primary" href={APP_URL}>
            Install FocusGuard
          </a>
          <p className="foot-note">Runs in your browser. Add it to your home screen to open it full screen. Joining a room takes a phone.</p>
          <p className="foot-copy">© {new Date().getFullYear()} FocusGuard</p>
        </div>
      </footer>
    </>
  );
}
