import type { Metadata } from "next";
import { LegalPage } from "../legal-page";
import { legalDocument } from "../legal-data";

const document = legalDocument("privacy");

export const metadata: Metadata = {
  title: document.title,
  description: document.description,
};

export default function PrivacyPage() {
  return <LegalPage document={document} />;
}
