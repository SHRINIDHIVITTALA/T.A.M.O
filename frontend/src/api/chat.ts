// Demo stand-in for the backend. The real version will call the FastAPI service on Render;
// the shapes below are what the UI expects back. Documents and answers here are fictional.

export const TAU_H = 2.2645; // entropy threshold from the paper's calibration (Table 2)

export type ModelKey = "hybrid" | "mamba" | "tinyllama";
export type Route = "fast" | "escalated";

export interface Doc { id: string; title: string; tokens: number; chunks: number; sample: boolean }
export interface Source { chunk: number; score: number; text: string }
export interface Answer { text: string; route: Route; entropy: number; relevance: number; sources: Source[]; model: ModelKey; demo: boolean }

interface Scripted { match: RegExp; question: string; answer: Omit<Answer, "model" | "route" | "demo"> }

const chunksFor = (tokens: number) => Math.ceil(tokens / 256);

export const SAMPLE_DOCS: Doc[] = [
  { id: "audit", title: "Riverside Council: Annual Audit Report 2025", tokens: 196_840, chunks: chunksFor(196_840), sample: true },
  { id: "ghats", title: "Field Notes: Western Ghats Monsoon Survey", tokens: 84_300, chunks: chunksFor(84_300), sample: true },
];

const SCRIPTS: Record<string, Scripted[]> = {
  audit: [
    {
      match: /q3|third quarter|spend/i,
      question: "What did the audit conclude about Q3 spending?",
      answer: {
        text: "The audit found Q3 spending ran 11.4% over budget, driven mainly by emergency drainage repairs after the August floods. It concluded the overrun was justified but criticised the council for approving ₹2.3 crore in contracts without competitive tendering.",
        entropy: 2.91, relevance: 0.81,
        sources: [
          { chunk: 211, score: 0.81, text: "…third-quarter expenditure exceeded the approved budget by 11.4 per cent, the majority attributable to emergency drainage works commissioned following the August flooding…" },
          { chunk: 437, score: 0.77, text: "…contracts totalling ₹2.3 crore were awarded without a competitive tender process. While the urgency is acknowledged, the Committee considers this a material weakness in procurement control…" },
          { chunk: 618, score: 0.72, text: "…on balance, the overrun is assessed as justified in the circumstances, subject to the recommendations set out in Section 9…" },
        ],
      },
    },
    {
      match: /chair|who led|head of/i,
      question: "Who chaired the audit committee?",
      answer: {
        text: "Dr. Meera Iyer chaired the audit committee.",
        entropy: 1.94, relevance: 0.86,
        sources: [
          { chunk: 4, score: 0.86, text: "…the Audit and Governance Committee, chaired by Dr. Meera Iyer, met on eleven occasions during the year…" },
          { chunk: 5, score: 0.71, text: "…membership of the Committee comprised five elected members and two independent advisers…" },
          { chunk: 702, score: 0.64, text: "…signed on behalf of the Committee, Dr. M. Iyer, Chair…" },
        ],
      },
    },
    {
      match: /recommend/i,
      question: "What are the main recommendations?",
      answer: {
        text: "The report makes three main recommendations: introduce a fast-track tender process for emergencies so urgency no longer bypasses competition, publish a quarterly variance report for all capital projects, and appoint an independent internal auditor by March 2026.",
        entropy: 3.12, relevance: 0.79,
        sources: [
          { chunk: 655, score: 0.79, text: "…Recommendation 1: establish an expedited competitive tender procedure for emergency works…" },
          { chunk: 656, score: 0.76, text: "…Recommendation 2: publish quarterly variance reports for every capital project above ₹50 lakh…" },
          { chunk: 659, score: 0.74, text: "…Recommendation 3: appoint an independent Head of Internal Audit no later than 31 March 2026…" },
        ],
      },
    },
  ],
  ghats: [
    {
      match: /rain|rainfall|wettest/i,
      question: "Which site recorded the highest rainfall?",
      answer: {
        text: "Agumbe recorded the highest rainfall of the survey: 1,184 mm in July alone, more than twice the next-wettest site.",
        entropy: 2.48, relevance: 0.83,
        sources: [
          { chunk: 142, score: 0.83, text: "…Agumbe again topped the network with 1,184 mm for July, against 512 mm at Sakleshpur, the next-highest station…" },
          { chunk: 143, score: 0.69, text: "…the July totals confirm the steep west–east gradient across the escarpment…" },
          { chunk: 37, score: 0.61, text: "…stations were sited at Agumbe, Sakleshpur, Kudremukh and Sirsi…" },
        ],
      },
    },
    {
      match: /frog|species|amphibian/i,
      question: "How many frog species were recorded?",
      answer: {
        text: "The team recorded 27 frog species, including two they could not identify and flagged as possibly undescribed.",
        entropy: 2.05, relevance: 0.88,
        sources: [
          { chunk: 268, score: 0.88, text: "…in total, 27 anuran species were recorded across the four sites…" },
          { chunk: 269, score: 0.73, text: "…two Raorchestes specimens could not be assigned to any described species and have been sent for genetic analysis…" },
          { chunk: 271, score: 0.62, text: "…night transects were walked between 19:30 and 22:00 on 41 nights…" },
        ],
      },
    },
  ],
};

