import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, BarChart3, FileText, Layers, Scissors, Search,
  Sparkles, Split, Target, Zap,
} from "lucide-react";
import { HeroScene } from "@/components/landing/HeroScene";

const NAV = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Architecture", href: "#architecture" },
  { label: "Benchmarks", href: "#benchmarks" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 text-ink">
      <span className="flex gap-[3px]" aria-hidden>
        {[0, 1, 2].map((i) => <span key={i} className="h-5 w-[3px] skew-x-[-20deg] rounded-full bg-navy" />)}
      </span>
      <span className="font-serif text-2xl tracking-[0.18em]">T.A.M.O.</span>
    </Link>
  );
}

function Navbar() {
  return (
    <header className="relative z-40 mx-auto flex h-20 max-w-[1400px] items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-4">
        <Logo />
        <span className="hidden h-6 w-px bg-ink/15 lg:block" />
        <span className="hidden text-xs text-ink/60 lg:block">Transformer And Mamba Orchestrator</span>
      </div>
      <nav className="hidden items-center gap-8 md:flex">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="text-sm text-ink/75 transition hover:text-ink">
            {n.label}
          </a>
        ))}
      </nav>
      <SpinningBadge />
    </header>
  );
}

function SpinningBadge() {
  return (
    <div className="relative size-16 shrink-0">
      <svg viewBox="0 0 100 100" className="animate-spin-slow absolute inset-0 text-ink/70">
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="11" fill="currentColor">
          <textPath href="#badge-circle" textLength="226" lengthAdjust="spacing">LONG CONTEXT · HYBRID AI ·</textPath>
        </text>
      </svg>
      <Sparkles className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-ink" />
    </div>
  );
}

const STATS = [
  { icon: Layers, value: "200K", label: "Token context" },
  { icon: Target, value: "84%", label: "Retrieval hit@3" },
  { icon: BarChart3, value: "28–40%", label: "QA accuracy" },
  { icon: Zap, value: "2.8×", label: "Latency overhead" },
];

// From xl: two columns, text left, CSS scene right at full size. Below xl: stacked.
function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-[1400px] px-4 sm:px-8">
      <div className="grid grid-cols-1 items-center gap-6 xl:min-h-[calc(100svh-9rem)] xl:grid-cols-[minmax(0,1fr)_700px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative z-40 pt-6 text-center xl:pt-0 xl:text-left"
        >
          <p className="inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-ink/60">
            A hybrid long-context AI system <span className="hidden h-px w-24 bg-ink/25 min-[1440px]:block" />
          </p>
          <h1 className="mt-5 font-serif text-[clamp(2.6rem,3.7vw,4.3rem)] leading-[1.02] text-ink">
            Unify Long-Context Understanding with <em className="text-navy">Hybrid Intelligence.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg text-ink/60 xl:mx-0">
            T.A.M.O. combines a Mamba state space model with a Transformer, retrieving only the relevant passages
            from documents of up to 200K tokens and routing each question to the model it needs.
          </p>
          <Link to="/login" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-navy px-7 py-3.5 text-sm font-medium text-white transition hover:bg-navy/85">
            Try the Live Demo <ArrowRight className="size-4" />
          </Link>
          <div id="benchmarks" className="mt-8 grid scroll-mt-24 grid-cols-2 gap-y-5 rounded-xl border border-white bg-white/60 py-4 text-left shadow-[0_20px_60px_-30px_rgba(11,15,20,0.25)] backdrop-blur sm:grid-cols-4 sm:divide-x sm:divide-ink/10 xl:grid-cols-2 xl:divide-x-0">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2.5 px-3 min-[1440px]:px-4">
                <Icon className="size-6 shrink-0 text-navy" strokeWidth={1.5} />
                <div>
                  <p className="whitespace-nowrap font-serif text-2xl leading-none text-ink">{value}</p>
                  <p className="mt-1 whitespace-nowrap text-xs text-ink/60">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scene — full size from lg up, scaled down on smaller screens */}
        <div className="relative flex h-[290px] justify-center sm:h-[490px] lg:h-[620px]">
          <div className="origin-top scale-[0.46] sm:scale-[0.78] lg:scale-100">
            <HeroScene />
          </div>
        </div>
      </div>
      <div className="hidden items-center justify-end gap-6 pb-6 text-[11px] uppercase tracking-[0.25em] text-ink/55 xl:flex">
        <span className="h-px w-24 bg-ink/25" />
        Research <span>/</span> Long-context AI <span>/</span> Hybrid architecture
      </div>
    </section>
  );
}

const SECTIONS = ["top", "how-it-works", "features", "architecture"];

