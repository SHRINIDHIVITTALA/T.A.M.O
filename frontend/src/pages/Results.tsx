import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, ComposedChart, LabelList, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  ABLATION, ACCURACY, ACCURACY_ALL, LATENCY, LONGBENCH, MEMORY, NIAH, ROUTING, SYSTEMS, type SystemKey,
} from "@/data/results";

const INK = "#0B0F14";
const AXIS = { stroke: "rgba(11,15,20,0.25)", tick: { fill: "rgba(11,15,20,0.6)", fontSize: 11, fontFamily: "ui-monospace, monospace" }, tickLine: false };
const GRID = <CartesianGrid stroke="rgba(11,15,20,0.08)" vertical={false} />;
const pct = (v: number) => `${Math.round(v * 100)}%`;
const ANIM = { animationDuration: 1100, animationEasing: "ease-out" as const };

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

// Charts mount only once scrolled into view, so Recharts' entry animation plays then.
function ChartFrame({ height = 300, children }: { height?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} style={{ height }} className="w-full">
      {inView && <ResponsiveContainer width="100%" height="100%">{children as React.ReactElement}</ResponsiveContainer>}
    </div>
  );
}

type Fmt = (v: number) => string;
type TipProps = { active?: boolean; label?: unknown; fmt?: Fmt; payload?: readonly { dataKey?: unknown; name?: unknown; value?: unknown; color?: string }[] };
function Tip({ active, payload, label, fmt = (v) => String(v) }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-ink/10 bg-white px-3 py-2 shadow-lg">
      <p className="font-mono text-[11px] text-ink/50">{String(label)}</p>
      {payload.map((p) => (
        <p key={String(p.dataKey)} className="mt-1 flex items-center gap-2 text-xs text-ink">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          {String(p.name)} <span className="ml-auto pl-4 font-mono">{fmt(Number(p.value))}</span>
        </p>
      ))}
    </div>
  );
}
const tooltip = (fmt?: Fmt) => <Tooltip cursor={{ fill: "rgba(11,15,20,0.04)", stroke: "rgba(11,15,20,0.2)" }} content={(p) => <Tip {...p} fmt={fmt} />} />;