export const suggestions = (docId: string) => (SCRIPTS[docId] ?? []).map((s) => s.question);

// Deterministic pseudo-random chunk picks for unscripted questions.
function hashPicks(seed: string, chunks: number): number[] {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const picks = new Set<number>();
  while (picks.size < 3) { h = (h * 1103515245 + 12345) >>> 0; picks.add(h % chunks); }
  return [...picks];
}

function fallback(doc: Doc, question: string): Omit<Answer, "model" | "route" | "demo"> {
  const [a, b, c] = hashPicks(question, doc.chunks);
  return {
    text: `Demo mode only has scripted answers for the suggested questions. With the backend connected, this question would be encoded by Mamba-130M, compared with all ${doc.chunks.toLocaleString()} chunks of “${doc.title}”, and answered from the three closest passages.`,
    entropy: 3.4, relevance: 0.42,
    sources: [a, b, c].map((chunk, i) => ({ chunk, score: +(0.42 - i * 0.05).toFixed(2), text: "Passage text appears here once the document is processed by the backend." })),
  };
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => { clearTimeout(t); reject(new DOMException("Aborted", "AbortError")); });
  });

// Streams pipeline steps through onStep, then resolves with the answer.
export async function ask(doc: Doc, question: string, model: ModelKey, onStep: (s: string) => void, signal?: AbortSignal): Promise<Answer> {
  const script = (SCRIPTS[doc.id] ?? []).find((s) => s.match.test(question));
  const base = script?.answer ?? fallback(doc, question);
  const route: Route = model === "mamba" ? "fast" : model === "tinyllama" ? "escalated" : base.entropy <= TAU_H ? "fast" : "escalated";

  onStep("Encoding the question with Mamba-130M");
  await wait(450, signal);
  onStep(`Retrieving the top 3 of ${doc.chunks.toLocaleString()} chunks`);
  await wait(600, signal);
  if (model !== "tinyllama") {
    onStep(`Mamba draft · entropy ${base.entropy.toFixed(2)}`);
    await wait(650, signal);
  }
  if (model === "hybrid") {
    onStep(route === "fast" ? `Gate: entropy ≤ τH, accepting the draft` : `Gate: entropy > τH, escalating`);
    await wait(350, signal);
  }
  if (route === "escalated") {
    onStep("TinyLlama-1.1B reading 3 passages");
    await wait(900, signal);
  }
  return { ...base, route, model, demo: true };
}

export function makeUploadedDoc(file: File): Doc {
  const tokens = Math.min(200_000, Math.max(256, Math.round(file.size / 4)));
  return { id: `up-${Date.now()}`, title: file.name.replace(/\.[^.]+$/, ""), tokens, chunks: chunksFor(tokens), sample: false };
}
