/**
 * How people write and search for the Qoax name. The registered Bulgarian
 * name is КОАКС; these spellings and common misspellings are kept in search
 * metadata rather than displayed in the site's copy.
 */
export const brandName = "Qoax";

export const brandSpellings = {
  cyrillic: ["Коакс", "КОАКС", "Коакс Комюнити", "КОАКС КОМЮНИТИ", "Куакс"],
  latin: ["QOAX", "Qoax Community", "QOAX Community", "Kuaks", "Koaks", "Quax", "Qoacs"],
} as const;

export const brandAlternateNames: string[] = Array.from(
  new Set([...brandSpellings.latin, ...brandSpellings.cyrillic]),
);
