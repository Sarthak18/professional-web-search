import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, FileText, Users, FileBadge2, Briefcase, Mic, Camera, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bing Pro — AI Search for Professionals, Powered by LinkedIn" },
      { name: "description", content: "Search white papers, LinkedIn insights, resume templates and career intelligence — all in one AI-powered workspace." },
      { property: "og:title", content: "Bing Pro — AI Search for Professionals" },
      { property: "og:description", content: "AI-integrated search for white papers, LinkedIn data, and resume templates." },
    ],
  }),
  component: Index,
});

const categories = [
  { icon: FileText, label: "White Papers", hint: "Peer-reviewed research" },
  { icon: Users, label: "LinkedIn Insights", hint: "People, companies, posts" },
  { icon: FileBadge2, label: "Resume Templates", hint: "ATS-ready, AI-tailored" },
  { icon: Briefcase, label: "Jobs & Talent", hint: "Open roles + salary data" },
];

const trending = [
  "AI prompt engineer salary trends 2025",
  "GenAI white papers from MIT",
  "Resume template for product managers",
  "Top fintech founders on LinkedIn",
  "Quantum computing research papers",
];

const aiSuggestions = [
  "Summarize this week's most-cited AI papers",
  "Build me a resume for a senior data scientist role",
  "Who are the top voices in climate tech on LinkedIn?",
];

function Index() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated mesh background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-mesh)" }}
      />
      <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />

      {/* Top nav */}
      <header className="flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Bing<span className="text-primary">Pro</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Discover</a>
          <a href="#" className="hover:text-foreground transition-colors">For Teams</a>
          <a href="#" className="hover:text-foreground transition-colors">API</a>
          <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
        </nav>
        <button className="px-4 py-2 rounded-full text-sm font-medium text-primary-foreground transition-all hover:scale-105"
          style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }}>
          Sign in with Microsoft
        </button>
      </header>

      {/* Hero */}
      <main className="px-6 md:px-12 pt-12 md:pt-20 pb-16 max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs text-muted-foreground mb-6"
            style={{ boxShadow: "var(--shadow-soft)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Now powered by Copilot · LinkedIn graph included
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
            Search the{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
              professional web
            </span>
            ,
            <br />
            answered by AI.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One search box for white papers, LinkedIn intelligence, resume templates,
            and the people behind every idea worth knowing.
          </p>
        </div>

        {/* Search box */}
        <form onSubmit={(e) => e.preventDefault()} className="relative group">
          <div
            className="absolute -inset-0.5 rounded-3xl opacity-60 blur transition group-focus-within:opacity-100 group-hover:opacity-90"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="relative bg-card rounded-3xl border border-border p-2 flex items-center gap-2"
            style={{ boxShadow: "var(--shadow-elegant)" }}>
            <Search className="h-5 w-5 ml-3 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything — papers, people, posts, jobs..."
              className="flex-1 bg-transparent outline-none text-base md:text-lg py-3 placeholder:text-muted-foreground"
            />
            <button type="button" className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors" aria-label="Voice search">
              <Mic className="h-4 w-4" />
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors" aria-label="Image search">
              <Camera className="h-4 w-4" />
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02]"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Sparkles className="h-4 w-4" />
              Ask AI
            </button>
          </div>
        </form>

        {/* Category chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const active = i === activeCategory;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(i)}
                className={cn(
                  "group flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all",
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-foreground border-border hover:border-primary/40 hover:-translate-y-0.5"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="font-medium">{cat.label}</span>
                <span className={cn("text-xs hidden sm:inline", active ? "text-background/70" : "text-muted-foreground")}>
                  · {cat.hint}
                </span>
              </button>
            );
          })}
        </div>

        {/* AI suggestions */}
        <div className="mt-12 grid md:grid-cols-3 gap-3">
          {aiSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="group text-left p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all hover:-translate-y-1"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-foreground leading-snug">{s}</p>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-accent" />
                AI suggested
              </div>
            </button>
          ))}
        </div>

        {/* Trending */}
        <section className="mt-16">
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">Trending in your network</span>
          </div>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
            {trending.map((t, i) => (
              <a
                key={t}
                href="#"
                onClick={(e) => { e.preventDefault(); setQuery(t); }}
                className="flex items-center gap-4 py-3 border-b border-border/60 hover:border-primary/40 transition-colors group"
              >
                <span className="text-xs font-mono text-muted-foreground w-6">0{i + 1}</span>
                <span className="text-sm flex-1 group-hover:text-primary transition-colors">{t}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </section>

        {/* Stats / trust strip */}
        <section className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { v: "200M+", l: "Research papers" },
            { v: "1B+", l: "LinkedIn profiles" },
            { v: "50K+", l: "Resume templates" },
            { v: "Real-time", l: "Career signals" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
                {s.v}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </section>
      </main>

      <footer className="px-6 md:px-12 py-6 border-t border-border text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-3">
        <div>© Microsoft 2026 · BingPro is a concept demo</div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">About</a>
        </div>
      </footer>
    </div>
  );
}
