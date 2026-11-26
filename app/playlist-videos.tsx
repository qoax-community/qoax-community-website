"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { siteAsset } from "./site-path";
import ed from "./editorial.module.css";
import styles from "./playlist-videos.module.css";

export type PlaylistVideo = {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
};

const PAGE_SIZE = 3;

function isSnapshot(value: unknown, playlistId: string): value is { videos: PlaylistVideo[] } {
  if (!value || typeof value !== "object" || !("playlistId" in value) || value.playlistId !== playlistId || !("videos" in value) || !Array.isArray(value.videos) || value.videos.length > 15) return false;
  const seen = new Set<string>();
  return value.videos.every((video) => {
    if (!video || typeof video.id !== "string" || !/^[A-Za-z0-9_-]{11}$/.test(video.id) || seen.has(video.id)) return false;
    seen.add(video.id);
    return typeof video.title === "string" && video.title.trim().length > 0 && typeof video.published === "string" && Number.isFinite(Date.parse(video.published)) && video.thumbnail === `/streams/thumbs/${video.id}.jpg`;
  });
}

export function PlaylistVideos({ playlistId, videos: initialVideos }: { playlistId: string; videos: PlaylistVideo[] }) {
  const [videos, setVideos] = useState(initialVideos);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const listId = useId();
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let controller: AbortController | undefined;
    async function refresh() {
      if (document.hidden) return;
      controller?.abort();
      controller = new AbortController();
      try {
        const response = await fetch(siteAsset("/data/youtube-playlist.json"), { cache: "no-store", signal: controller.signal });
        if (!response.ok) return;
        const snapshot: unknown = await response.json();
        if (isSnapshot(snapshot, playlistId)) setVideos(snapshot.videos);
      } catch {
        // Offline or an interrupted refresh: keep the rendered, working list.
      }
    }
    void refresh();
    const timer = window.setInterval(refresh, 30 * 60 * 1000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      controller?.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [playlistId]);

  function showMore() {
    const firstNew = visible;
    setVisible((count) => Math.min(count + PAGE_SIZE, videos.length));
    // The final click removes the button. Move focus to the newly revealed
    // content, so keyboard users can continue from the same place in the list.
    requestAnimationFrame(() => list.current?.querySelectorAll<HTMLAnchorElement>("a")[firstNew]?.focus({ preventScroll: true }));
  }

  return (
    <>
      {videos.length > 0 ? (
        <>
          <ul className={styles.grid} id={listId} ref={list}>
            {videos.slice(0, visible).map((video) => (
              <li key={video.id}>
                <a className={styles.card} href={`https://www.youtube.com/watch?v=${video.id}&list=${playlistId}`} target="_blank" rel="noreferrer">
                  <div className={styles.picture}>
                    <Image src={siteAsset(video.thumbnail)} alt="" width={480} height={360} sizes="(max-width: 720px) 100vw, (max-width: 960px) 50vw, 400px" />
                    <span className={styles.play} aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </div>
                  <div className={styles.caption}>
                    <h3>{video.title}</h3>
                    <time dateTime={video.published}>{new Date(video.published).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</time>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.more}>
            <p role="status" aria-live="polite" aria-atomic="true">Showing {Math.min(visible, videos.length)} of {videos.length} videos</p>
            {visible < videos.length && <button type="button" className={ed.btnGhost} onClick={showMore} aria-controls={listId}>Show more</button>}
          </div>
        </>
      ) : <p className={styles.empty}>New videos will appear here when they are added to the playlist.</p>}
    </>
  );
}
