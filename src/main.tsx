import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// Fonts are served from this origin: no request to a third-party font CDN on page load.
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./index.css";
import { initAnalytics } from "./lib/privacy/analytics";

// Analytics start only once the visitor has opted in (see CookieConsent); a stored "yes" starts them now.
initAnalytics();


createRoot(document.getElementById("root")!).render(<App />);
