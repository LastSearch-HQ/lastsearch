import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DISCLAIMER_LINES } from "@/lib/disclaimer";

const Terms = () => {
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
          <h1 className="text-2xl font-bold mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 28, 2026</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-6">
          <section className="space-y-3 rounded-xl bg-card p-5">
            <h2 className="text-lg font-semibold">In plain words</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
              {DISCLAIMER_LINES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">The full terms below say the same thing in more detail, and they take precedence.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By using LastSearch ("the Service"), including the website at lastsearch.ai, the REST API, MCP server, and Python SDK, you agree to these terms. If you don't agree, don't use the Service. LastSearch is an independent, non-commercial passion project run by an individual developer. It is offered free of charge, as a courtesy, and may change, be rate-limited, or be discontinued at any time without notice. If paid plans are ever offered, their price, billing and cancellation terms will be shown before you can buy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">2. What the Service Does</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              LastSearch provides AI-powered research infrastructure: web search with evidence extraction, structured citations, and confidence scoring. Results are generated from real-time web searches and LLM processing, and depend on what is published on the public internet, which can be wrong, outdated or biased. Words such as "verified", "checked", "supported" or "confidence" on the site and in API responses describe the outcome of automated checks against the sources found, not a statement that something is true. We do not guarantee the accuracy, completeness, or timeliness of any results, and the final judgement about how to use them is yours.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">3. Accounts</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You may use the Service without an account (subject to demo rate limits). Creating an account gives you access to API key management, query history, and higher usage limits. You are responsible for maintaining the security of your account and API keys. You must be at least 16 years old (or the age of digital consent where you live, if higher) to create an account or use the Service. The Service is not directed at children, and we will delete any account we learn belongs to someone under that age.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">4. API Keys & Usage</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>All API access requires a LastSearch API key (ls_xxx). Free keys include 100 premium queries/day.</li>
              <li>LastSearch API keys (ls_xxx) are personal and should not be shared publicly.</li>
              <li>Demo access is limited to 1 query per hour per IP address.</li>
              <li>We reserve the right to revoke API keys that are abused or used in violation of these terms.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">5. Acceptable Use</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to circumvent rate limits or access controls</li>
              <li>Use the Service to generate spam, misinformation, or harmful content</li>
              <li>Reverse engineer the hosted verification engine</li>
              <li>Overwhelm the Service with excessive automated requests beyond reasonable use</li>
              <li>Submit queries containing other people's personal data, or content you have no right to share</li>
              <li>Use shared result pages to publish infringing, defamatory, or unlawful material</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">6. Your Content and Shared Pages</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You keep whatever rights you have in the queries and documents you submit. You give us a licence to store, process and display them to
              operate the Service as described in these Terms and the Privacy Policy. When you create a share link for a result or session, that page
              becomes viewable by anyone with the link until you delete your data from the dashboard or ask us to remove it. Shared pages contain short quotations from third-party web sources,
              each attributed and linked to its origin.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">7. Copyright Complaints</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We respect intellectual property rights. If you believe material available through the Service, including a shared page, infringes
              your copyright, send a notice to our designated copyright agent at 
              <a href="mailto:shreyassaw@gmail.com?subject=Copyright%20notice" className="text-accent hover:underline">shreyassaw@gmail.com</a> with
              the subject "Copyright notice", including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>your physical or electronic signature;</li>
              <li>identification of the copyrighted work you say is infringed;</li>
              <li>the URL of the material you want removed;</li>
              <li>your name, address, telephone number and email address;</li>
              <li>a statement that you have a good-faith belief the use is not authorised by the owner, its agent, or the law; and</li>
              <li>a statement, under penalty of perjury, that the notice is accurate and that you are the owner or authorised to act for the owner.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We remove or disable access to material that is the subject of a valid notice, notify the person who shared it, and accept counter-notices
              as provided by 17 U.S.C. § 512(g). We terminate, in appropriate circumstances, the accounts of repeat infringers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">8. Open Source License</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              LastSearch uses an open-core model. SDKs, MCP server, integrations, and frontend are licensed under Apache 2.0. The verification engine is a hosted service — free to use via API, source is not publicly available. These Terms of Service apply specifically to the hosted service at lastsearch.ai.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">9. Data Usage & Service Improvement</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">By using the hosted service, you acknowledge that your queries and results are stored and used to improve the Service.</strong> This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Storing your queries, answers, claims, sources, and confidence scores</li>
              <li>Using verification outcomes to improve domain authority scoring</li>
              <li>Adapting verification thresholds and confidence calibration based on aggregate query patterns</li>
              <li>Using your feedback ratings (good/bad/wrong) to calibrate confidence accuracy</li>
              <li>Caching results to improve performance for all users</li>
              <li>Computing co-citation and source usefulness metrics from query results</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We do not sell your data or share individual queries with third parties. All improvements are based on aggregate, statistical patterns — not individual query content. Your queries are sent to third-party search and LLM providers solely to process your request. See our <button onClick={() => navigate("/privacy")} className="text-accent hover:underline">Privacy Policy</button> for full details.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">If you require full data privacy, contact us about enterprise options.</strong> The SDKs and MCP server are open-source (Apache 2.0) and can be run locally — but all verification requests are processed by the hosted API.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">10. Data Deletion</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You may delete all your stored data at any time with "Delete all my data" on the dashboard or the <code className="text-xs bg-secondary px-1 py-0.5 rounded">DELETE /user/data</code> API endpoint. This permanently removes your query results and API keys. Aggregate statistical data (domain scores, verification rates) computed from your queries cannot be individually reversed. See our <button onClick={() => navigate("/privacy")} className="text-accent hover:underline">Privacy Policy</button> for details on your rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">11. Third-Party Services</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Service relies on third-party providers including Tavily, Brave Search and Exa (web search), OpenRouter (language-model processing), Supabase (accounts and storage), Upstash (caching) and Vercel (hosting). Your use of these services through LastSearch is also subject to their respective terms. We are not responsible for the availability or performance of third-party services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">12. Not Professional Advice</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">LastSearch does not provide financial, investment, medical, legal, tax, or any other form of professional advice.</strong> All
              information returned by the Service — including answers, citations, confidence scores, claim verifications, and source analyses — is
              generated by automated AI systems and is provided for informational and research purposes only.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You should not rely on LastSearch outputs to make financial or investment decisions, medical or health decisions, legal decisions,
              or any other decisions where inaccurate information could result in harm, loss, or liability. Always consult qualified professionals
              and verify information from authoritative primary sources before taking action based on AI-generated research.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Confidence scores are algorithmic estimates based on source verification signals — they are <strong className="text-foreground">not guarantees of factual accuracy</strong>.</li>
              <li>Claim verification reflects automated cross-referencing of web sources — it does not constitute expert review or fact-checking by qualified professionals.</li>
              <li>Sources cited may themselves contain errors, outdated information, or biases that the verification pipeline cannot fully detect.</li>
              <li>The Service may produce inaccurate, incomplete, or misleading results despite high confidence scores.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">13. Disclaimer of Warranties</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to
              implied warranties of merchantability, fitness for a particular purpose, accuracy, or non-infringement. Research results are AI-generated
              and may contain inaccuracies, errors, or omissions. We do not warrant that the Service will be uninterrupted, error-free, or that any
              information provided will be accurate, current, or complete.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">14. Limitation of Liability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To the maximum extent permitted by applicable law, LastSearch, its creators, contributors, and affiliates shall not be liable for any
              direct, indirect, incidental, special, consequential, or punitive damages — including but not limited to loss of profits, data, business
              opportunities, or goodwill — arising from or related to your use of, or reliance on, the Service or any information provided by the Service.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This limitation applies regardless of the legal theory (contract, tort, negligence, strict liability, or otherwise), even if we have been
              advised of the possibility of such damages. You expressly acknowledge and agree that you use the Service and rely on its outputs entirely
              at your own risk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">15. Indemnification</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless LastSearch, its creators, contributors, and affiliates from any claims, damages,
              losses, liabilities, costs, or expenses (including reasonable legal fees) arising from: (a) your use of the Service, (b) any action
              taken based on information provided by the Service, (c) your violation of these Terms, or (d) your violation of any applicable law or
              third-party rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">16. Changes to Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update these terms. Continued use of the Service after changes constitutes acceptance. Material changes will be communicated via the website or email at least 14 days before they take effect, except where a change is required by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">17. Contact</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Questions about these terms? Email{" "}
              <a href="mailto:shreyassaw@gmail.com" className="text-accent hover:underline">shreyassaw@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
