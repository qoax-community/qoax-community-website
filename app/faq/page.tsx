import type { Metadata } from "next";
import { pageMetadata } from "../seo";
import Link from "next/link";
import { CONTACT_EMAIL } from "../components";
import { faqGroups, faqItems, faqPlainText } from "../faq-data";
import { Btn, Cta, Inlines, PageHead, Shell } from "../editorial";
import ed from "../editorial.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qo.ax";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "FAQ · Questions about Qoax Community answered",
    description: "What Qoax does, which events and schools we work with, and how to contact us.",
    path: "/faq/",
    keywords: ["Qoax FAQ", "Коакс", "Куакс", "Kuaks", "Qoax Community Sofia"],
  }),
};

export default function FaqPage() {
  const url = `${siteUrl}/faq/`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    name: "Questions about Qoax Community",
    inLanguage: "en",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      "@id": `${url}#${item.id}`,
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: faqPlainText(item) },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}/about/` },
      { "@type": "ListItem", position: 3, name: "FAQ", item: url },
    ],
  };

  const numbering = new Map(faqItems.map((item, index) => [item.id, index + 1]));

  return (
    <Shell>
      <PageHead
        crumbs={
          <nav className={ed.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/about">About</Link><span aria-hidden="true">/</span>
            <span aria-current="page">FAQ</span>
          </nav>
        }
        label={`FAQ · Често задавани въпроси · ${faqItems.length} questions`}
        title={<>Questions about Qoax, <em>answered plainly.</em></>}
        copy="What the association does, which events we run, and how to work with us. If your question is missing, write to us and we will add it."
      />

      <section className={ed.sec} aria-label="Frequently asked questions">
        <div className={`${ed.wrap} ${ed.faqGrid}`}>
          <nav className={ed.faqToc} aria-label="Question groups">
            <h2>Groups</h2>
            <ol>
              {faqGroups.map((group, index) => (
                <li key={group.id}>
                  <a href={`#${group.id}`}>{`${(index + 1).toString().padStart(2, "0")} — ${group.title}`}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div>
            {faqGroups.map((group, groupIndex) => (
              <section className={ed.faqGroup} aria-labelledby={`${group.id}-title`} id={group.id} key={group.id}>
                <p className={ed.mono}>{`${(groupIndex + 1).toString().padStart(2, "0")} — ${group.title}`}</p>
                <h2 id={`${group.id}-title`}>{group.title}</h2>
                {group.intro && <p>{group.intro}</p>}
                <div>
                  {group.items.map((item) => {
                    const number = numbering.get(item.id) ?? 0;
                    return (
                      <article className={ed.q} id={item.id} key={item.id}>
                        <span className={ed.qNum} aria-hidden="true">{number.toString().padStart(2, "0")}</span>
                        <div>
                          <h3><a href={`#${item.id}`}>{item.question}</a></h3>
                          <div className={ed.qBody}>
                            {item.answer.map((paragraph) => <p key={paragraph.slice(0, 40)}><Inlines source={paragraph} /></p>)}
                            {item.bulgarian && <p lang="bg">{item.bulgarian}</p>}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <Cta
        title={<>Still have a question? <em>Ask us directly.</em></>}
        copy={`Write to ${CONTACT_EMAIL}. We reply to every message, and the questions people ask most end up on this page.`}
        secondary={<Btn href="/about" variant="ghost">About Qoax</Btn>}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </Shell>
  );
}
