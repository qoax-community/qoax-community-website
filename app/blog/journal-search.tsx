"use client";

import { Fragment, useEffect, useId, useState, type ReactNode } from "react";
import ed from "../editorial.module.css";

export type SearchItem = {
  slug: string;
  /** Title, excerpt, category and tags, lower-cased. */
  text: string;
  /** The post's row, rendered on the server. */
  row: ReactNode;
};

function matches(item: SearchItem, terms: string[]) {
  return terms.every((term) => item.text.includes(term));
}

/**
 * Search box for the journal. With an empty query it shows the normal
 * listing (children); otherwise the matching posts. A tag link such as
 * /blog/?q=hackathon opens the page with the query filled in.
 */
export function JournalSearch({ items, children }: { items: SearchItem[]; children: ReactNode }) {
  const [query, setQuery] = useState("");
  const inputId = useId();

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    // Read once after hydration, so the static HTML and the first client render agree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial) setQuery(initial);
  }, []);

  const update = (value: string) => {
    setQuery(value);
    const url = new URL(window.location.href);
    if (value.trim()) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  };

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = terms.length > 0 ? items.filter((item) => matches(item, terms)) : [];

  return (
    <>
      <div className={ed.wrap}>
        <form className={ed.search} role="search" onSubmit={(event) => event.preventDefault()}>
          <label className={ed.srOnly} htmlFor={inputId}>Search the journal</label>
          <input
            autoComplete="off"
            className={ed.searchInput}
            id={inputId}
            onChange={(event) => update(event.target.value)}
            placeholder="Search posts by title, topic or tag"
            type="search"
            value={query}
          />
          {terms.length > 0 && (
            <p className={ed.searchCount} aria-live="polite">
              {results.length === 1 ? "Found 1 post" : `Found ${results.length} posts`}
            </p>
          )}
        </form>
      </div>

      {terms.length === 0 ? children : (
        <section className={ed.secTight} aria-label="Search results">
          <div className={ed.wrap}>
            {results.length > 0 ? (
              <div className={ed.rows}>{results.map((item) => <Fragment key={item.slug}>{item.row}</Fragment>)}</div>
            ) : (
              <div className={ed.empty}>
                <h2 className={ed.h2}>No posts match that search</h2>
                <p className={ed.emptyCopy}>Try a shorter word, or a topic such as hackathon, game jam or esports.</p>
                <button className={ed.btnGhost} onClick={() => update("")} style={{ marginTop: 16 }} type="button">
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
