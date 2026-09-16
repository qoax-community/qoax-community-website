"use client";

import { useEffect, useState } from "react";
import styles from "./site.module.css";
import ed from "./editorial.module.css";

function parts(target: number, now: number) {
  const total = Math.max(0, target - now);
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total % 86_400_000) / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);
  return { days, hours, minutes, seconds, done: total === 0 };
}

export function Countdown({ target, label, editorial = false }: { target: string; label?: string; editorial?: boolean }) {
  const targetMs = new Date(target).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  const value = now === null ? null : parts(targetMs, now);
  const cell = (n: number | undefined) => (n === undefined ? "--" : n.toString().padStart(2, "0"));

  if (editorial) {
    const cells: Array<[string, string]> = [
      [value ? String(value.days) : "--", "days"],
      [cell(value?.hours), "hrs"],
      [cell(value?.minutes), "min"],
      [cell(value?.seconds), "sec"],
    ];
    return (
      <div className={ed.countdown} role="timer" aria-label={label ?? "Countdown"} aria-live="off">
        {cells.map(([number, unit]) => (
          <div className={ed.countdownCell} key={unit}>
            <strong className={ed.countdownValue}>{number}</strong>
            <span className={ed.countdownLabel}>{unit}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.countdown} role="timer" aria-label={label ?? "Countdown"} aria-live="off">
      <div><strong>{value ? value.days : "--"}</strong><span>days</span></div>
      <div><strong>{cell(value?.hours)}</strong><span>hrs</span></div>
      <div><strong>{cell(value?.minutes)}</strong><span>min</span></div>
      <div><strong>{cell(value?.seconds)}</strong><span>sec</span></div>
    </div>
  );
}
