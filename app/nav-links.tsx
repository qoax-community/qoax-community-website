"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./editorial.module.css";

export const primaryNavigation = [
  ["Home", "/"],
  ["Events", "/events"],
  ["Work", "/work"],
  ["Schools", "/schools"],
  ["Journal", "/blog"],
  ["About", "/about"],
] as const;

function isActive(pathname: string, href: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (href === "/") return path === "/";
  if (href === "/work") return path.startsWith("/work") || path.startsWith("/projects");
  return path === href || path.startsWith(`${href}/`);
}

export function NavLinks({ className, plain = false }: { className?: string; plain?: boolean }) {
  const pathname = usePathname() ?? "/";
  return (
    <>
      {primaryNavigation.map(([label, href]) => (
        <Link
          aria-current={isActive(pathname, href) ? "page" : undefined}
          className={plain ? undefined : className ?? styles.navLink}
          href={href}
          key={href}
        >
          {label}
        </Link>
      ))}
    </>
  );
}
