import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Cpu, FileText, Gauge, Infinity as InfinityIcon, Layers, Play,
  Scissors, Search, Sparkles, Split, Zap,
} from "lucide-react";
import { OrbitStage } from "@/components/landing/OrbitStage";

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
    <Link to="/" className="flex items-center gap-1.5 text-lg font-semibold tracking-tight text-ink">
      <span className="font-serif text-2xl italic text-teal">(</span>T.A.M.O.
    </Link>
  );
}

function Navbar() {
  return (
    <header className="relative z-40 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
      <Logo />
      <nav className="hidden items-center gap-1 rounded-full border border-ink/10 bg-white/60 p-1 backdrop-blur md:flex">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="rounded-full px-4 py-1.5 text-sm text-ink/75 transition hover:bg-ink/5 hover:text-ink">
            {n.label}
          </a>
        ))}
      </nav>
      <Link to="/login" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-ink/85">
        Try T.A.M.O. <ArrowUpRight className="size-4" />
      </Link>
    </header>
  );
}

function SpinningBadge() {
  return (
    <div className="relative size-24">
      <svg viewBox="0 0 100 100" className="animate-spin-slow absolute inset-0 text-ink/70">
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="9" fill="currentColor">
          <textPath href="#badge-circle" textLength="226" lengthAdjust="spacing">LONG CONTEXT · HYBRID AI ·</textPath>
        </text>
      </svg>
      <Sparkles className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 text-ink" />
    </div>
  );
}

function SideCard({ icon: Icon, title, sub, className }: { icon: typeof FileText; title: string; sub: string; className: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className={`absolute z-30 hidden w-52 rounded-3xl border border-white bg-white/80 p-5 shadow-[0_20px_60px_-20px_rgba(11,15,20,0.25)] backdrop-blur xl:block ${className}`}
    >
      <span className="grid size-10 place-items-center rounded-xl bg-ink/5 text-ink">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-lg font-semibold leading-tight tracking-tight text-ink">{title}</p>
      <p className="mt-2 text-sm text-ink/55">{sub}</p>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-8">
      <div className="absolute right-8 top-2 hidden lg:block">
        <SpinningBadge />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative z-20 pt-6 text-center"
      >
        <h1 className="relative inline-block font-serif text-7xl leading-none tracking-tight text-ink sm:text-8xl lg:text-[8.5rem]">
          T.A.M.O.
          {/* Cyan swoosh orbiting the final "O" */}
          <svg viewBox="0 0 200 80" className="pointer-events-none absolute -right-[6%] -top-[12%] w-[38%]" aria-hidden>
            <path d="M6 62 Q 120 84 194 8" fill="none" stroke="#1AC6B8" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </h1>
        <p className="mt-3 font-serif text-3xl italic text-ink sm:text-4xl lg:text-5xl">Transformer And Mamba Orchestrator</p>
        <p className="mx-auto mt-5 max-w-xl text-base text-ink/55 sm:text-lg">
          Long-context intelligence. Smarter orchestration.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-ink/85">
            Try it now <ArrowRight className="size-4" />
          </Link>
          <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-6 py-3 text-sm font-medium text-ink transition hover:bg-white">
            <span className="grid size-5 place-items-center rounded-full bg-ink text-white">
              <Play className="size-2.5 fill-current" />
            </span>
            See how it works
          </a>
        </div>
      </motion.div>

      <SideCard icon={FileText} title="Process massive documents." sub="Up to 200K tokens with efficient retrieval." className="left-8 top-[300px] -rotate-6" />
      <SideCard icon={Layers} title="Find, reason, and answer." sub="Grounded, accurate, and context-aware." className="right-8 top-[380px] rotate-6" />

      {/* Orbit stage — fixed-size scene scaled down on smaller screens */}
      <div className="relative -mt-4 flex h-[270px] justify-center overflow-visible sm:h-[440px] lg:h-[560px]">
        <div className="origin-top scale-[0.46] sm:scale-[0.78] lg:scale-100">
          <OrbitStage />
        </div>
      </div>

      <div className="absolute bottom-16 left-8 z-30 hidden max-w-[200px] lg:block">
        <InfinityIcon className="size-8 text-ink" />
        <p className="mt-2 text-sm text-ink/70">Built on Mamba × Transformer orchestration.</p>
      </div>
      <div className="absolute bottom-16 right-8 z-30 hidden max-w-[180px] lg:block">
        <Zap className="size-6 text-ink" />
        <p className="mt-2 text-sm text-ink/70">Efficient long-context processing.</p>
      </div>
    </section>
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
  { icon: Scissors, title: "Chunk", body: "Split the document into 256-token chunks." },
  { icon: Cpu, title: "Encode", body: "Mamba embeds every chunk in linear time." },
  { icon: Search, title: "Retrieve", body: "Cosine similarity picks the top-3 chunks." },
  { icon: Gauge, title: "Gate", body: "Entropy and relevance decide the path." },
  { icon: Sparkles, title: "Answer", body: "Fast Mamba answer, or Transformer escalation." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-ink py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">How it works</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Five steps from document to answer.</h2>
        </motion.div>
        <div className="relative mt-16 grid gap-6 md:grid-cols-5">
          <div className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-gradient-to-r from-cyan/0 via-cyan/50 to-cyan/0 md:block" />
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <motion.div key={title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="relative text-center">
              <span className="relative mx-auto grid size-14 place-items-center rounded-2xl border border-cyan/30 bg-ink text-cyan shadow-[0_0_30px_-6px_rgba(0,229,255,0.5)]">
                <Icon className="size-6" />
              </span>
              <p className="mt-5 text-xs text-white/40">0{i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-white/55">{body}</p>
            </motion.div>
          ))}
        </div>
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

const STATS = [
  { value: "200K", label: "tokens processed per document" },
  { value: "84%", label: "hit@3 retrieval rate" },
  { value: "28–40%", label: "QA accuracy, vs 2–8% for a 2K-window Transformer" },
];

function Benchmarks() {
  return (
    <section id="benchmarks" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-24 sm:px-8">
      <SectionHeading eyebrow="Benchmarks" title="Measured, not promised." sub="Results from our research evaluation on long-document question answering." />
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {STATS.map((s, i) => (
          <motion.div key={s.label} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }} className="rounded-3xl border border-white bg-white/70 p-8 text-center">
            <p className="font-serif text-6xl text-ink">{s.value}</p>
            <p className="mt-3 text-sm text-ink/55">{s.label}</p>
          </motion.div>
        ))}
      </div>
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
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Architecture />
      <Benchmarks />
      <Footer />
    </div>
  );
}
