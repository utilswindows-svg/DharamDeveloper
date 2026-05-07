import { useState, useEffect } from "react";
import LegalPageLayout from "./legal/LegalPageLayout";
import { toast } from "@/hooks/use-toast";
import { Cookie, Shield, BarChart3, Megaphone } from "lucide-react";
import SEO from "@/components/SEO";

interface CookieCategory {
  id: string;
  icon: React.ElementType;
  name: string;
  desc: string;
  required?: boolean;
}

const categories: CookieCategory[] = [
  {
    id: "necessary",
    icon: Shield,
    name: "Strictly Necessary",
    desc: "Essential for the website to function. Cannot be disabled.",
    required: true,
  },
  {
    id: "functional",
    icon: Cookie,
    name: "Functional Cookies",
    desc: "Remember preferences like language, region, and theme.",
  },
  {
    id: "analytics",
    icon: BarChart3,
    name: "Analytics Cookies",
    desc: "Help us understand how visitors interact with our website.",
  },
  {
    id: "marketing",
    icon: Megaphone,
    name: "Marketing Cookies",
    desc: "Used to deliver relevant ads and measure campaign effectiveness.",
  },
];

const STORAGE_KEY = "cookie-preferences";

const CookiePreferences = () => {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPrefs({ ...prefs, ...JSON.parse(saved), necessary: true });
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) => {
    if (id === "necessary") return;
    setPrefs(p => ({ ...p, [id]: !p[id] }));
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    toast({ title: "Preferences saved", description: "Your cookie preferences have been updated." });
  };

  const acceptAll = () => {
    const all = { necessary: true, functional: true, analytics: true, marketing: true };
    setPrefs(all);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    toast({ title: "All cookies accepted", description: "You've enabled all cookie categories." });
  };

  const rejectAll = () => {
    const minimal = { necessary: true, functional: false, analytics: false, marketing: false };
    setPrefs(minimal);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
    toast({ title: "Non-essential cookies rejected", description: "Only necessary cookies will be used." });
  };

  return (
    <>
      <SEO title="Cookie Preferences" description="Manage your cookie preferences for WindowsUtils." path="/cookie-preferences" keywords="cookies, preferences, privacy" type="website" />
      <LegalPageLayout
      title="Cookie Preferences"
      subtitle="Manage how WindowsUtils uses cookies to improve your experience."
      lastUpdated="January 1, 2026"
    >
      <h2>About Cookies</h2>
      <p>
        Cookies are small text files stored on your device when you visit our website. We use them to
        remember your preferences, analyze traffic, and improve our services. You can customize which
        categories of cookies to allow below.
      </p>

      <div className="not-prose mt-6 space-y-3">
        {categories.map(cat => {
          const Icon = cat.icon;
          const enabled = prefs[cat.id];
          return (
            <div
              key={cat.id}
              className="flex items-start justify-between gap-4 p-5 rounded-xl border border-border bg-card"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-semibold text-foreground">{cat.name}</h3>
                    {cat.required && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{cat.desc}</p>
                </div>
              </div>
              <button
                onClick={() => toggle(cat.id)}
                disabled={cat.required}
                className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                  enabled ? "bg-primary" : "bg-muted"
                } ${cat.required ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                aria-label={`Toggle ${cat.name}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${
                    enabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="not-prose mt-6 flex flex-wrap gap-3">
        <button
          onClick={save}
          className="primary-gradient rounded-lg px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Save Preferences
        </button>
        <button
          onClick={acceptAll}
          className="rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          Accept All
        </button>
        <button
          onClick={rejectAll}
          className="rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          Reject Non-Essential
        </button>
      </div>

      <h2>How We Use Cookies</h2>
      <ul>
        <li><strong>Session management</strong> — keep you signed in across pages.</li>
        <li><strong>Preferences</strong> — remember your language, theme, and region.</li>
        <li><strong>Analytics</strong> — Google Analytics and internal metrics.</li>
        <li><strong>Marketing</strong> — measure ad campaign performance.</li>
      </ul>

      <h2>Managing Browser Cookies</h2>
      <p>
        You can also control cookies directly through your browser settings. Note that disabling certain
        cookies may impact website functionality. For more information, see our{" "}
        <a href="/privacy" className="text-primary hover:underline">Privacy Statement</a>.
      </p>
    </LegalPageLayout>
    </>
  );
};

export default CookiePreferences;
