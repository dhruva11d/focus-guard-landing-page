"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Scroll scene. The section is tall and its stage is sticky. As the page
 * scrolls, the centre circle (you) grows and reaches out to each smaller
 * circle (the other people in the room); at the end one of them lets go.
 */

const CX = 500;
const CY = 350;
const NODES = [
  { a: -152, d: 272, r: 22 },
  { a: -100, d: 288, r: 28 },
  { a: -42, d: 300, r: 20 },
  { a: 14, d: 312, r: 30 },
  { a: 62, d: 282, r: 24 },
  { a: 118, d: 292, r: 26 },
  { a: 170, d: 302, r: 21 },
].map((n) => {
  const rad = (n.a * Math.PI) / 180;
  const x = CX + Math.cos(rad) * n.d * 1.35;
  const y = CY + Math.sin(rad) * n.d * 0.95;
  return { ...n, x, y, len: Math.hypot(x - CX, y - CY) };
});
const LETGO = 3;

const STEPS = [
  { title: "The host opens a room.", body: "Name it, pick a length and share the room code." },
  { title: "Everyone joins and puts the phone face down.", body: "Members enter the code, allow motion access, then place their phone face down." },
  { title: "The host sees who stays focused.", body: "Lifting the phone or leaving the tab shows as not focused." },
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => 1 - Math.pow(1 - v, 3);

export function RoomScene() {
  const section = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const root = svg.current;
    const sec = section.current;
    if (!root || !sec) return;
    const core = root.querySelector<SVGCircleElement>("[data-core]")!;
    const coreText = root.querySelector<SVGTextElement>("[data-core-text]")!;
    const note = root.querySelector<SVGGElement>("[data-note]")!;
    const lines = Array.from(root.querySelectorAll<SVGLineElement>("[data-line]"));
    const dots = Array.from(root.querySelectorAll<SVGCircleElement>("[data-dot]"));
    const rings = Array.from(root.querySelectorAll<SVGCircleElement>("[data-ring]"));

    const apply = (p: number) => {
      const g = ease(clamp(p / 0.42));
      core.setAttribute("r", String(34 + (118 - 34) * g));
      coreText.style.opacity = String(clamp((g - 0.5) * 2));
      const letGo = clamp((p - 0.9) / 0.08);

      NODES.forEach((n, i) => {
        const lp = ease(clamp((p - (0.3 + i * 0.04)) / 0.18));
        const line = lines[i];
        const gone = i === LETGO ? letGo : 0;
        line.style.strokeDashoffset = String(n.len * (1 - lp));
        line.style.opacity = String(1 - gone * 0.75);
        line.style.stroke = gone > 0.5 ? "var(--violation)" : "var(--ink)";
        dots[i].setAttribute("r", String(n.r * 0.42 * lp));
        dots[i].style.fill = gone > 0.5 ? "var(--violation)" : "var(--secure)";
        rings[i].style.stroke = gone > 0.5 ? "var(--violation)" : "var(--ink)";
      });
      note.style.opacity = String(letGo);
      setStep((s) => {
        const next = p < 0.28 ? 0 : p < 0.82 ? 1 : 2;
        return s === next ? s : next;
      });
    };

    const progress = () => {
      const r = sec.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      return span > 0 ? clamp(-r.top / span) : 1;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1);
      return;
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => apply(progress()));
    };
    apply(progress());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={section} id="rooms" className="scene" aria-labelledby="rooms-title">
      <div className="scene-stage">
        <div className="scene-copy">
          <h2 id="rooms-title" className="scene-title">
            A room is people agreeing to put the phone down.
          </h2>
          <ol className="scene-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} data-on={i === step} aria-current={i === step}>
                <strong>{s.title}</strong>
                <span>{s.body}</span>
              </li>
            ))}
          </ol>
        </div>

        <svg ref={svg} className="scene-svg" viewBox="0 0 1000 700" role="img" aria-label="The host, as one large circle, connects to seven smaller circles, each a person in the room. One of them is marked as not focused after picking up their phone.">
          {NODES.map((n, i) => (
            <line
              key={`l${i}`}
              data-line
              x1={CX}
              y1={CY}
              x2={n.x}
              y2={n.y}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray={n.len}
              strokeDashoffset={n.len}
              style={{ stroke: "var(--ink)" }}
            />
          ))}
          <circle data-core cx={CX} cy={CY} r={34} fill="var(--ink)" />
          <text data-core-text x={CX} y={CY + 8} textAnchor="middle" className="scene-you" style={{ opacity: 0 }}>
            host
          </text>
          {NODES.map((n, i) => (
            <g key={`n${i}`}>
              <circle data-ring cx={n.x} cy={n.y} r={n.r} fill="var(--cream)" strokeWidth={1.5} style={{ stroke: "var(--ink)" }} />
              <circle data-dot cx={n.x} cy={n.y} r={0} style={{ fill: "var(--secure)" }} />
            </g>
          ))}
          <g data-note style={{ opacity: 0 }}>
            <text x={NODES[LETGO].x + 4} y={NODES[LETGO].y + NODES[LETGO].r + 46} textAnchor="middle" className="scene-hand">
              picked it up
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
}
