import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import mascot from "@/assets/hero/mascot.webp";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

const Eyebrow = ({ children, className = "text-crimson" }: { children: string; className?: string }) => (
  <p className={`font-mono text-xs uppercase tracking-[0.2em] ${className}`}>{children}</p>
);

// The scale gap: a 2K window against a 200K document (1%).
export function Problem() {
  return (
    <section id="problem" className="scroll-mt-8 px-4 py-24 sm:px-8 lg:px-[6vw] lg:py-32">
      <motion.div {...fadeUp} className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
        <div>
          <Eyebrow>The problem</Eyebrow>
          <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.02] text-ink sm:text-6xl">
            Most models read <em className="text-crimson">one percent</em> of a long document.
          </h2>
        </div>
        <p className="max-w-md leading-relaxed text-ink/65">
          TinyLlama sees 2,048 tokens at a time. A 200K-token report is a hundred times longer, so the answer is
          usually somewhere the model never looks.
        </p>
      </motion.div>

      <motion.div {...fadeUp} className="mt-16">
        <div className="flex justify-between font-mono text-[11px] text-ink/50">
          <span>token 0</span><span>200,000</span>
        </div>
        <div className="relative mt-2 h-14 overflow-hidden rounded-md bg-[repeating-linear-gradient(90deg,rgba(11,15,20,0.09)_0_1px,transparent_1px_12px)] ring-1 ring-ink/15">
          <motion.div
            className="absolute inset-y-0 left-0 w-[1%] min-w-1 bg-ember"
            initial={{ x: 0 }}
            whileInView={{ x: ["0%", "9800%", "0%"] }}
            viewport={{ once: true }}
            transition={{ duration: 6, ease: "easeInOut", delay: 0.4 }}
          />
        </div>
        <p className="mt-3 font-mono text-[11px] text-ember">▲ 2K context window</p>
      </motion.div>

      <div className="mt-16 grid gap-10 border-t border-ink/15 pt-10 sm:grid-cols-2">
        <motion.div {...fadeUp}>
          <p className="font-serif text-7xl text-ink/30 sm:text-8xl">2–8%</p>
          <p className="mt-2 text-sm text-ink/60">QA accuracy, TinyLlama with its 2K window</p>
        </motion.div>
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
          <p className="font-serif text-7xl text-crimson sm:text-8xl">28–40%</p>
          <p className="mt-2 text-sm text-ink/60">QA accuracy, T.A.M.O. retrieving across all 200K tokens</p>
        </motion.div>
      </div>
    </section>
  );
}

