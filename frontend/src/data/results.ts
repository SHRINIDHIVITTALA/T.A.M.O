// All values copied from the paper, Section V (Tables 1–7).

// Fixed colour per system, used on every chart (validated on the cream surface).
export const SYSTEMS = {
  hybrid: { label: "Hybrid", color: "#D3242B" },
  tRetr: { label: "Transformer + retr.", color: "#2563B8" },
  mRetr: { label: "Mamba-only + retr.", color: "#B7791F" },
  tOnly: { label: "Transformer-only (2K)", color: "#7C3AED" },
} as const;
export type SystemKey = keyof typeof SYSTEMS;

// Table 1 — SQuAD haystacks, 50 test queries per length.
export const ACCURACY = [
  { length: "10K", tOnly: 0.08, mRetr: 0.06, tRetr: 0.4, hybrid: 0.38, hit1: 0.8 },
  { length: "25K", tOnly: 0.06, mRetr: 0.04, tRetr: 0.3, hybrid: 0.3, hit1: 0.78 },
  { length: "50K", tOnly: 0.06, mRetr: 0.06, tRetr: 0.32, hybrid: 0.3, hit1: 0.76 },
  { length: "100K", tOnly: 0.06, mRetr: 0.06, tRetr: 0.28, hybrid: 0.28, hit1: 0.7 },
  { length: "200K", tOnly: 0.02, mRetr: 0.06, tRetr: 0.34, hybrid: 0.34, hit1: 0.68 },
];
export const ACCURACY_ALL = { tOnly: 0.056, mRetr: 0.056, tRetr: 0.328, hybrid: 0.32, hit1: 0.744 };

// Table 2 — routing variants on the 250 test records.
export const ROUTING = [
  { gate: "Always fast", fast: 100, acc: 0.056, fastCorr: "–", escCorr: "0.056", wrongFast: 94.4, wrongEsc: 0 },
  { gate: "Always escalate", fast: 0, acc: 0.328, fastCorr: "–", escCorr: "0.328", wrongFast: 0, wrongEsc: 5.6 },
  { gate: "Entropy only", fast: 3.2, acc: 0.32, fastCorr: "0.000", escCorr: "0.331", wrongFast: 3.2, wrongEsc: 5.6 },
  { gate: "Relevance only", fast: 9.6, acc: 0.32, fastCorr: "0.000", escCorr: "0.354", wrongFast: 9.6, wrongEsc: 5.6 },
  { gate: "Selected", fast: 3.2, acc: 0.32, fastCorr: "0.000", escCorr: "0.331", wrongFast: 3.2, wrongEsc: 5.6 },
  { gate: "Oracle (labels)", fast: 5.6, acc: 0.336, fastCorr: "1.000", escCorr: "0.297", wrongFast: 0, wrongEsc: 0 },
];

// Table 3 — latency, seconds, per-query means.
export const LATENCY = [
  { length: "10K", chunks: 40, encode: 2.61, draft: 1.94, esc: 0.67, hybrid: 3.04, tRetr: 1.13, tOnly: 1.08 },
  { length: "25K", chunks: 99, encode: 6.51, draft: 1.94, esc: 0.65, hybrid: 3.01, tRetr: 1.1, tOnly: 1.08 },
  { length: "50K", chunks: 197, encode: 13.25, draft: 1.98, esc: 0.65, hybrid: 3.05, tRetr: 1.1, tOnly: 1.08 },
  { length: "100K", chunks: 394, encode: 25.75, draft: 1.99, esc: 0.66, hybrid: 3.08, tRetr: 1.1, tOnly: 1.12 },
  { length: "200K", chunks: 787, encode: 51.14, draft: 1.99, esc: 0.66, hybrid: 3.08, tRetr: 1.09, tOnly: 0.91 },
];

// Table 4 — peak GPU memory (MiB, incl. 2,355 MiB weights) and process RAM.
export const MEMORY = [
  { length: "10K", vectors: 0.12, encode: 6401.8, draft: 2641.7, esc: 2706.2, tOnly: 3177.4, rss: 3974.4 },
  { length: "25K", vectors: 0.29, encode: 8817.2, draft: 2642.4, esc: 2705.1, tOnly: 3175.3, rss: 3982.6 },
  { length: "50K", vectors: 0.58, encode: 8817.7, draft: 2644.5, esc: 2715.5, tOnly: 3188.6, rss: 3995.6 },
  { length: "100K", vectors: 1.15, encode: 8818.7, draft: 2650.5, esc: 2714.1, tOnly: 3250.2, rss: 4033.7 },
  { length: "200K", vectors: 2.31, encode: 8819.4, draft: 2651.3, esc: 2730.1, tOnly: 2950.2, rss: 4084.4 },
];

// Table 5 — Needle-in-a-Haystack, 15 queries per length.
export const NIAH = [
  { length: "10K", top3: 0.4, mRetr: 0.067, tRetr: 0.2, hybrid: 0.133, tOnly: 0.4 },
  { length: "25K", top3: 0.2, mRetr: 0, tRetr: 0.2, hybrid: 0.2, tOnly: 0.4 },
  { length: "50K", top3: 0, mRetr: 0, tRetr: 0, hybrid: 0, tOnly: 0.4 },
  { length: "100K", top3: 0, mRetr: 0, tRetr: 0, hybrid: 0, tOnly: 0.4 },
  { length: "200K", top3: 0, mRetr: 0, tRetr: 0, hybrid: 0, tOnly: 0.4 },
];

// Table 6 — LongBench English QA, 20 examples per task (F1 / accuracy).
export const LONGBENCH = [
  { task: "2wikimqa", tokens: 6532, fast: 45, tOnly: [0.097, 0.25], mRetr: [0.124, 0.15], tRetr: [0.093, 0.25], hybrid: [0.082, 0.2] },
  { task: "hotpotqa", tokens: 12649, fast: 30, tOnly: [0.093, 0.2], mRetr: [0.077, 0.1], tRetr: [0.135, 0.3], hybrid: [0.156, 0.25] },
  { task: "multifieldqa_en", tokens: 6877, fast: 20, tOnly: [0.336, 0.2], mRetr: [0.231, 0.05], tRetr: [0.364, 0.2], hybrid: [0.402, 0.1] },
] as const;

// Table 7 — retrieval ablation at 50K tokens.
export const ABLATION = [
  { variant: "Default (mid layer, centred, k=3)", hitk: 0.84, hit1: 0.76, acc: 0.3, fast: 4 },
  { variant: "k = 1", hitk: 0.76, hit1: 0.76, acc: 0.3, fast: 8 },
  { variant: "k = 5", hitk: 0.88, hit1: 0.76, acc: 0.38, fast: 6 },
  { variant: "No mean-centring", hitk: 0.68, hit1: 0.6, acc: 0.24, fast: 4 },
  { variant: "Last layer", hitk: 0.38, hit1: 0.22, acc: 0.16, fast: 2 },
];
