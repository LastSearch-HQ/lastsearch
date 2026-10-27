import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openCookieSettings } from "@/components/CookieConsent";

const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-semibold">{children}</h2>;
const H3 = ({ children }: { children: React.ReactNode }) => <h3 className="text-sm font-medium">{children}</h3>;
const P = ({ children }: { children: React.ReactNode }) => <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>;
const UL = ({ children }: { children: React.ReactNode }) => <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">{children}</ul>;
const B = ({ children }: { children: React.ReactNode }) => <strong className="text-foreground">{children}</strong>;

const processors: [string, string, string][] = [
  ["Supabase", "Account sign-in, database for API keys, query history and results", "United States"],
  ["Vercel", "Hosting and delivery of the website; Vercel Analytics (only with your consent)", "United States, edge network worldwide"],
  ["PostHog", "Product analytics (only with your consent)", "United States"],
  ["Upstash", "Short-lived result cache and rate-limit counters", "United States"],
  ["OpenRouter (Google Gemini, OpenAI embeddings)", "Language-model processing of your query and fetched page text", "United States"],
  ["Tavily, Brave Search, Exa", "Web search for your query text", "United States"],
  ["GitHub, Google", "Sign-in providers (only when you choose them)", "United States"],
];

const storage: [string, string, string, string][] = [
  ["sb-*-auth-token (localStorage)", "Keeps you signed in", "Strictly necessary", "Until you sign out"],
  ["sidebar:state (cookie)", "Remembers whether the sidebar is open", "Strictly necessary (UI preference)", "7 days"],
  ["ls_recent_queries (localStorage)", "Your recent queries, shown as suggestions on this device only", "Strictly necessary (UI preference)", "Until cleared"],
  ["ls_consent (localStorage)", "Records your privacy choices, when you made them and the policy version", "Strictly necessary", "Until withdrawn"],
  ["ph_* (cookie + localStorage)", "PostHog analytics identifiers", "Analytics, with consent", "1 year"],
  ["Vercel Analytics", "Page-view counts; cookieless, no persistent identifier", "Analytics, with consent", "Not stored on your device"],
];

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <nav className="flex items-center gap-4 px-4 sm:px-8 py-5 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logo.svg" alt="LastSearch" className="w-4 h-4" />
          <span className="font-semibold text-sm">LastSearch</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 27, 2026 · Policy version 2</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-6">
          <section className="space-y-3">
            <H2>Who we are</H2>
            <P>
              LastSearch ("we", "us") operates lastsearch.ai, the LastSearch API, the MCP server and the Python SDK. LastSearch is the data
              controller for the personal data described here. Contact for anything in this policy, including requests about your data:{" "}
              <a href="mailto:shreyassaw@gmail.com" className="text-accent hover:underline">shreyassaw@gmail.com</a>. This policy is written to meet
              the GDPR and UK GDPR, the California Consumer Privacy Act as amended by the CPRA, and comparable laws elsewhere.
            </P>
          </section>

          <section className="space-y-3">
            <H2>The short version</H2>
            <UL>
              <li>Nothing optional runs until you say so. Analytics are off until you accept them in the banner, and browser opt-out signals (Global Privacy Control, Do Not Track) are honoured as a "no" without asking.</li>
              <li>We do not sell your personal data, and we do not share it for cross-context behavioural advertising. There is no advertising on this site.</li>
              <li>Queries you send through the hosted service are stored and used to improve verification accuracy, in aggregate and without identifiers. This is described in full below and in the Terms.</li>
              <li>You can see, export and delete your data yourself from the dashboard and API, or by emailing us.</li>
            </UL>
          </section>

          <section className="space-y-3">
            <H2>What we collect, why, and on what legal basis</H2>
            <div className="space-y-2">
              <H3>Account data</H3>
              <P>
                When you sign in with Google or GitHub we receive your email address, name and avatar from that provider, and we create an account
                id. <B>Purpose:</B> running your account, issuing API keys, showing your history. <B>Legal basis:</B> performance of a contract
                (the Terms). <B>Retention:</B> until you delete your account.
              </P>
            </div>
            <div className="space-y-2">
              <H3>API keys</H3>
              <P>
                Keys (ls_xxx) are encrypted with AES-256-GCM before storage and are never logged or shown to us in plaintext. <B>Legal basis:</B>{" "}
                contract. <B>Retention:</B> until you revoke them or delete your account.
              </P>
            </div>
            <div className="space-y-2">
              <H3>Queries and results</H3>
              <P>
                <B>Your queries and results are stored on our servers.</B> When you submit a query through lastsearch.ai, the REST API, the MCP server
                or the Python SDK, we store the query text, the full result (answer, claims, sources, confidence scores) and metadata (timestamp,
                depth, client type). For signed-in users these are linked to your account and shown in your history. Please do not put personal
                data about yourself or others into queries; we treat query text as content, not as a profile. <B>Legal basis:</B> contract (providing
                the service) and our legitimate interest in improving verification accuracy, as described under "How query data improves the
                service". <B>Retention:</B> while your account is active, or until you delete the result or your data. Queries made without an account
                are stored without an account link.
              </P>
            </div>
            <div className="space-y-2">
              <H3>Usage and technical data</H3>
              <P>
                Your IP address is used to enforce rate limits (for example 1 demo query per hour without an account) and is held in our cache
                for at most one hour for that purpose. Our hosting provider keeps request logs (IP address, user agent, time, path) for a short
                period for security and debugging, never more than 30 days. <B>Legal basis:</B> legitimate interest in keeping the service secure
                and available.
              </P>
            </div>
            <div className="space-y-2">
              <H3>Analytics (only with your consent)</H3>
              <P>
                If you accept analytics, PostHog records page views and which product features are used, and Vercel Analytics counts page views
                without cookies. Neither runs before you accept. We configure PostHog to discard IP addresses, to not record sessions, and to
                identify signed-in users by account id only (no email or name is sent). <B>Legal basis:</B> consent, which you can withdraw at any
                time with the button below or "Cookie settings" in the footer. <B>Retention:</B> analytics events are kept for 12 months.
              </P>
            </div>
            <div className="space-y-2">
              <H3>Waitlist</H3>
              <P>
                If you join a waitlist, we store the email address you give us and where you signed up. <B>Purpose:</B> telling you when access
                opens. <B>Legal basis:</B> consent. We will not send you marketing email unless you have opted in, and every such email will carry
                an unsubscribe link and our postal address. <B>Retention:</B> until you ask us to remove it or access opens.
              </P>
            </div>
            <div className="space-y-2">
              <H3>Feedback</H3>
              <P>
                Ratings you give a result ("good", "bad", "wrong") are stored with that result and used to calibrate confidence scores.{" "}
                <B>Legal basis:</B> legitimate interest in accuracy. <B>Retention:</B> as the result.
              </P>
            </div>
          </section>

          <section className="space-y-3">
            <H2>Cookies and local storage</H2>
            <P>
              We set no advertising or cross-site tracking cookies. Everything on your device is listed here. Items marked "with consent" are not
              created until you accept analytics in the banner.
            </P>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-muted-foreground">
                <thead><tr className="text-left text-foreground"><th className="py-1 pr-3">Name</th><th className="py-1 pr-3">Purpose</th><th className="py-1 pr-3">Category</th><th className="py-1">Duration</th></tr></thead>
                <tbody>{storage.map(([n, p, c, d]) => <tr key={n} className="border-t border-border align-top"><td className="py-1.5 pr-3 font-mono">{n}</td><td className="py-1.5 pr-3">{p}</td><td className="py-1.5 pr-3">{c}</td><td className="py-1.5">{d}</td></tr>)}</tbody>
              </table>
            </div>
            <div>
              <Button variant="outline" size="sm" onClick={openCookieSettings}>Change your privacy choices</Button>
            </div>
          </section>

          <section className="space-y-3">
            <H2>How query data improves the service</H2>
            <P>
              <B>LastSearch is not a fully private service.</B> Queries and results processed through the hosted service are used to make
              verification better for everyone. This is what that means in practice:
            </P>
            <UL>
              <li><B>Domain authority scores</B> are adjusted by how often claims from a domain are verified. Only domain-level aggregates are computed (for example "wikipedia.org: 82% verification rate across 500 queries").</li>
              <li><B>Thresholds and weights</B> in the verification pipeline adapt to aggregate outcomes, never to a single query.</li>
              <li><B>Verification model training</B> uses claim-evidence pairs (a claim's text, a passage of source text, and a support/refute/unrelated label) to train our small classifier models. No account id, email, API key or IP address is included. We do not use your queries to train large language models.</li>
              <li><B>Feedback calibration</B> uses your ratings so that a reported 75% confidence corresponds to roughly 75% accuracy.</li>
              <li><B>Caching</B> keeps results for 5 minutes (news) to 30 minutes (general) so repeat questions are faster for everyone.</li>
            </UL>
            <P>
              Individual queries are never shown to other users. You may object to this processing by emailing us; if you do, we will exclude your
              account's future queries from training data, though statistics already aggregated cannot be unwound.
            </P>
          </section>

          <section className="space-y-3">
            <H2>Who processes data on our behalf</H2>
            <P>
              We use the following providers under their data processing terms. Your query text and the text of fetched pages are sent to the search
              and language-model providers to produce an answer; your account data is not.
            </P>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-muted-foreground">
                <thead><tr className="text-left text-foreground"><th className="py-1 pr-3">Provider</th><th className="py-1 pr-3">What for</th><th className="py-1">Where</th></tr></thead>
                <tbody>{processors.map(([n, p, w]) => <tr key={n} className="border-t border-border align-top"><td className="py-1.5 pr-3 text-foreground">{n}</td><td className="py-1.5 pr-3">{p}</td><td className="py-1.5">{w}</td></tr>)}</tbody>
              </table>
            </div>
            <P>
              We do not sell personal data and do not share it with anyone else, except where the law requires it or to protect the service from
              abuse. If LastSearch is ever acquired, this policy continues to apply to data collected under it.
            </P>
          </section>

          <section className="space-y-3">
            <H2>International transfers</H2>
            <P>
              Our servers and providers are in the United States. If you use the service from the European Economic Area, the United Kingdom or
              Switzerland, your data is transferred there. We rely on the providers' EU-US Data Privacy Framework certification where they hold
              it and on the European Commission's Standard Contractual Clauses (and the UK Addendum) otherwise.
            </P>
          </section>

          <section className="space-y-3">
            <H2>Security</H2>
            <P>
              Data is stored in PostgreSQL with row-level security, API keys are encrypted at rest, and every connection uses TLS. No system is
              perfectly secure; if a breach affects your personal data we will tell you and the relevant authority without undue delay, and within
              72 hours where the GDPR applies.
            </P>
          </section>

          <section className="space-y-3">
            <H2>Your rights and how to use them</H2>
            <P>Wherever you live, you can:</P>
            <UL>
              <li><B>See your data</B> in the dashboard (history, usage, keys) or ask us for a copy.</li>
              <li><B>Export</B> your query history through the API.</li>
              <li><B>Correct</B> account details by updating them with your sign-in provider.</li>
              <li><B>Delete</B> everything with <code className="text-xs bg-secondary px-1 py-0.5 rounded">DELETE /user/data</code> or with "Delete all my data" on the dashboard. This removes your results, shared result pages and keys at once and is irreversible. Research sessions can be deleted one by one on the Sessions page. Email us to close the account itself.</li>
              <li><B>Object</B> to the accuracy-improvement processing described above, or <B>withdraw consent</B> to analytics at any time.</li>
              <li><B>Complain</B> to your data protection authority. In the EEA that is the authority of your country; in the UK, the ICO.</li>
            </UL>
            <P>
              Email requests to <a href="mailto:shreyassaw@gmail.com" className="text-accent hover:underline">shreyassaw@gmail.com</a>. We answer within
              30 days (45 days under the CCPA, extendable once where the law allows) and will not treat you differently for exercising a right. We
              may ask you to confirm the request from the email address on your account.
            </P>
          </section>

          <section className="space-y-3">
            <H2>California and other US state residents</H2>
            <P>
              In the past 12 months we have collected the categories listed above (identifiers, account details, usage data, and the content of
              queries). We use them for the purposes stated. <B>We do not sell personal information and we do not share it for cross-context
              behavioural advertising,</B> so there is no "Do Not Sell or Share" setting to switch; the analytics choice above is the only
              optional processing and is off by default. We honour Global Privacy Control signals as an opt-out. You have the rights to know,
              delete, correct, and to be free from discrimination, exercisable as described above. We do not use or disclose sensitive personal
              information for purposes that would require a right to limit.
            </P>
          </section>

          <section className="space-y-3">
            <H2>Children</H2>
            <P>
              LastSearch is not directed at children. You must be at least 16 (or the age of digital consent where you live, if higher) to use it.
              If you believe a child has created an account, email us and we will delete it.
            </P>
          </section>

          <section className="space-y-3">
            <H2>Automated processing and AI</H2>
            <P>
              Answers, claims and confidence scores are produced by automated systems, including large language models and our own verification
              classifiers. They are research output, not decisions about you, and have no legal or similarly significant effect on you. The service
              makes no automated decisions about users.
            </P>
          </section>

          <section className="space-y-3">
            <H2>Open source</H2>
            <P>
              The MCP server, SDKs and this website are open source. You can read exactly what the client code does in the{" "}
              <a href="https://github.com/lastsearch-hq/lastsearch" target="_blank" rel="noopener" className="text-accent hover:underline">source code</a>,
              including the consent logic on this site.
            </P>
          </section>

          <section className="space-y-3">
            <H2>Changes</H2>
            <P>
              When this policy changes materially we will update the date and version above, ask for consent again where needed, and tell signed-in
              users by email or a notice on the site.
            </P>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
