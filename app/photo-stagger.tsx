"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import ed from "./editorial.module.css";

export type StaggerPhoto = {
  src: string;
  alt: string;
  /** Event the photo was taken at, shown on hover and used as the link label. */
  event: string;
  href: string;
};

type PhotoStaggerProps = {
  id: string;
  /** Heading words, revealed one after another. */
  words: string[];
  photos: StaggerPhoto[];
  credit?: ReactNode;
  action?: ReactNode;
};

/**
 * A dark band with a large heading and a staggered grid of event photos.
 * Each heading word rises out of a mask, the photos slide in from the right
 * one after another as their row scrolls into view, and each photo drifts
 * inside its frame while the band moves through the viewport.
 */
export function PhotoStagger({ id, words, photos, credit, action }: PhotoStaggerProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduceMotion) {
      targets.forEach((target) => target.setAttribute("data-shown", ""));
      return;
    }

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    targets.forEach((target) => reveal.observe(target));

    // Parallax: each image is taller than its frame and moves against the scroll.
    const frames = Array.from(root.querySelectorAll<HTMLElement>("[data-drift]"));
    let frame = 0;
    let active = false;
    const drift = () => {
      frame = 0;
      const viewport = window.innerHeight;
      for (const element of frames) {
        const box = element.getBoundingClientRect();
        if (box.bottom < 0 || box.top > viewport) continue;
        // 0 when the frame enters at the bottom, 1 when it leaves at the top.
        const progress = Math.min(1, Math.max(0, (viewport - box.top) / (viewport + box.height)));
        element.style.setProperty("--drift", `${(progress - 0.5) * -2}`);
      }
    };
    const schedule = () => {
      if (active && !frame) frame = window.requestAnimationFrame(drift);
    };
    const presence = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      schedule();
    });
    presence.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      reveal.disconnect();
      presence.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section className={ed.stagger} aria-labelledby={id} ref={ref}>
      <div className={ed.wrap}>
        <h2 className={ed.staggerTitle} id={id} data-reveal="">
          {words.map((word, index) => (
            <span className={ed.staggerMask} key={`${word}-${index}`}>
              <span className={ed.staggerWord} style={{ "--i": index } as CSSProperties}>{word}</span>
            </span>
          ))}
        </h2>
        <ul className={ed.staggerGrid}>
          {photos.map((photo, index) => (
            <li className={ed.staggerCell} key={photo.src}>
              <Link
                className={ed.staggerFrame}
                href={photo.href}
                data-reveal=""
                style={{ "--i": index % 3 } as CSSProperties}
              >
                <span className={ed.staggerMedia} data-drift="">
                  <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 720px) 50vw, 420px" />
                </span>
                <span className={ed.staggerLabel}>{photo.event}</span>
              </Link>
            </li>
          ))}
        </ul>
        {(credit || action) && (
          <div className={ed.staggerFoot}>
            {credit ? <p>{credit}</p> : <span />}
            {action}
          </div>
        )}
      </div>
    </section>
  );
}
