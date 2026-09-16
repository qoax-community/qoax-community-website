import type { Metadata } from "next";
import { pageMetadata } from "../seo";
import { LegalPage } from "../legal-page";
import { legalDocument } from "../legal-data";

const document = legalDocument("terms");

export const metadata: Metadata = {
  ...pageMetadata({
    title: document.title,
    description: document.description,
    path: "/terms/",
  }),
};

export default function TermsPage() {
  return <LegalPage document={document} />;
}
