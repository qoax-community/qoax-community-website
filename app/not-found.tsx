import type { Metadata } from "next";
import Link from "next/link";
import { Btn, Shell } from "./editorial";
import ed from "./editorial.module.css";
import { pageMetadata } from "./seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Page not found on Qoax Community",
    description: "This page is not on qo.ax. The link may be old, or the page has moved.",
  }),
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Shell>
      <section className={ed.wrap} style={{ paddingBlock: "clamp(56px, 9vw, 112px)" }}>
        <p className={ed.mono}>404</p>
        <h1 style={{ marginTop: 12 }}>This page is not here.</h1>
        <p style={{ marginTop: 14, maxWidth: 520, color: "var(--ink-2)" }}>
          The link may be old, or the page has moved. Try the <Link href="/work">record of our work</Link>, the{" "}
          <Link href="/events">events calendar</Link>, or the <Link href="/blog">journal</Link>.
        </p>
        <div style={{ marginTop: 24 }}>
          <Btn href="/">Back to the home page</Btn>
        </div>
      </section>
    </Shell>
  );
}
