import { Link } from "react-router-dom";
import { CookieSettingsLink } from "@/components/CookieConsent";
import { DISCLAIMER_LINES } from "@/lib/disclaimer";


const linkClass =
  "rounded-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const INTERNAL_LINKS = [
  { to: "/playground", label: "Playground" },
  { to: "/docs", label: "Docs" },
  { to: "/developers", label: "Developers" },
  { to: "/recipes", label: "Recipes" },
  { to: "/changelog", label: "Changelog" },
  { to: "/scorecard", label: "Scorecard" },
  { to: "/alternatives", label: "Alternatives" },
];

const LEGAL_LINKS = [
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="bg-card px-4 sm:px-8 py-16 sm:py-20">
      <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <div className="space-y-5">
          <Link to="/" className="inline-flex items-center gap-2 rounded-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <img src="/logo.svg" alt="" width={20} height={20} className="w-5 h-5" />
            <span className="text-lg font-semibold tracking-tight">LastSearch</span>
          </Link>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {INTERNAL_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass}>{l.label}</Link>
            ))}
            <a href="https://github.com/lastsearch-hq/lastsearch" target="_blank" rel="noopener noreferrer" className={linkClass}>GitHub</a>
            <a href="https://discord.gg/ubAuT4YQsT" target="_blank" rel="noopener noreferrer" className={linkClass}>Discord</a>
          </nav>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass}>{l.label}</Link>
            ))}
            <CookieSettingsLink className={linkClass} />
            <a href="mailto:shreyassaw@gmail.com" className={linkClass}>Contact</a>
          </div>
          <p className="text-sm text-muted-foreground">
            Made by{" "}
            <a href="https://www.linkedin.com/in/shreyas-sawant" target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">Shreyas</a>.
          </p>
        </div>
        <div className="space-y-2 text-sm leading-relaxed text-muted-foreground max-w-[60ch]">
          <p className="text-foreground font-medium">Please read before relying on results</p>
          {DISCLAIMER_LINES.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}
