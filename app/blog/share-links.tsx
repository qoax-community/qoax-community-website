"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ed from "../editorial.module.css";

/**
 * Share options for a post. Each one only opens something for the reader to
 * act on; nothing is posted or sent on their behalf.
 */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Feature-detect after hydration, so the static HTML matches the first render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanShare(typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Copy this link", url);
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // The reader closed the share sheet.
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <ul className={ed.shareList}>
      {canShare && (
        <li><button onClick={share} type="button">Share</button></li>
      )}
      <li>
        <button onClick={copy} type="button">{copied ? "Link copied" : "Copy link"}</button>
        <span aria-live="polite" className={ed.srOnly}>{copied ? "Link copied" : ""}</span>
      </li>
      <li><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} rel="noreferrer" target="_blank">LinkedIn ↗</a></li>
      <li><a href={`https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`} rel="noreferrer" target="_blank">X ↗</a></li>
      <li><a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}>Send by email</a></li>
      <li><Link href="/blog/feed.xml">RSS feed</Link></li>
    </ul>
  );
}