function Node({ tag, title, sub, accent = false }: { tag: string; title: string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border px-5 py-4 lg:flex-1 ${accent ? "border-ember bg-ember/10" : "border-white/15"}`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">{tag}</p>
      <p className="mt-1 font-serif text-2xl text-white">{title}</p>
      <p className="mt-0.5 font-mono text-[11px] text-white/55">{sub}</p>
    </div>
  );
}

const Wire = () => <div className="mx-auto h-8 w-px bg-white/25 lg:mx-0 lg:h-px lg:w-6 lg:self-center xl:w-10" />;

// Data-flow diagram on a dark band: encode → retrieve → draft → gate → (accept | escalate).
export function Architecture() {
  return (
    <section id="architecture" className="scroll-mt-0 bg-ink px-4 py-24 text-white sm:px-8 lg:px-[6vw] lg:py-32">
      <motion.div {...fadeUp} className="max-w-3xl">
        <Eyebrow className="text-ember">Architecture</Eyebrow>
        <h2 className="mt-4 font-serif text-5xl leading-[1.02] sm:text-6xl">Two models and a gate between them.</h2>
        <p className="mt-5 max-w-xl leading-relaxed text-white/60">
          A state space model handles scale. A Transformer handles precision. The gate decides, question by question,
          whether the cheap answer is good enough.
        </p>
      </motion.div>

      <motion.div {...fadeUp} className="mt-16 flex flex-col lg:flex-row lg:items-stretch">
        <Node tag="encode" title="Mamba-130M" sub="256-token chunks · linear time" />
        <Wire />
        <Node tag="retrieve" title="Top-3" sub="cosine similarity" />
        <Wire />
        <Node tag="draft" title="Mamba" sub="quick answer + entropy" />
        <Wire />
        <Node tag="gate" title="Orchestrator" sub="H ≤ τH  ∧  R ≥ τR" accent />
        <div className="mx-auto h-8 w-px bg-white/25 lg:hidden" />
        <div className="flex flex-col gap-3 sm:flex-row lg:ml-6 lg:flex-col lg:justify-center">
          <div className="flex-1 rounded-lg border border-white/15 px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">pass → fast path</p>
            <p className="font-serif text-xl">Return Mamba draft</p>
          </div>
          <div className="flex-1 rounded-lg border border-ember px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ember">fail → escalate</p>
            <p className="font-serif text-xl">TinyLlama-1.1B</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

const WORKED = [
  { value: "84%", label: "hit@3", note: "The right passage is in the top three retrieved chunks for 84% of questions." },
  { value: "200K", label: "tokens", note: "Longest document processed end to end on a single T4 GPU." },
];
const DIDNT = [
  { value: "96.8%", label: "escalated", note: "The gate sends almost every question to TinyLlama, so the fast path is rarely used." },
  { value: "2.8×", label: "slower", note: "Because Mamba always drafts first, the hybrid is slower than TinyLlama alone." },
];

function Finding({ value, label, note, muted }: { value: string; label: string; note: string; muted?: boolean }) {
  return (
    <div className="border-t border-ink/15 py-6">
      <p className="flex items-baseline gap-3">
        <span className={`font-serif text-6xl ${muted ? "text-ink/40" : "text-ink"}`}>{value}</span>
        <span className="font-mono text-xs uppercase tracking-widest text-ink/50">{label}</span>
      </p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/60">{note}</p>
    </div>
  );
}

export function Findings() {
  return (
    <section id="findings" className="scroll-mt-8 px-4 py-24 sm:px-8 lg:px-[6vw] lg:py-32">
      <motion.div {...fadeUp} className="max-w-3xl">
        <Eyebrow>Findings</Eyebrow>
        <h2 className="mt-4 font-serif text-5xl leading-[1.02] text-ink sm:text-6xl">
          Retrieval works. <em className="text-ink/45">The gate doesn't, yet.</em>
        </h2>
      </motion.div>
      <div className="mt-14 grid gap-x-16 md:grid-cols-2">
        <motion.div {...fadeUp}>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-crimson">What worked</p>
          {WORKED.map((f) => <Finding key={f.label} {...f} />)}
        </motion.div>
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/50">What didn't</p>
          {DIDNT.map((f) => <Finding key={f.label} {...f} muted />)}
        </motion.div>
      </div>
      <motion.p {...fadeUp} className="mt-10 max-w-2xl border-l-2 border-ember pl-5 leading-relaxed text-ink/70">
        <span className="font-semibold text-ink">Next:</span> run the gate before the draft rather than after it, and
        recalibrate τR, which currently collapses to −∞.
      </motion.p>
    </section>
  );
}

export function Closing() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#5A080D] via-crimson to-[#6E0A10] px-4 py-20 text-white sm:px-8 lg:px-[6vw]">
      <div className="relative z-10 max-w-2xl">
        <h2 className="font-serif text-5xl leading-[1.02] sm:text-7xl">Ask a 200K-token document anything.</h2>
        <Link to="/login" className="mt-10 inline-flex items-center gap-3 rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-crimson transition hover:bg-white">
          Explore the System <ArrowRight className="size-4" />
        </Link>
      </div>
      <img src={mascot} alt="" className="pointer-events-none absolute -bottom-10 right-[-4rem] hidden w-[380px] opacity-90 md:block lg:right-[4vw]" />
    </section>
  );
}

export function Footer() {
  return (
    <footer className="px-4 py-14 sm:px-8 lg:px-[6vw]">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Paper</p>
          <p className="mt-3 font-serif text-2xl leading-snug text-ink">
            A Hybrid State Space–Transformer Architecture for Long-Context Processing up to 200K Tokens
          </p>
          <p className="mt-3 text-sm text-ink/65">Shrinidhi Vittala R · Samiksha Das</p>
          <p className="text-sm text-ink/50">Guided by Dr. Sridevi G M · Dept. of ISE, Jyothy Institute of Technology, Bengaluru</p>
        </div>
        <p className="self-end font-mono text-[11px] text-ink/40">Final Year Project · © {new Date().getFullYear()} T.A.M.O.</p>
      </div>
    </footer>
  );
}
