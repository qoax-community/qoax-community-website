"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps the site footer so it can sit fixed behind the page and be revealed
 * as the page scrolls away. The footer's natural height is measured, and the
 * reveal is only switched on when that height fits comfortably inside the
 * viewport. Without JavaScript the footer stays in normal flow.
 */
export function FooterReveal({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = ref.current;
    const footer = wrapper?.firstElementChild as HTMLElement | null;
    if (!wrapper || !footer) return;

    const update = () => {
      // Measure in normal flow, so the fixed state does not affect the result.
      delete wrapper.dataset.reveal;
      const height = Math.ceil(footer.scrollHeight);
      const fits = window.innerWidth >= 761 && height <= window.innerHeight * 0.8;
      wrapper.style.setProperty("--foot-h", `${height}px`);
      if (fits) wrapper.dataset.reveal = "";
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(footer.lastElementChild ?? footer);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div className={className} ref={ref}>{children}</div>;
}
