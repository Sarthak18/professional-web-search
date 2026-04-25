import { useEffect, useMemo, useState } from "react";
import { Play, Video, Clock, ChevronDown, Sparkles, Filter, Linkedin, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-store";
import { fetchCareerVideos, type CareerVideo } from "@/server/career-videos.functions";

const DOMAINS = ["Technology", "Finance", "Healthcare", "Marketing", "Consulting", "Design"];

const POSITIONS_BY_DOMAIN: Record<string, string[]> = {
  Technology: ["Software Engineer", "Product Manager", "Data Scientist", "DevOps Engineer", "Engineering Manager"],
  Finance: ["Investment Banker", "Financial Analyst", "Risk Manager", "Quant Researcher"],
  Healthcare: ["Clinical Researcher", "Health Data Analyst", "Medical Affairs", "Biotech PM"],
  Marketing: ["Growth Marketer", "Brand Manager", "Content Strategist", "SEO Lead"],
  Consulting: ["Strategy Consultant", "Management Consultant", "Operations Consultant"],
  Design: ["Product Designer", "UX Researcher", "Design Lead", "Brand Designer"],
};

const COMPANIES = ["Microsoft", "Google", "Meta", "Amazon", "Apple", "Netflix", "OpenAI", "Stripe", "McKinsey", "Goldman Sachs"];

const TAG_COLORS: Record<string, string> = {
  "Interview Prep": "from-blue-500 to-cyan-500",
  "Day in the Life": "from-violet-500 to-fuchsia-500",
  "Salary Negotiation": "from-emerald-500 to-teal-500",
  "Tech Round Walkthrough": "from-orange-500 to-pink-500",
  "Behavioral Questions": "from-indigo-500 to-blue-500",
  "Resume Review": "from-rose-500 to-red-500",
};
const TAGS = Object.keys(TAG_COLORS);

const SOURCE_BADGE: Record<string, string> = {
  YouTube: "bg-red-500/10 text-red-600 border-red-500/20",
  "LinkedIn Learning": "bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20",
  "Microsoft Reactor": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Microsoft Learn": "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

function sourceBadge(source: string) {
  return SOURCE_BADGE[source] ?? "bg-muted text-muted-foreground border-border";
}

function Select({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex-1 min-w-[140px]">
      <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
        {label}
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-card border border-border rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-foreground hover:border-primary/40 focus:border-primary focus:outline-none transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    </label>
  );
}

export function CareerVideosSection() {
  const { user, isReady } = useAuth();
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [position, setPosition] = useState(POSITIONS_BY_DOMAIN[DOMAINS[0]][0]);
  const [company, setCompany] = useState(COMPANIES[0]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [videos, setVideos] = useState<CareerVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-fill selectors when a user signs in (client-only, avoids SSR mismatch)
  useEffect(() => {
    if (isReady && user) {
      setDomain(user.domain);
      setPosition(user.position);
      setCompany(user.company);
    }
  }, [isReady, user]);

  const positions = POSITIONS_BY_DOMAIN[domain] ?? POSITIONS_BY_DOMAIN[DOMAINS[0]];

  const search = async () => {
    setLoading(true);
    setError(null);
    setActiveTag(null);
    try {
      const result = await fetchCareerVideos({
        data: {
          domain,
          position,
          company,
          personalization: user
            ? { name: user.name, headline: user.headline }
            : undefined,
        },
      });
      setVideos(result.videos);
      if (result.error) setError(result.error);
      setHasSearched(true);
    } catch (e) {
      console.error(e);
      setError("Something went wrong loading videos.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(
    () => (activeTag ? videos.filter((v) => v.tag === activeTag) : videos),
    [videos, activeTag]
  );

  const personalized = isReady && !!user;

  return (
    <section className="mt-20">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Video className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {personalized ? "Your Career Feed" : "Career Video Lookup"}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {personalized
              ? `Hand-picked for you, ${user.name.split(" ")[0]}.`
              : "Watch what it really takes to land the role."}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {personalized ? (
              <span className="inline-flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" fill="currentColor" />
                Reranked using your LinkedIn profile · adjust selectors to explore more
              </span>
            ) : (
              "AI-curated videos from across the web — pick a domain, position, and company."
            )}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent" />
          Sourced via AI from YouTube, LinkedIn Learning & Microsoft Reactor
        </div>
      </div>

      {/* Selectors */}
      <div
        className="bg-card border border-border rounded-2xl p-4 flex flex-wrap gap-3 items-end"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <Select
          label="Domain"
          value={domain}
          options={DOMAINS}
          disabled={loading}
          onChange={(v) => {
            setDomain(v);
            setPosition(POSITIONS_BY_DOMAIN[v][0]);
          }}
        />
        <Select label="Position" value={position} options={positions} onChange={setPosition} disabled={loading} />
        <Select label="Company" value={company} options={COMPANIES} onChange={setCompany} disabled={loading} />
        <button
          onClick={search}
          disabled={loading}
          className="px-5 py-3 rounded-xl text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02] flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: "var(--gradient-hero)" }}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </>
          ) : (
            <>
              <Play className="h-4 w-4" fill="currentColor" />
              {hasSearched ? "Refresh" : "Find Videos"}
            </>
          )}
        </button>
      </div>

      {/* Tag filters */}
      {hasSearched && videos.length > 0 && (
        <div className="flex items-center gap-2 mt-5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
            <Filter className="h-3 w-3" />
            Filter:
          </div>
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border transition-all",
              activeTag === null
                ? "bg-foreground text-background border-foreground"
                : "bg-card border-border text-muted-foreground hover:border-primary/40"
            )}
          >
            All
          </button>
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                activeTag === tag
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card border-border text-muted-foreground hover:border-primary/40"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-5 flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Empty state */}
      {!hasSearched && !loading && (
        <div className="mt-8 text-center py-16 rounded-2xl border border-dashed border-border bg-muted/30">
          <Video className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <p className="mt-3 text-sm text-foreground font-medium">Ready when you are.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Click <span className="font-medium text-foreground">Find Videos</span> to get AI-curated recommendations.
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video grid */}
      {!loading && filtered.length > 0 && (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((v, i) => {
            const gradient = TAG_COLORS[v.tag] ?? "from-slate-500 to-slate-700";
            return (
              <a
                key={`${v.url}-${i}`}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:-translate-y-1 transition-all block"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                {/* Thumbnail */}
                <div className={cn("relative aspect-video bg-gradient-to-br overflow-hidden", gradient)}>
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4) 0px, transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.3) 0px, transparent 50%)",
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider">
                    {v.tag}
                  </div>
                  {v.duration && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {v.duration}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="h-6 w-6 text-foreground ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border", sourceBadge(v.source))}>
                      {v.source}
                    </span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                  </div>
                  <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {v.title}
                  </h3>
                  <div className="mt-1.5 text-xs text-muted-foreground truncate">{v.speaker}</div>
                  {v.why && (
                    <div className="mt-2 pt-2 border-t border-border/60 flex items-start gap-1.5 text-[11px] text-muted-foreground leading-snug">
                      <Sparkles className="h-3 w-3 text-accent flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{v.why}</span>
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}

      {hasSearched && !loading && filtered.length === 0 && !error && (
        <div className="text-center py-12 text-sm text-muted-foreground">
          No videos match this filter — try another tag.
        </div>
      )}
    </section>
  );
}
