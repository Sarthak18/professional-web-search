import { useMemo, useState } from "react";
import { Play, Video, Clock, Eye, ChevronDown, Sparkles, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

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

const VIDEO_KINDS = [
  { tag: "Interview Prep", color: "from-blue-500 to-cyan-500" },
  { tag: "Day in the Life", color: "from-violet-500 to-fuchsia-500" },
  { tag: "Salary Negotiation", color: "from-emerald-500 to-teal-500" },
  { tag: "Tech Round Walkthrough", color: "from-orange-500 to-pink-500" },
  { tag: "Behavioral Questions", color: "from-indigo-500 to-blue-500" },
  { tag: "Resume Review", color: "from-rose-500 to-red-500" },
];

const SPEAKERS = [
  "Sr. Engineer @",
  "Recruiter @",
  "Hiring Manager @",
  "Director @",
  "Ex-",
  "VP of People @",
];

type VideoCard = {
  id: string;
  title: string;
  speaker: string;
  duration: string;
  views: string;
  tag: string;
  gradient: string;
};

function generateVideos(domain: string, position: string, company: string): VideoCard[] {
  return VIDEO_KINDS.map((kind, i) => ({
    id: `${i}-${position}-${company}`,
    title: `${kind.tag}: ${position} at ${company}`,
    speaker: `${SPEAKERS[i % SPEAKERS.length]}${SPEAKERS[i % SPEAKERS.length].startsWith("Ex-") ? company : ` ${company}`}`,
    duration: ["8:42", "14:21", "22:05", "11:30", "17:48", "9:14"][i],
    views: ["128K", "342K", "1.2M", "87K", "456K", "203K"][i],
    tag: kind.tag,
    gradient: kind.color,
  }));
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
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
          className="w-full appearance-none bg-card border border-border rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-foreground hover:border-primary/40 focus:border-primary focus:outline-none transition-colors cursor-pointer"
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
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [position, setPosition] = useState(POSITIONS_BY_DOMAIN[DOMAINS[0]][0]);
  const [company, setCompany] = useState(COMPANIES[0]);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const positions = POSITIONS_BY_DOMAIN[domain];

  const videos = useMemo(() => {
    const all = generateVideos(domain, position, company);
    return activeTag ? all.filter((v) => v.tag === activeTag) : all;
  }, [domain, position, company, activeTag]);

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
              Career Video Lookup
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Watch what it really takes to land the role.
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-curated videos from insiders — pick a domain, position, and company.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent" />
          Sourced from LinkedIn Learning, YouTube & Microsoft Reactor
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
          onChange={(v) => {
            setDomain(v);
            setPosition(POSITIONS_BY_DOMAIN[v][0]);
          }}
        />
        <Select label="Position" value={position} options={positions} onChange={setPosition} />
        <Select label="Company" value={company} options={COMPANIES} onChange={setCompany} />
        <button
          className="px-5 py-3 rounded-xl text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02] flex items-center gap-2"
          style={{ background: "var(--gradient-hero)" }}
          onClick={() => setActiveTag(null)}
        >
          <Play className="h-4 w-4" fill="currentColor" />
          Find Videos
        </button>
      </div>

      {/* Tag filters */}
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
        {VIDEO_KINDS.map((k) => (
          <button
            key={k.tag}
            onClick={() => setActiveTag(k.tag)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border transition-all",
              activeTag === k.tag
                ? "bg-foreground text-background border-foreground"
                : "bg-card border-border text-muted-foreground hover:border-primary/40"
            )}
          >
            {k.tag}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((v) => (
          <article
            key={v.id}
            className="group bg-card border border-border rounded-2xl overflow-hidden hover:-translate-y-1 transition-all cursor-pointer"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            {/* Thumbnail */}
            <div className={cn("relative aspect-video bg-gradient-to-br overflow-hidden", v.gradient)}>
              <div className="absolute inset-0 bg-gradient-to-br opacity-90" />
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
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-mono flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {v.duration}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-14 w-14 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="h-6 w-6 text-foreground ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="p-4">
              <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {v.title}
              </h3>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="truncate">{v.speaker}</span>
                <span className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <Eye className="h-3 w-3" />
                  {v.views}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12 text-sm text-muted-foreground">
          No videos match this filter — try another tag.
        </div>
      )}
    </section>
  );
}
