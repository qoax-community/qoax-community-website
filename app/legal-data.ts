export type LegalDocumentId = "privacy" | "terms" | "gdpr";

export interface LegalDocument {
  id: LegalDocumentId;
  title: string;
  description: string;
  updated: string;
  summary: string[];
  sections: Array<{
    title: string;
    paragraphs?: string[];
    bullets?: string[];
    links?: Array<{ label: string; href: string }>;
  }>;
}

export const legalEntity = {
  nameBg: "Сдружение КОАКС КОМЮНИТИ",
  nameEn: "QOAX COMMUNITY association",
  uic: "208896893",
  addressBg: "България, гр. София, район Подуяне, ж.к. Хаджи Димитър, бл. 133, вх. А, ет. 4, ап. 18",
  addressEn: "Bulgaria, Sofia, Poduyane district, Hadzhi Dimitar residential area, block 133, entrance A, floor 4, apartment 18",
  registrationDate: "24 July 2026",
  contactEmail: "contact@qo.ax",
  sourceUrl: "https://papagal.bg/eik/208896893/efb0",
} as const;

export const legalDocuments: Record<LegalDocumentId, LegalDocument> = {
  privacy: {
    id: "privacy",
    title: "Privacy Policy",
    description: "How Qoax Community collects, uses and protects data across qo.ax public pages and connected internal services.",
    updated: "Last updated: 16 September 2026",
    summary: [
      "We collect only the information needed to operate public pages, answer messages, run community programmes and protect the service.",
      "We do not sell personal data, run behavioural advertising or build advertising profiles.",
      "Google Analytics runs on the public website only after you accept analytics. Rejecting analytics does not restrict access to the site. You can withdraw consent through Cookie settings in the footer.",
      "Google sign-in and Gmail sending permissions are used only when an authorized QOAX user chooses them for a connected QOAX service.",
      "Requests about personal data can be sent to contact@qo.ax or to the registered address below.",
    ],
    sections: [
      {
        title: "1. Controller",
        paragraphs: [
          `${legalEntity.nameEn}, UIC ${legalEntity.uic}, is the operator of qo.ax and the controller for the public pages on this domain. Registered address: ${legalEntity.addressEn}.`,
          `Bulgarian record: ${legalEntity.nameBg}, ЕИК ${legalEntity.uic}, дата на регистрация ${legalEntity.registrationDate}.`,
        ],
      },
      {
        title: "2. Data we may collect",
        bullets: [
          "Identity and contact data, such as name, email address, role, organization, message content and communication history.",
          "Operational data for community programmes, including schools, student programmes, partners, events, participation notes and public-interest project records.",
          "Technical and security data, such as request timestamps, user agent, IP-based security records, error logs and audit events.",
          "With analytics consent: pages visited, referring websites, visit times, engagement and interactions, browser and device information, approximate location, and pseudonymous cookie identifiers. Google processes network information, including the IP address, to deliver Analytics and derive approximate location; Google states that GA4 does not log or store individual IP addresses from EU users.",
          "Google account data, when a QOAX user signs in or grants Gmail sending permission: Google account identifier, verified email, display name and OAuth authorization status.",
          "Email delivery data in connected services, such as sender, recipient, message template, delivery status, opens, link clicks and replies when tracking is enabled for an outreach workflow.",
        ],
      },
      {
        title: "3. Why we use data",
        bullets: [
          "To publish and maintain the qo.ax public website and related community records.",
          "With your permission, to understand use of our public pages and improve their content and usability using Google Analytics 4.",
          "To answer messages, coordinate school and partner work, plan meetings and follow up on community programmes.",
          "To operate authorized internal QOAX tools, including authentication, CRM, mail and accounting workspaces.",
          "To keep services secure, diagnose faults, prevent misuse and maintain audit records.",
          "To comply with legal, accounting, regulatory or dispute-related obligations where applicable.",
        ],
      },
      {
        title: "4. Legal bases",
        bullets: [
          "Legitimate interest for public website operation, security, internal administration and community programme coordination.",
          "Contract or pre-contract steps when we discuss or deliver a programme, partnership, event or service.",
          "Legal obligation for accounting, regulatory and compliance records.",
          "Consent where consent is required, including optional publication, optional communications or OAuth permissions granted by an authorized user.",
          "Your consent under Article 6(1)(a) GDPR for optional Google Analytics measurement and your prior consent for its cookies. You can reject or withdraw this consent without losing access to the public website.",
        ],
      },
      {
        title: "5. Recipients and processors",
        bullets: [
          "Authorized QOAX team members and service administrators, limited to what their work requires.",
          "Infrastructure providers for static hosting, databases, backups, email delivery, logs and service monitoring.",
          "Google for Google Analytics after you accept analytics, and separately when Google sign-in or Gmail authorization is used in a connected service.",
          "Public authorities, courts, advisers or counterparties when required by law, protection of rights or a legitimate programme need.",
        ],
      },
      {
        title: "6. Retention",
        paragraphs: [
          "We keep personal data only while it is needed for the purpose collected, for security and audit needs, for an active programme or relationship, or for legal obligations. Internal systems may keep accounting and audit records for the statutory periods that apply in Bulgaria.",
          "Data that is no longer needed should be deleted, anonymized or limited to a minimal record needed to respect a request, withdrawal or legal obligation.",
          "We remember your analytics choice for up to 180 days on this browser. Analytics cookies are configured to expire after 180 days without extending their expiry on each visit, and are cleared from this site when you reject analytics. These browser lifetimes are separate from retention of data already received by Google.",
          "Analytics data is retained for website usage comparisons and content improvement. User-level and event-level records are subject to the retention and deletion settings in our Google Analytics property; aggregated standard reports can remain available longer. Contact contact@qo.ax for the applicable retention details or a personal-data request. Withdrawing consent stops future measurement; it does not automatically delete earlier records held by Google.",
        ],
      },
      {
        title: "7. Your rights",
        paragraphs: [
          "Depending on the circumstances, you may request access, correction, deletion, restriction, portability or object to processing based on legitimate interest. You may withdraw consent for future use where processing is based on consent.",
          "You can contact us at contact@qo.ax. You can also complain to the Bulgarian Commission for Personal Data Protection or seek protection before a competent court.",
        ],
      },
      {
        title: "8. Security and changes",
        paragraphs: [
          "We use access controls, audit records, short-lived authorization flows and operational safeguards. No online service can promise absolute security, so suspected misuse should be reported promptly.",
          "Material changes to this policy will be published with a new update date.",
        ],
      },
      {
        title: "9. Google Analytics and international transfers",
        paragraphs: [
          "We use Google Analytics 4 provided by Google Ireland Limited for this website. Depending on Google's processing arrangements, information may be processed by Google LLC and other service providers outside the European Economic Area, including in the United States. Google's data-processing terms describe applicable transfer safeguards, including adequacy decisions where applicable and standard contractual clauses. You can consult those terms or contact us for information about the safeguards.",
          "Our website disables Google signals and advertising-personalisation signals, and does not grant consent for advertising storage, advertising user data or personalised advertising. We do not deliberately send names, email addresses or form contents to Analytics.",
          "We also use Google Search Console to understand search visibility and indexing. Search Console ownership verification itself does not install Analytics cookies or enable visitor tracking on this site.",
        ],
        links: [
          { label: "How Google uses information from sites that use its services", href: "https://policies.google.com/technologies/partner-sites" },
          { label: "Google Analytics data-processing terms and transfer safeguards", href: "https://business.safety.google/adsprocessorterms/" },
          { label: "Google Analytics data retention", href: "https://support.google.com/analytics/answer/7667196" },
        ],
      },
    ],
  },
  terms: {
    id: "terms",
    title: "Terms of Use",
    description: "Rules for using qo.ax public pages and connected QOAX community services.",
    updated: "Last updated: 1 September 2026",
    summary: [
      "qo.ax is the public website of Qoax Community and documents community, school, student, art and civic technology work.",
      "Public pages are informational. Specific programmes, events or paid services may have separate confirmations or terms.",
      "QOAX materials, marks, website design and platform code remain protected unless a separate license says otherwise.",
      "Use the site and connected services lawfully and do not attempt to bypass security or access another person's data.",
    ],
    sections: [
      {
        title: "1. Provider and scope",
        paragraphs: [
          `${legalEntity.nameEn}, UIC ${legalEntity.uic}, operates qo.ax. These terms apply to visitors using the public pages and to authorized users accessing connected QOAX services from this domain or through QOAX authentication.`,
          "If a programme, event, academy enrollment, partnership or internal service has its own written terms, confirmation or agreement, that document applies in addition to these terms.",
        ],
      },
      {
        title: "2. Public information",
        paragraphs: [
          "We try to keep public records accurate and useful, but public pages may change as projects develop. Dates, partners, event details and programme descriptions should be confirmed directly before relying on them for participation, travel, payment or publication.",
        ],
      },
      {
        title: "3. Accounts and authorized access",
        bullets: [
          "Some QOAX services use Google sign-in or central QOAX Auth and are available only to authorized users.",
          "Keep login links, sessions and authorization grants private. Report suspected unauthorized access promptly.",
          "Do not use another person's account, scrape private data, bypass access controls or overload the service.",
          "OAuth permissions, including Gmail sending permission, must be granted only by authorized QOAX users and may be revoked by the user or service administrator.",
        ],
      },
      {
        title: "4. Content and intellectual property",
        paragraphs: [
          "QOAX keeps the rights in its name, marks, website design, software, curriculum, internal tools and published materials, except where an open-source license or written permission says otherwise.",
          "Project partners, schools, artists and contributors keep their own rights in materials they provide. Public project records may refer to partners and link to their public resources for documentation and attribution.",
        ],
      },
      {
        title: "5. Acceptable use",
        bullets: [
          "Do not upload or send unlawful, harmful, privacy-invasive, discriminatory, malicious or rights-infringing material.",
          "Do not attempt to access administrative pages, CRM records, email tracking records, accounting records or user data unless you are authorized.",
          "Do not interfere with the availability, security or integrity of QOAX systems.",
        ],
      },
      {
        title: "6. Liability and availability",
        paragraphs: [
          "The public website is provided for information and community coordination. We aim for reliable access but do not promise uninterrupted availability.",
          "Nothing in these terms excludes liability that Bulgarian law does not allow to be excluded, including liability for intentional misconduct, gross negligence or harm to life or health.",
        ],
      },
      {
        title: "7. Law and contact",
        paragraphs: [
          "Bulgarian law applies, without removing mandatory protections that cannot be waived. Questions, notices and complaints may be sent to contact@qo.ax or to the registered address listed on the Privacy Policy page.",
        ],
      },
    ],
  },
  gdpr: {
    id: "gdpr",
    title: "GDPR and Browser Storage Notice",
    description: "Practical data protection, cookies and browser storage notice for qo.ax.",
    updated: "Last updated: 16 September 2026",
    summary: [
      "The public qo.ax website uses optional Google Analytics cookies only after you accept analytics. Advertising features are disabled.",
      "Static pages may use ordinary browser cache. Connected applications may use sessions, tokens and local preferences needed for the requested service.",
      "Accept analytics and Reject analytics are equally available. Use Cookie settings in the footer to review your choice or withdraw consent at any time.",
    ],
    sections: [
      {
        title: "1. Browser storage on qo.ax",
        bullets: [
          "The public static website may be cached by the browser so pages and assets load faster.",
          "The local-storage entry qoax.analytics-consent.v1 remembers whether you accepted or rejected analytics, the notice version and the expiry time, for up to 180 days. It is necessary to honour your choice and is not an analytics identifier. If browser storage is blocked, the choice may only last for the current page.",
          "Connected QOAX applications may use local storage, session storage or secure cookies for login state, UI preferences, drafts, filters and application continuity.",
        ],
      },
      {
        title: "2. Cookies and analytics",
        paragraphs: [
          "Google Analytics 4 helps us understand which pages are useful and how visitors interact with the public website. Before acceptance, and when analytics is rejected, we do not load the Google Analytics tag or send Analytics measurement or cookieless consent pings. Accepting analytics allows Google to receive usage, device, referral and approximate-location information together with pseudonymous identifiers.",
          "After acceptance, the first-party cookie _ga distinguishes browsers and _ga_P7F0DM83L3 maintains session information. Both are configured for this hostname and the root path, with a lifetime of up to 180 days and no automatic expiry extension on repeat visits. They are not required to use the website. Browser restrictions may shorten their lifetime.",
          "Choose Reject analytics to continue without measurement. To withdraw later, open Cookie settings in the footer and choose Reject analytics. We stop future measurement, remove this site's Analytics cookies and, where your choice can be saved, reload the page to unload Analytics. Withdrawal does not affect the lawfulness of processing before withdrawal or automatically delete previously collected data.",
          "After 180 days we ask again. If you clear browser storage, use a different browser or device, or browse privately, you may need to choose again. Essential browser storage and the optional Analytics cookies have different purposes; rejecting Analytics does not prevent essential website functions.",
        ],
        links: [{ label: "Privacy policy, retention and international transfers", href: "/privacy/" }],
      },
      {
        title: "3. Email and link tracking",
        paragraphs: [
          "Authorized internal outreach systems may record delivery status, opens, link clicks and replies for emails sent by QOAX. Tracking links should use opaque identifiers rather than exposing database IDs or sensitive labels in the URL.",
          "These records are used to prioritize follow-up, understand whether a message was received and keep a practical audit trail for the outreach workflow.",
        ],
      },
      {
        title: "4. Data protection requests",
        paragraphs: [
          `Requests for access, correction, deletion, restriction, portability, objection or consent withdrawal can be sent to ${legalEntity.contactEmail}. We may ask for information needed to verify the requester before acting on account or contact records.`,
        ],
      },
      {
        title: "5. Controller details",
        bullets: [
          `${legalEntity.nameBg}`,
          `ЕИК ${legalEntity.uic}`,
          legalEntity.addressBg,
          `Contact: ${legalEntity.contactEmail}`,
        ],
      },
    ],
  },
};

export function legalDocument(id: LegalDocumentId) {
  return legalDocuments[id];
}

export function isLegalDocumentId(value: string): value is LegalDocumentId {
  return value === "privacy" || value === "terms" || value === "gdpr";
}
