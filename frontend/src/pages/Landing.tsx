import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, BarChart3, Box, FileText, Infinity as InfinityIcon, Layers, Scissors, Search,
  Sparkles, Split, Target, Zap,
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
    <header className="relative z-40 mx-auto flex h-20 max-w-[1400px] items-center justify-between px-4 sm:px-8">
      <Logo />
      <nav className="hidden items-center gap-1 rounded-full border border-ink/10 bg-white/60 p-1 backdrop-blur md:flex">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="rounded-full px-4 py-1.5 text-sm text-ink/75 transition hover:bg-ink/5 hover:text-ink">
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

const HERO_POINTS = [
  { icon: InfinityIcon, title: "200K tokens", sub: "Long-context processing" },
  { icon: Layers, title: "Hybrid design", sub: "Mamba + Transformer" },
  { icon: Zap, title: "Retrieval-first", sub: "Only relevant chunks" },
];

// From xl: two columns, text left, mascot + orbit right at full size. Below xl: stacked.
function Hero() {
  return (
    <section className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-6 px-4 sm:px-8 xl:min-h-[calc(100svh-5rem)] xl:grid-cols-[minmax(0,1fr)_820px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative z-40 pt-6 text-center xl:pt-0 xl:text-left"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-1.5 text-sm text-ink/70">
          <Box className="size-4 text-teal" /> Research · Long-Context AI
        </span>
        <h1 className="mt-6 text-[clamp(2.6rem,3.7vw,4rem)] font-bold leading-[1.05] tracking-tight text-ink">
          Transformer And Mamba <span className="text-[#0E9F97]">Orchestrator</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-ink/60 xl:mx-0">
          A hybrid AI system for long-context understanding, retrieval, and question answering, up to 200K tokens.
        </p>
        <Link to="/login" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-white transition hover:bg-ink/85">
          Try the demo <ArrowRight className="size-4" />
        </Link>
        <div className="mt-10 grid grid-cols-3 divide-x divide-ink/10 text-left">
          {HERO_POINTS.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="px-3 first:pl-0 sm:px-5 xl:px-3 min-[1440px]:px-5">
              <Icon className="size-6 text-[#0E9F97]" />
              <p className="mt-3 whitespace-nowrap text-sm font-semibold text-ink sm:text-base xl:text-sm min-[1440px]:text-base">{title}</p>
              <p className="mt-0.5 text-xs text-ink/55 sm:text-sm">{sub}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Orbit stage — full size from lg up, scaled down on smaller screens */}
      <div className="relative flex h-[270px] justify-center sm:h-[440px] lg:h-[560px]">
        <div className="origin-top scale-[0.46] sm:scale-[0.78] lg:scale-100">
          <OrbitStage />
        </div>
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

const STATS = [
  { icon: Target, value: "84%", label: "Retrieval hit@3" },
  { icon: BarChart3, value: "28–40%", label: "QA accuracy (vs 2–8% baseline)" },
  { icon: Zap, value: "2.8×", label: "Latency overhead" },
  { icon: Layers, value: "200K", label: "Max context length" },
];

function Benchmarks() {
  return (
    <section id="benchmarks" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 sm:px-8">
      <motion.div {...fadeUp} className="grid grid-cols-2 gap-y-6 rounded-3xl border border-white bg-white/70 px-6 py-7 shadow-[0_20px_60px_-30px_rgba(11,15,20,0.3)] lg:grid-cols-4 lg:divide-x lg:divide-ink/10">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center justify-center gap-2 px-2 text-center sm:flex-row sm:gap-4 sm:px-4 sm:text-left">
            <Icon className="size-8 shrink-0 text-[#0E9F97]" />
            <div>
              <p className="whitespace-nowrap text-2xl font-bold tracking-tight text-ink">{value}</p>
              <p className="text-sm text-ink/55">{label}</p>
            </div>
          </div>
        ))}
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
      <Navbar />
      <Hero />
      <Benchmarks />
      <HowItWorks />
      <Features />
      <Architecture />
      <Footer />
    </div>
  );
}
