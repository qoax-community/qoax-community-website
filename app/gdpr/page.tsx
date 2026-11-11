import type { Metadata } from "next";
import { pageMetadata } from "../seo";
import { LegalPage } from "../legal-page";
import { legalDocument } from "../legal-data";

const document = legalDocument("gdpr");

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Qoax Community GDPR and browser storage notice",
    description: document.description,
    path: "/gdpr/",
  }),
};

export default function GdprPage() {
  return <LegalPage document={document} />;
}
