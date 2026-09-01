import type { Metadata } from "next";
import { LegalPage } from "../legal-page";
import { legalDocument } from "../legal-data";

const document = legalDocument("terms");

export const metadata: Metadata = {
  title: `${document.title} · Qoax Community`,
  description: document.description,
};

export default function TermsPage() {
  return <LegalPage document={document} />;
}