function Legend({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) {
  return (
    <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2">
      {items.map(({ label, color, dashed }) => (
        <span key={label} className="flex items-center gap-2 text-xs text-ink/70">
          <span className="h-0.5 w-4" style={{ background: dashed ? `repeating-linear-gradient(90deg,${color} 0 3px,transparent 3px 6px)` : color, height: dashed ? 2 : 8, borderRadius: 2 }} />
          {label}
        </span>
      ))}
    </div>
  );
}
const sys = (keys: SystemKey[]) => keys.map((k) => SYSTEMS[k]);

function DataTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6">
      <button onClick={() => setOpen(!open)} className="font-mono text-xs text-crimson underline-offset-4 hover:underline">
        {open ? "Hide table" : "Show table"}
      </button>
      {open && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/20">{head.map((h) => <th key={h} className="py-2 pr-4 font-mono text-[11px] font-normal uppercase tracking-wider text-ink/50">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-ink/10">{r.map((c, j) => <td key={j} className={`py-2 pr-4 ${j ? "font-mono text-xs" : ""} text-ink/80`}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Block({ id, n, eyebrow, title, takeaway, children }: { id: string; n: string; eyebrow: string; title: string; takeaway: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-ink/15 py-20 lg:py-24">
      <motion.div {...fadeUp} className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-crimson">{n} · {eyebrow}</p>
          <h2 className="mt-3 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl">{title}</h2>
          <div className="mt-5 space-y-3 leading-relaxed text-ink/65">{takeaway}</div>
        </div>
        <div className="min-w-0">{children}</div>
      </motion.div>
    </section>
  );
}

const SetupItem = ({ k, v }: { k: string; v: string }) => (
  <div><p className="font-mono text-[11px] uppercase tracking-widest text-ink/45">{k}</p><p className="mt-1 text-sm text-ink">{v}</p></div>
);

const NAV = [
  ["accuracy", "Accuracy"], ["routing", "Routing"], ["latency", "Latency"], ["memory", "Memory"],
  ["niah", "Needle"], ["longbench", "LongBench"], ["ablation", "Ablation"],
] as const;

export default function Results() {
  const [lbMetric, setLbMetric] = useState<0 | 1>(0);
  const lbData = LONGBENCH.map((t) => ({ task: t.task, tOnly: t.tOnly[lbMetric], mRetr: t.mRetr[lbMetric], tRetr: t.tRetr[lbMetric], hybrid: t.hybrid[lbMetric] }));

  return (
    <div className="min-h-screen overflow-x-clip bg-cream">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/85 backdrop-blur">
        <div className="flex h-14 items-center gap-6 px-4 sm:px-8 lg:px-[6vw]">
          <Link to="/" className="flex shrink-0 items-center gap-2 text-sm text-ink/70 hover:text-ink">
            <ArrowLeft className="size-4" /> <span className="font-serif text-xl text-ink">T.A.M.O.</span>
          </Link>
          <nav className="ml-auto hidden gap-5 md:flex">
            {NAV.map(([id, label]) => <a key={id} href={`#${id}`} className="text-[13px] text-ink/60 hover:text-ink">{label}</a>)}
          </nav>
        </div>
      </header>

      <main className="px-4 sm:px-8 lg:px-[6vw]">
        <motion.div {...fadeUp} className="pb-16 pt-16 lg:pt-24">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-crimson">Evaluation · Section V of the paper</p>
          <h1 className="mt-4 max-w-4xl font-serif text-6xl leading-[0.98] text-ink sm:text-7xl">
            Results, <em className="text-crimson">in full.</em>
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-ink/65">
            Every number from the paper's evaluation: SQuAD haystacks from 10K to 200K tokens, routing, latency, memory,
            Needle-in-a-Haystack, LongBench and a retrieval ablation. Gates were calibrated on development data, frozen,
            then measured on test data.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-ink/15 pt-6 md:grid-cols-4">
            <SetupItem k="Hardware" v="1× NVIDIA Tesla T4" />
            <SetupItem k="Models" v="Mamba-130M · TinyLlama-1.1B" />
            <SetupItem k="Main test set" v="SQuAD haystacks · 50 queries / length" />
            <SetupItem k="Lengths" v="10K · 25K · 50K · 100K · 200K" />
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              ["32.8%", "Transformer + retrieval, overall accuracy"],
              ["32.0%", "Hybrid, overall accuracy"],
              ["5.6%", "Transformer-only (2K window)"],
              ["74.4%", "Retrieval hit@1, overall"],
            ].map(([v, l], i) => (
              <div key={l}>
                <p className={`font-serif text-5xl sm:text-6xl ${i === 1 ? "text-crimson" : "text-ink"}`}>{v}</p>
                <p className="mt-1 text-sm text-ink/55">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <Block id="accuracy" n="01" eyebrow="SQuAD · Table 1" title="Retrieval, not routing, sets accuracy."
          takeaway={<>
            <p>With retrieval, TinyLlama answered 28–40% of questions at every length. Limited to its own 2K window, it managed 2–8%.</p>
            <p>Rank-1 hit rate slips from 0.80 to 0.68 as the haystack grows, but end-to-end accuracy shows no clear downward trend (95% intervals ≈ ±0.13).</p>
          </>}>
          <Legend items={sys(["hybrid", "tRetr", "mRetr", "tOnly"])} />
          <ChartFrame>
            <LineChart data={ACCURACY} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              {GRID}
              <XAxis dataKey="length" {...AXIS} />
              <YAxis {...AXIS} ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5]} domain={[0, 0.5]} tickFormatter={pct} axisLine={false} />
              {tooltip(pct)}
              {(["tOnly", "mRetr", "tRetr", "hybrid"] as const).map((k) => (
                <Line key={k} dataKey={k} name={SYSTEMS[k].label} stroke={SYSTEMS[k].color} strokeWidth={2}
                  strokeDasharray={k === "tRetr" ? "5 4" : undefined}
                  dot={{ r: 4, fill: SYSTEMS[k].color, stroke: "#F6EEE7", strokeWidth: 2 }} activeDot={{ r: 6 }} {...ANIM} />
              ))}
            </LineChart>
          </ChartFrame>
          <DataTable head={["Length", "Transf.-only", "Mamba + retr.", "Transf. + retr.", "Hybrid", "Hit@1"]}
            rows={[...ACCURACY.map((r) => [r.length, r.tOnly, r.mRetr, r.tRetr, r.hybrid, r.hit1]),
              ["All (250)", ACCURACY_ALL.tOnly, ACCURACY_ALL.mRetr, ACCURACY_ALL.tRetr, ACCURACY_ALL.hybrid, ACCURACY_ALL.hit1]]} />
        </Block>

        <Block id="routing" n="02" eyebrow="Gate · Table 2" title="The gate rarely trusts Mamba — and shouldn't."
          takeaway={<>
            <p>The calibrated gate kept 8 of 250 queries (3.2%) on the fast path. All 8 drafts were wrong, and it escalated all 14 that Mamba got right.</p>
            <p>Because τR = −∞, the selected gate is the entropy-only gate. Even an oracle reaches only 0.336, because Mamba-130M is right just 5.6% of the time.</p>
          </>}>
          <Legend items={[{ label: "Overall accuracy", color: "rgba(11,15,20,0.35)" }, { label: "Selected gate", color: SYSTEMS.hybrid.color }]} />
          <ChartFrame height={320}>
            <BarChart data={ROUTING} layout="vertical" margin={{ top: 0, right: 90, left: 10, bottom: 0 }} barCategoryGap={8}>
              <CartesianGrid stroke="rgba(11,15,20,0.08)" horizontal={false} />
              <XAxis type="number" {...AXIS} domain={[0, 0.4]} tickFormatter={pct} />
              <YAxis type="category" dataKey="gate" {...AXIS} width={110} axisLine={false} />
              {tooltip((v) => (v <= 1 ? pct(v) : `${v}%`))}
              <Bar dataKey="acc" name="Accuracy" radius={[0, 4, 4, 0]} {...ANIM}>
                {ROUTING.map((r) => <Cell key={r.gate} fill={r.gate === "Selected" ? SYSTEMS.hybrid.color : "rgba(11,15,20,0.35)"} />)}
                <LabelList dataKey="fast" position="right" formatter={(v) => `${v}% fast`} style={{ fill: "rgba(11,15,20,0.55)", fontSize: 11, fontFamily: "ui-monospace, monospace" }} />
              </Bar>
            </BarChart>
          </ChartFrame>
          <p className="font-mono text-[11px] text-ink/45">Selected: τH = 2.2645, τR = −∞ · Relevance only: τR = 0.5158</p>
          <DataTable head={["Gate", "Fast %", "Accuracy", "Fast-path corr.", "Escal. corr.", "Wrong fast %", "Wrong escal. %"]}
            rows={ROUTING.map((r) => [r.gate, r.fast, r.acc, r.fastCorr, r.escCorr, r.wrongFast, r.wrongEsc])} />
        </Block>

        <Block id="latency" n="03" eyebrow="Speed · Table 3" title="The hybrid is 2.8× slower, not faster."
          takeaway={<>
            <p>Mean per-query time was 3.01–3.08 s, against 1.09–1.13 s for always escalating. The Mamba draft alone takes ~1.95 s because optimised kernels weren't installed and it runs for every query before the gate decides.</p>
            <p>Encoding the haystack grows close to linearly: 19.6× longer for 20× the tokens.</p>
          </>}>
          <Legend items={sys(["hybrid", "tRetr", "tOnly"])} />
          <ChartFrame height={260}>
            <BarChart data={LATENCY} margin={{ top: 10, right: 8, left: -10, bottom: 0 }} barGap={2}>
              {GRID}
              <XAxis dataKey="length" {...AXIS} />
              <YAxis {...AXIS} axisLine={false} tickFormatter={(v) => `${v}s`} />
              {tooltip((v) => `${v.toFixed(2)} s`)}
              {(["hybrid", "tRetr", "tOnly"] as const).map((k) => (
                <Bar key={k} dataKey={k} name={SYSTEMS[k].label} fill={SYSTEMS[k].color} radius={[4, 4, 0, 0]} {...ANIM} />
              ))}
            </BarChart>
          </ChartFrame>
          <p className="mb-2 mt-10 text-sm font-medium text-ink">Encoding time from scratch (s)</p>
          <ChartFrame height={200}>
            <LineChart data={LATENCY} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              {GRID}
              <XAxis dataKey="length" {...AXIS} />
              <YAxis {...AXIS} axisLine={false} />
              {tooltip((v) => `${v.toFixed(2)} s`)}
              <Line dataKey="encode" name="Encode" stroke={INK} strokeWidth={2} dot={{ r: 4, fill: INK, stroke: "#F6EEE7", strokeWidth: 2 }} {...ANIM}>
                <LabelList dataKey="encode" position="top" offset={10} formatter={(v) => `${v}s`} style={{ fill: "rgba(11,15,20,0.6)", fontSize: 11, fontFamily: "ui-monospace, monospace" }} />
              </Line>
            </LineChart>
          </ChartFrame>
          <DataTable head={["Length", "Chunks", "Encode", "Mamba draft", "TinyLlama esc.", "Hybrid", "Transf. + retr.", "Transf.-only"]}
            rows={LATENCY.map((r) => [r.length, r.chunks, r.encode, r.draft, r.esc, r.hybrid, r.tRetr, r.tOnly])} />
        </Block>

        <Block id="memory" n="04" eyebrow="Memory · Table 4" title="Query memory stays flat from 10K to 200K."
          takeaway={<>
            <p>Peaks for the Mamba draft (2.64–2.65 GB) and escalation (2.71–2.73 GB) moved by less than 30 MiB across a 20× longer context. The cached chunk vectors grew from 0.12 to just 2.31 MiB.</p>
            <p>The largest peak, ~8.8 GB, happens once, while encoding; the batch is capped at 16,384 tokens.</p>
          </>}>
          <Legend items={[{ label: "Mamba draft", color: SYSTEMS.mRetr.color }, { label: "TinyLlama escalation", color: SYSTEMS.tRetr.color }, { label: "Transformer-only", color: SYSTEMS.tOnly.color }]} />
          <ChartFrame>
            <LineChart data={MEMORY} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              {GRID}
              <XAxis dataKey="length" {...AXIS} />
              <YAxis {...AXIS} domain={[0, 4096]} ticks={[0, 1024, 2048, 3072, 4096]} axisLine={false} tickFormatter={(v) => `${v / 1024} GB`} />
              {tooltip((v) => `${v.toFixed(1)} MiB`)}
              <ReferenceLine y={2355} stroke="rgba(11,15,20,0.35)" strokeDasharray="4 4" label={{ value: "weights 2,355 MiB", position: "insideBottomRight", fill: "rgba(11,15,20,0.5)", fontSize: 10 }} />
              <Line dataKey="draft" name="Mamba draft" stroke={SYSTEMS.mRetr.color} strokeWidth={2} dot={{ r: 4, fill: SYSTEMS.mRetr.color, stroke: "#F6EEE7", strokeWidth: 2 }} {...ANIM} />
              <Line dataKey="esc" name="TinyLlama esc." stroke={SYSTEMS.tRetr.color} strokeWidth={2} dot={{ r: 4, fill: SYSTEMS.tRetr.color, stroke: "#F6EEE7", strokeWidth: 2 }} {...ANIM} />
              <Line dataKey="tOnly" name="Transformer-only" stroke={SYSTEMS.tOnly.color} strokeWidth={2} dot={{ r: 4, fill: SYSTEMS.tOnly.color, stroke: "#F6EEE7", strokeWidth: 2 }} {...ANIM} />
            </LineChart>
          </ChartFrame>
          <DataTable head={["Length", "Chunk vectors", "Encode", "Mamba draft", "TinyLlama esc.", "Transf.-only", "CPU RSS"]}
            rows={MEMORY.map((r) => [r.length, r.vectors, r.encode, r.draft, r.esc, r.tOnly, r.rss])} />
        </Block>

        <Block id="niah" n="05" eyebrow="Needle-in-a-Haystack · Table 5" title="One sentence is too small to find."
          takeaway={<>
            <p>The needle chunk was in the top three for 40% of queries at 10K, 20% at 25K and never beyond, so the hybrid scored 0 from 50K up.</p>
            <p>One inserted sentence barely moves the mean-pooled vector of a 256-token chunk. Transformer-only holds a constant 0.40 because the needle sits inside its kept first and last chunks at depths 0 and 1.</p>
          </>}>
          <Legend items={[...sys(["hybrid", "tOnly"]), { label: "Needle in top-3", color: INK, dashed: true }]} />
          <ChartFrame height={280}>
            <ComposedChart data={NIAH} margin={{ top: 10, right: 16, left: -10, bottom: 0 }} barGap={2}>
              {GRID}
              <XAxis dataKey="length" {...AXIS} />
              <YAxis {...AXIS} ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5]} domain={[0, 0.5]} tickFormatter={pct} axisLine={false} />
              {tooltip(pct)}
              <Bar dataKey="hybrid" name="Hybrid" fill={SYSTEMS.hybrid.color} radius={[4, 4, 0, 0]} {...ANIM} />
              <Bar dataKey="tOnly" name="Transformer-only (2K)" fill={SYSTEMS.tOnly.color} radius={[4, 4, 0, 0]} {...ANIM} />
              <Line dataKey="top3" name="Needle in top-3" stroke={INK} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 4, fill: INK, stroke: "#F6EEE7", strokeWidth: 2 }} {...ANIM} />
            </ComposedChart>
          </ChartFrame>
          <p className="font-mono text-[11px] text-ink/45">15 queries per length: 5 depths × 3 needles</p>
          <DataTable head={["Length", "Needle top-3", "Mamba + retr.", "Transf. + retr.", "Hybrid", "Transf.-only"]}
            rows={NIAH.map((r) => [r.length, r.top3, r.mRetr, r.tRetr, r.hybrid, r.tOnly])} />
        </Block>

        <Block id="longbench" n="06" eyebrow="LongBench · Table 6" title="Mixed results under domain shift."
          takeaway={<>
            <p>Contexts here are short (6.5K–12.6K tokens), so this tests transfer rather than scale. The SQuAD-calibrated gate kept 20–45% of queries on the fast path.</p>
            <p>The hybrid had the best F1 on hotpotqa and multifieldqa_en but the worst on 2wikimqa. With 20 examples per task, these differences are not reliable.</p>
          </>}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Legend items={sys(["hybrid", "tRetr", "mRetr", "tOnly"])} />
            <div className="flex rounded-full border border-ink/15 p-0.5 font-mono text-xs">
              {(["F1", "Accuracy"] as const).map((m, i) => (
                <button key={m} onClick={() => setLbMetric(i as 0 | 1)} className={`rounded-full px-3 py-1 transition ${lbMetric === i ? "bg-ink text-white" : "text-ink/60"}`}>{m}</button>
              ))}
            </div>
          </div>
          <ChartFrame>
            <BarChart data={lbData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }} barGap={2}>
              {GRID}
              <XAxis dataKey="task" {...AXIS} />
              <YAxis {...AXIS} ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5]} domain={[0, 0.5]} axisLine={false} tickFormatter={(v) => v.toFixed(1)} />
              {tooltip((v) => v.toFixed(3))}
              {(["hybrid", "tRetr", "mRetr", "tOnly"] as const).map((k) => (
                <Bar key={k} dataKey={k} name={SYSTEMS[k].label} fill={SYSTEMS[k].color} radius={[4, 4, 0, 0]} {...ANIM} />
              ))}
            </BarChart>
          </ChartFrame>
          <DataTable head={["Task", "Mean tokens", "Fast %", "Transf.-only", "Mamba + retr.", "Transf. + retr.", "Hybrid"]}
            rows={LONGBENCH.map((t) => [t.task, t.tokens, t.fast, ...[t.tOnly, t.mRetr, t.tRetr, t.hybrid].map(([f, a]) => `${f} / ${a}`)])} />
        </Block>

        <Block id="ablation" n="07" eyebrow="Ablation at 50K · Table 7" title="The middle layer is what makes retrieval work."
          takeaway={<>
            <p>Last-layer vectors put the evidence in the top three for only 38% of queries, against 84% for the middle layer, and hybrid accuracy fell from 0.30 to 0.16.</p>
            <p>Dropping mean-centring cut hit@3 to 0.68. Widening to five chunks raised it to 0.88, with hybrid accuracy 0.38.</p>
          </>}>
          <Legend items={[{ label: "Hit@k", color: INK }, { label: "Hybrid accuracy", color: SYSTEMS.hybrid.color }]} />
          <ChartFrame height={340}>
            <BarChart data={ABLATION} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }} barGap={2} barCategoryGap={14}>
              <CartesianGrid stroke="rgba(11,15,20,0.08)" horizontal={false} />
              <XAxis type="number" {...AXIS} domain={[0, 1]} tickFormatter={pct} />
              <YAxis type="category" dataKey="variant" {...AXIS} width={130} axisLine={false} />
              {tooltip(pct)}
              <Bar dataKey="hitk" name="Hit@k" fill={INK} radius={[0, 4, 4, 0]} {...ANIM}>
                <LabelList dataKey="hitk" position="right" formatter={(v) => pct(Number(v))} style={{ fill: "rgba(11,15,20,0.6)", fontSize: 11, fontFamily: "ui-monospace, monospace" }} />
              </Bar>
              <Bar dataKey="acc" name="Hybrid accuracy" fill={SYSTEMS.hybrid.color} radius={[0, 4, 4, 0]} {...ANIM} />
            </BarChart>
          </ChartFrame>
          <DataTable head={["Variant", "Hit@k", "Hit@1", "Hybrid acc.", "Fast %"]}
            rows={ABLATION.map((r) => [r.variant, r.hitk, r.hit1, r.acc, r.fast])} />
        </Block>

        <section className="border-t border-ink/15 py-20 lg:py-24">
          <motion.div {...fadeUp} className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-crimson">Discussion</p>
              <h2 className="mt-3 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl">A useful encoder, a weak answerer.</h2>
            </div>
            <ul className="space-y-4 leading-relaxed text-ink/70">
              <li className="border-l-2 border-ember pl-4">As a retrieval encoder, Mamba-130M let a 2,048-token Transformer answer questions about 200K-token documents about as well as 10K-token ones, at near-constant query memory.</li>
              <li className="border-l-2 border-ink/20 pl-4">As a cheap answerer it was too weak for routing to matter: entropy did not separate good drafts from bad ones.</li>
              <li className="border-l-2 border-ink/20 pl-4">Mean-pooled chunk vectors capture paragraph topics, not a single inserted sentence (NIAH).</li>
              <li className="border-l-2 border-ink/20 pl-4">Thresholds calibrated on SQuAD did not transfer to LongBench. Larger test sets and multiple runs are needed.</li>
            </ul>
          </motion.div>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 px-4 py-10 sm:px-8 lg:px-[6vw]">
        <p className="font-mono text-[11px] text-ink/45">Source: Section V, “A Hybrid State Space–Transformer Architecture for Long-Context Processing up to 200K Tokens”</p>
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-crimson hover:underline">Explore the System <ArrowRight className="size-4" /></Link>
      </footer>
    </div>
  );
}
