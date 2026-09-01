import type { Metadata } from "next";
import { LegalPage } from "../legal-page";
import { legalDocument } from "../legal-data";

const document = legalDocument("gdpr");

export const metadata: Metadata = {
  title: `${document.title} · Qoax Community`,
  description: document.description,
};

export default function GdprPage() {
  return <LegalPage document={document} />;
}
