import { useState } from "react";
import { X, Linkedin, Sparkles } from "lucide-react";
import { useAuth, type LinkedInProfile } from "@/lib/auth-store";

const SAMPLE_PROFILES: LinkedInProfile[] = [
  {
    name: "Alex Morgan",
    headline: "Senior Product Manager · 8 yrs",
    domain: "Technology",
    position: "Product Manager",
    company: "Microsoft",
    avatarColor: "from-blue-500 to-cyan-500",
  },
  {
    name: "Priya Sharma",
    headline: "Data Scientist · ex-Google",
    domain: "Technology",
    position: "Data Scientist",
    company: "OpenAI",
    avatarColor: "from-violet-500 to-fuchsia-500",
  },
  {
    name: "Marcus Chen",
    headline: "Investment Banker · M&A focus",
    domain: "Finance",
    position: "Investment Banker",
    company: "Goldman Sachs",
    avatarColor: "from-emerald-500 to-teal-500",
  },
  {
    name: "Sofia Reyes",
    headline: "Strategy Consultant · MBB",
    domain: "Consulting",
    position: "Strategy Consultant",
    company: "McKinsey",
    avatarColor: "from-orange-500 to-pink-500",
  },
];

export function SignInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn } = useAuth();
  const [step, setStep] = useState<"start" | "pick">("start");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="relative bg-card border border-border rounded-3xl w-full max-w-md p-7 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        style={{ boxShadow: "var(--shadow-elegant)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {step === "start" ? (
          <>
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome to BingPro</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Sign in with LinkedIn to personalize videos, papers, and resume templates around your career.
            </p>

            <button
              onClick={() => setStep("pick")}
              className="mt-6 w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#0A66C2] text-white text-sm font-semibold hover:bg-[#004182] transition-colors"
            >
              <Linkedin className="h-4 w-4" fill="currentColor" />
              Continue with LinkedIn
            </button>

            <button
              onClick={onClose}
              className="mt-3 w-full py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              Continue as guest
            </button>

            <p className="text-[11px] text-muted-foreground text-center mt-5 leading-relaxed">
              Guests get full access to the platform.
              <br />
              Signed-in users get an AI feed tuned to their profile.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold tracking-tight">Pick a demo profile</h2>
            <p className="text-xs text-muted-foreground mt-1">
              This is a concept demo — choose any profile to see it personalize.
            </p>

            <div className="mt-5 space-y-2">
              {SAMPLE_PROFILES.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    signIn(p);
                    onClose();
                    setStep("start");
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:-translate-y-0.5 transition-all text-left"
                >
                  <div
                    className={`h-10 w-10 rounded-full bg-gradient-to-br ${p.avatarColor} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                  >
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.headline}</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md flex-shrink-0">
                    {p.company}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("start")}
              className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
