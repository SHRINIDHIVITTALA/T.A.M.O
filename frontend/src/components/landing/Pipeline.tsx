import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

// 200K tokens / 256-token chunks = 787 chunks (paper, Table 3) → 34-wide grid, last row partial.
const COLS = 34;
const CHUNKS = 787;
const CELL = 10;
const GAP = 3;
const TOP3 = [211, 437, 618];

// Deterministic pseudo-random shade per chunk (stands in for an embedding).
const shade = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const STEPS = [
  { title: "Take the whole document", body: "Reports, books or transcripts of up to 200,000 tokens go in as a single input. Nothing is cut off at a context window." },
  { title: "Chunk and encode", body: "The text is split into 787 chunks of 256 tokens. Mamba-130M encodes each one once, in linear time, into a vector." },
  { title: "Retrieve the top 3", body: "The question is encoded the same way and compared to every chunk by cosine similarity. Only the three closest passages move on." },
  { title: "Gate the draft", body: "Mamba drafts an answer. If its entropy is low and the passages are relevant enough, the draft is accepted. Otherwise the question escalates." },
  { title: "Answer", body: "Confident drafts return on the fast Mamba path. Escalated questions are answered by TinyLlama-1.1B, reading only the three passages." },
];

export function ChunkGrid({ step, hits = TOP3, count = CHUNKS, ink = "#0B0F14" }: { step: number; hits?: number[]; count?: number; ink?: string }) {
  const w = COLS * (CELL + GAP) - GAP;
  const h = Math.ceil(count / COLS) * (CELL + GAP) - GAP;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label={`Document split into ${count} chunks`}>
      {Array.from({ length: count }, (_, i) => {
        const hit = hits.includes(i);
        const x = (i % COLS) * (CELL + GAP) - (step === 0 ? GAP / 2 : 0);
        const y = Math.floor(i / COLS) * (CELL + GAP) - (step === 0 ? GAP / 2 : 0);
        let fill = ink;
        let opacity = 0.14;
        if (step >= 2) opacity = 0.12 + shade(i) * 0.5;
        if (step >= 3) opacity = hit ? 1 : 0.07 + shade(i) * 0.12;
        if (step >= 3 && hit) fill = "#D3242B";
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={CELL + (step === 0 ? GAP : 0)}
            height={CELL + (step === 0 ? GAP : 0)}
            rx={step === 0 ? 0 : 2}
            fill={fill}
            style={{ opacity, transition: `opacity .5s ${(i % COLS) * 8}ms, fill .4s` }}
          />
        );
      })}
    </svg>
  );
}

function Meter({ label, value, threshold, pass }: { label: string; value: number; threshold: number; pass: boolean }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[11px] text-ink/60">
        <span>{label}</span>
        <span className={pass ? "text-ink" : "text-ember"}>{pass ? "pass" : "fail"}</span>
      </div>
      <div className="relative mt-1.5 h-2 rounded-full bg-ink/10">
        <motion.div className={`h-full rounded-full ${pass ? "bg-ink" : "bg-ember"}`} initial={{ width: 0 }} animate={{ width: `${value * 100}%` }} transition={{ duration: 0.8 }} />
        <span className="absolute -top-1 h-4 w-px bg-ink" style={{ left: `${threshold * 100}%` }} />
      </div>
    </div>
  );
}

function Readout({ step }: { step: number }) {
  if (step === 0) return <p className="font-mono text-xs text-ink/60">input · 200,000 tokens</p>;
  if (step === 1) return <p className="font-mono text-xs text-ink/60">787 chunks × 256 tokens → Mamba-130M → 787 vectors</p>;
  if (step === 2)
    return (
      <p className="font-mono text-xs text-ink/60">
        q: <span className="text-ink">“What did the audit conclude about Q3 spending?”</span>
        <br />top-3 cosine · #212 0.81 · #438 0.77 · #619 0.72
      </p>
    );
  if (step === 3)
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Meter label="entropy ≤ τH" value={0.72} threshold={0.45} pass={false} />
        <Meter label="relevance ≥ τR" value={0.81} threshold={0.3} pass />
      </div>
    );
  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
      <span className="rounded-full border border-ink/20 px-3 py-1 text-ink/40 line-through">fast path · Mamba</span>
      <span className="rounded-full bg-ember px-3 py-1 text-white">escalated · TinyLlama-1.1B</span>
    </div>
  );
}

export function Pipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length))));

  return (
    <section id="how-it-works" ref={ref} className="relative" style={{ height: `${STEPS.length * 90}svh` }}>
      <div className="sticky top-0 flex min-h-svh flex-col justify-center px-4 py-10 sm:px-8 lg:px-[6vw]">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-crimson">How it works</p>
            <ol className="mt-6 space-y-1">
              {STEPS.map(({ title, body }, i) => (
                <li key={title} className={`border-l-2 py-2 pl-5 transition-colors duration-500 ${i === step ? "border-ember" : "border-ink/10"}`}>
                  <p className={`flex items-baseline gap-3 transition-colors duration-500 ${i === step ? "text-ink" : "text-ink/35"}`}>
                    <span className="font-mono text-xs">0{i + 1}</span>
                    <span className="font-serif text-2xl sm:text-3xl">{title}</span>
                  </p>
                  <div className={`grid transition-all duration-500 ${i === step ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <p className="overflow-hidden pt-1 text-sm leading-relaxed text-ink/65 sm:max-w-md">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <ChunkGrid step={step} />
            <div className="mt-5 min-h-12 border-t border-ink/15 pt-4"><Readout step={step} /></div>
            <p className="mt-3 font-mono text-[10px] text-ink/40">Illustrative values · one cell = one 256-token chunk</p>
          </div>
        </div>
      </div>
    </section>
  );
}
