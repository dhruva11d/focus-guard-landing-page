import { Fragment, type CSSProperties } from "react";

/**
 * Headline that drops in letter by letter: each letter sits in a clipped
 * window and slides down into it from above. Pure CSS, runs on load.
 * The accessible name is the plain text; the split letters are hidden.
 */
export function LetterDrop({ lines }: { lines: string[] }) {
  let n = 0;
  return (
    <h1 className="drop" aria-label={lines.join(" ")}>
      {lines.map((line) => (
        <span className="drop-line" key={line} aria-hidden="true">
          {line.split(" ").map((word, wi, words) => (
            <Fragment key={wi}>
              <span className="drop-word">
                {Array.from(word).map((ch, ci) => (
                  <span className="drop-clip" key={ci}>
                    <span className="drop-glyph" style={{ "--i": n++ } as CSSProperties}>
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
              {wi < words.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </span>
      ))}
    </h1>
  );
}
