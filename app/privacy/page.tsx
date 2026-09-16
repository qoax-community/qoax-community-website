import type { Metadata } from "next";
import { pageMetadata } from "../seo";
import { LegalPage } from "../legal-page";
import { legalDocument } from "../legal-data";

const document = legalDocument("privacy");

export const metadata: Metadata = {
  ...pageMetadata({
    title: document.title,
    description: document.description,
    path: "/privacy/",
  }),
};

export default function PrivacyPage() {
  return <LegalPage document={document} />;
}