// Vertical dots on the left edge: the dot for the section in view is filled.
function SectionDots() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <nav className="fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-4 min-[1440px]:flex" aria-label="Sections">
      {SECTIONS.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={id}
          className={`size-1.5 border border-ink/60 transition ${active === id ? "scale-125 bg-ink" : "bg-transparent"}`}
        />
      ))}
    </nav>
  );
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{title}</h2>
      <p className="mt-4 text-ink/55">{sub}</p>
    </motion.div>
  );
}

const FEATURES = [
  { icon: FileText, title: "200K-token documents", body: "Feed in entire reports, books, or codebases. Documents are chunked and encoded once, then queried as often as you like." },
  { icon: Search, title: "Semantic retrieval", body: "Every question is matched against the document's chunks, so only the most relevant passages reach the model." },
  { icon: Split, title: "Confidence-gated routing", body: "Easy questions take the fast Mamba path. Uncertain ones are escalated to the Transformer for careful reasoning." },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-8">
      <SectionHeading eyebrow="Features" title="Built for documents that don't fit." sub="Standard models see a few thousand tokens. T.A.M.O. is designed to work across hundreds of thousands." />
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }, i) => (
          <motion.div key={title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }} className="rounded-3xl border border-white bg-white/70 p-7 shadow-[0_20px_60px_-30px_rgba(11,15,20,0.3)]">
            <span className="grid size-11 place-items-center rounded-xl bg-ink text-cyan">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">{body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  { icon: FileText, title: "Long document", sub: "Up to 200K tokens" },
  { icon: Scissors, title: "Chunk & encode", sub: "256-token chunks, Mamba-130M" },
  { icon: Search, title: "Retrieve top-3", sub: "Cosine relevance search" },
  { icon: Split, title: "Route", sub: "Entropy + relevance gate" },
  { icon: Sparkles, title: "Generate answer", sub: "Mamba or TinyLlama" },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 py-24 sm:px-8">
      <SectionHeading eyebrow="How it works" title="A simple, efficient pipeline." sub="Retrieval with Mamba, intelligent routing, and precise generation with a Transformer." />
      <div className="mt-14 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
        {STEPS.map(({ icon: Icon, title, sub }, i) => (
          <motion.div key={title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="flex flex-1 items-center gap-3 lg:contents">
            <div className="flex flex-1 items-center gap-4 rounded-2xl border border-white bg-white/70 p-5 shadow-[0_20px_60px_-30px_rgba(11,15,20,0.3)]">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink text-cyan">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-ink">{title}</p>
                <p className="text-xs text-ink/55">{sub}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && <ArrowRight className="mx-auto hidden size-5 shrink-0 text-ink/30 lg:block" />}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Architecture() {
  return (
    <section id="architecture" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-8">
      <SectionHeading eyebrow="Architecture" title="Two models, one orchestrator." sub="A state space model for scale, a Transformer for precision, and a gate that decides which one a question needs." />
      <motion.div {...fadeUp} className="mt-14 grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-3xl border border-white bg-white/70 p-7">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">State space model</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Mamba</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">Encodes long inputs in linear time and drafts quick answers. Handles the bulk of the context cheaply.</p>
        </div>
        <div className="mx-auto flex flex-col items-center gap-2 rounded-3xl bg-ink px-7 py-6 text-center text-white">
          <Split className="size-7 text-cyan" />
          <p className="font-semibold">Orchestrator</p>
          <p className="text-xs text-white/50">entropy ≤ τH · relevance ≥ τR</p>
        </div>
        <div className="rounded-3xl border border-white bg-white/70 p-7">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">Attention model</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Transformer</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">Reasons carefully over the retrieved passages when the fast path isn't confident enough.</p>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo />
          <p className="mt-2 max-w-xs text-sm text-ink/55">Transformer And Mamba Orchestrator: a hybrid architecture for long-context processing.</p>
        </div>
        <div className="grid gap-8 text-sm sm:grid-cols-2">
          <div>
            <p className="font-semibold text-ink">Team</p>
            <p className="mt-2 text-ink/60">Shrinidhi Vittala R</p>
            <p className="text-ink/60">Samiksha Das</p>
          </div>
          <div>
            <p className="font-semibold text-ink">Guide</p>
            <p className="mt-2 text-ink/60">Dr. Sridevi G M</p>
            <p className="text-ink/60">Dept. of ISE, Jyothy Institute of Technology, Bengaluru</p>
          </div>
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-ink/40">Final Year Project · © {new Date().getFullYear()} T.A.M.O.</p>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <SectionDots />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Architecture />
      <Footer />
    </div>
  );
}
