/**
 * How people write and search for the Qoax name. The registered Bulgarian
 * name is КОАКС, pronounced "ko-aks"; these spellings and common misspellings
 * are shown on the site so that searches in either alphabet find qo.ax.
 */
export const brandName = "Qoax";
export const brandPronunciation = "ko-aks";

export const brandSpellings = {
  cyrillic: ["Коакс", "КОАКС", "Коакс Комюнити", "КОАКС КОМЮНИТИ", "Куакс"],
  latin: ["QOAX", "Qoax Community", "QOAX Community", "Kuaks", "Koaks", "Quax", "Qoacs"],
} as const;

/** Short, human-readable list for footers and "also written as" lines. */
export const brandAliasLine = "Коакс, Куакс, КОАКС Комюнити, Kuaks, Koaks, Quax";

export const brandAlternateNames: string[] = Array.from(
  new Set([...brandSpellings.latin, ...brandSpellings.cyrillic]),
);
