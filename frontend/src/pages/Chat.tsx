import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, FileText, Menu, PanelLeft, Plus, RotateCcw, SquarePen, Upload, X } from "lucide-react";
import { Attachment01Icon } from "@hugeicons/core-free-icons";
import PromptBar from "@/components/chat/PromptBar";
import VoicePill from "@/components/chat/VoicePill";
import ThoughtLine from "@/components/chat/ThoughtLine";
import { ChunkGrid } from "@/components/landing/Pipeline";
import { SAMPLE_DOCS, TAU_H, ask, makeUploadedDoc, suggestions, type Answer, type Doc } from "@/api/chat";

type AssistantMsg = { id: string; role: "assistant"; question: string; steps: string[]; working: boolean; answer?: Answer; error?: string };
type Message = { id: string; role: "user"; text: string } | AssistantMsg;
interface Chat { id: string; docId: string; messages: Message[]; createdAt: number }

const UPLOAD_STAGES = ["Reading the file", "Splitting into 256-token chunks", "Encoding chunks with Mamba-130M"];

const uid = () => Math.random().toString(36).slice(2, 10);
const fmtTokens = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}K` : String(n));
const newChat = (docId: string): Chat => ({ id: uid(), docId, messages: [], createdAt: Date.now() });
const titleOf = (c: Chat) => {
  const first = c.messages.find((m) => m.role === "user");
  return first && first.role === "user" ? first.text : "New chat";
};

function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0 13.6 10.4 24 12 13.6 13.6 12 24 10.4 13.6 0 12 10.4 10.4Z" fill="currentColor" />
    </svg>
  );
}

function DocChip({ doc, onClear }: { doc: Doc; onClear?: () => void }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-700">
      <FileText className="size-3.5 shrink-0 text-crimson" />
      <span className="truncate">{doc.title}</span>
      <span className="shrink-0 text-neutral-400">{fmtTokens(doc.tokens)} tokens</span>
      {onClear && <button onClick={onClear} aria-label="Change document" className="shrink-0 text-neutral-400 hover:text-neutral-700"><X className="size-3.5" /></button>}
    </span>
  );
}

// Slide-over with the retrieved passages and how the gate decided.
function SourcesDrawer({ doc, answer, onClose }: { doc: Doc; answer: Answer; onClose: () => void }) {
  const fast = answer.route === "fast";
  return (
    <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <motion.aside
        className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white shadow-2xl"
        initial={{ x: 40 }} animate={{ x: 0 }} exit={{ x: 40 }} transition={{ ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-100 px-5">
          <p className="text-sm font-medium text-neutral-900">Sources & routing</p>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"><X className="size-4" /></button>
        </div>
        <div className="flex-1 space-y-8 overflow-y-auto p-5">
          <section>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Retrieved passages</p>
            <div className="mt-3 space-y-3">
              {answer.sources.map((s) => (
                <div key={s.chunk} className="rounded-xl bg-neutral-50 p-4">
                  <p className="flex justify-between text-xs text-neutral-500"><span>Chunk {s.chunk + 1} of {doc.chunks}</span><span>cosine {s.score.toFixed(2)}</span></p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700">{s.text}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Where they sit in the document</p>
            <div className="mt-3"><ChunkGrid step={3} hits={answer.sources.map((s) => s.chunk)} count={doc.chunks} /></div>
          </section>
          <section>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Gate</p>
            <dl className="mt-3 space-y-2 text-sm">
              {answer.model !== "tinyllama" && (
                <div className="flex justify-between"><dt className="text-neutral-500">Draft entropy</dt><dd className="text-neutral-900">{answer.entropy.toFixed(2)} {answer.entropy <= TAU_H ? "≤" : ">"} τH {TAU_H}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-neutral-500">Top relevance</dt><dd className="text-neutral-900">{answer.relevance.toFixed(2)} (τR = −∞)</dd></div>
              <div className="flex justify-between"><dt className="text-neutral-500">Route</dt><dd className={fast ? "text-neutral-900" : "text-crimson"}>{fast ? "Fast path · Mamba" : "Escalated · TinyLlama-1.1B"}</dd></div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-neutral-400">Thresholds from the paper's calibration. In its evaluation, 96.8% of questions were escalated.</p>
          </section>
        </div>
      </motion.aside>
    </motion.div>
  );
}

function AssistantTurn({ m, onSources, onRetry }: { m: AssistantMsg; onSources: () => void; onRetry: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!m.answer) return;
    navigator.clipboard?.writeText(m.answer.text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="group flex gap-4">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-crimson/10"><Mark className="size-3.5 text-crimson" /></span>
      <div className="min-w-0 flex-1">
        <ThoughtLine working={m.working} steps={m.steps} label="Reading the document…" doneLabel="Answered in" fontSize={13} color="#737373" glyphColor="#8E1219" />
        {m.answer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <p className="mt-3 text-[15px] leading-7 text-neutral-900">{m.answer.text}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button onClick={onSources} className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700 transition hover:bg-neutral-200">
                <FileText className="size-3" /> Sources (3)
              </button>
              <button onClick={onSources} className={`rounded-full px-3 py-1 text-xs transition ${m.answer.route === "fast" ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200" : "bg-crimson/10 text-crimson hover:bg-crimson/15"}`}>
                {m.answer.route === "fast" ? "Fast path → Mamba" : "Escalated → TinyLlama"}
              </button>
              <span className="ml-1 flex gap-0.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                <button onClick={copy} aria-label="Copy" className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}</button>
                <button onClick={onRetry} aria-label="Retry" className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"><RotateCcw className="size-3.5" /></button>
              </span>
            </div>
          </motion.div>
        )}
        {m.error && <p className="mt-2 text-sm text-neutral-400">{m.error}</p>}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [docs, setDocs] = useState<Doc[]>(SAMPLE_DOCS);
  const [chats, setChats] = useState<Chat[]>(() => [newChat(SAMPLE_DOCS[0].id)]);
  const [chatId, setChatId] = useState(() => chats[0].id);
  const [busy, setBusy] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [sources, setSources] = useState<Answer | null>(null);
  const [upload, setUpload] = useState<{ name: string; stage: number } | null>(null);
  const [insert, setInsert] = useState<{ id: string; text: string } | null>(null);
  const [notice, setNotice] = useState("");
  const controller = useRef<AbortController | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);
  const heard = useRef("");

  const chat = chats.find((c) => c.id === chatId)!;
  const doc = docs.find((d) => d.id === chat.docId)!;
  const empty = chat.messages.length === 0;

  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }); }, [chat.messages]);
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(""), 3500); return () => clearTimeout(t); }, [notice]);

  const updateChat = (id: string, fn: (c: Chat) => Chat) => setChats((cs) => cs.map((c) => (c.id === id ? fn(c) : c)));
  const patchMsg = (cid: string, mid: string, fn: (m: AssistantMsg) => Partial<AssistantMsg>) =>
    updateChat(cid, (c) => ({ ...c, messages: c.messages.map((m) => (m.id === mid && m.role === "assistant" ? { ...m, ...fn(m) } : m)) }));

  const send = async (text: string) => {
    if (!text || busy) return;
    const cid = chatId;
    const aid = uid();
    updateChat(cid, (c) => ({ ...c, messages: [...c.messages, { id: uid(), role: "user", text }, { id: aid, role: "assistant", question: text, steps: [], working: true }] }));
    setBusy(true);
    controller.current = new AbortController();
    try {
      const answer = await ask(doc, text, "hybrid", (s) => patchMsg(cid, aid, (m) => ({ steps: [...m.steps, s] })), controller.current.signal);
      patchMsg(cid, aid, () => ({ working: false, answer }));
    } catch {
      patchMsg(cid, aid, () => ({ working: false, error: "Stopped." }));
    }
    setBusy(false);
  };

  const startNewChat = () => {
    if (empty) { setDrawer(false); return; }
    const c = newChat(doc.id);
    setChats((cs) => [c, ...cs]);
    setChatId(c.id);
    setDrawer(false);
  };

  const startUpload = (file: File) => {
    const next = makeUploadedDoc(file);
    setUpload({ name: file.name, stage: 0 });
    UPLOAD_STAGES.forEach((_, i) => setTimeout(() => setUpload({ name: file.name, stage: i }), i * 800));
    setTimeout(() => {
      setDocs((d) => [next, ...d]);
      if (empty) updateChat(chatId, (c) => ({ ...c, docId: next.id }));
      else { const c = newChat(next.id); setChats((cs) => [c, ...cs]); setChatId(c.id); }
      setUpload(null);
    }, UPLOAD_STAGES.length * 800);
  };

  // Dictation through the browser's speech recognition, where available.
  const startDictation = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setNotice("Voice input isn't supported in this browser."); return; }
    heard.current = "";
    const r = new SR();
    r.continuous = true;
    r.lang = "en-IN";
    r.onresult = (e: any) => { for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) heard.current += e.results[i][0].transcript; };
    r.onend = () => { if (heard.current.trim()) setInsert({ id: uid(), text: heard.current.trim() }); };
    r.start();
    recognition.current = r;
  };
  const stopDictation = ({ reason }: { reason: string }) => {
    if (reason === "cancel") heard.current = "";
    recognition.current?.stop();
    recognition.current = null;
  };

  const today = new Date().setHours(0, 0, 0, 0);
  const groups = [
    { label: "Today", items: chats.filter((c) => c.createdAt >= today) },
    { label: "Earlier", items: chats.filter((c) => c.createdAt < today) },
  ].filter((g) => g.items.length);

  const sidebar = (
    <div className="flex h-full w-[260px] flex-col bg-[#F7F7F5] px-3 py-3">
      <div className="flex items-center justify-between px-2">
        <Link to="/" className="flex items-center gap-2 text-neutral-900"><Mark className="size-4 text-crimson" /><span className="font-serif text-xl">T.A.M.O.</span></Link>
        <button onClick={() => (drawer ? setDrawer(false) : setCollapsed(true))} aria-label="Close sidebar" className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-200/70"><PanelLeft className="size-4" /></button>
      </div>
      <button onClick={startNewChat} className="mt-4 flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-neutral-800 hover:bg-neutral-200/70"><SquarePen className="size-4" /> New chat</button>
      <button onClick={() => fileInput.current?.click()} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-neutral-800 hover:bg-neutral-200/70"><Upload className="size-4" /> Upload document</button>
      <div className="mt-5 flex-1 overflow-y-auto">
        {groups.map((g) => (
          <div key={g.label} className="mb-4">
            <p className="px-2 pb-1 text-xs text-neutral-400">{g.label}</p>
            {g.items.map((c) => (
              <button key={c.id} onClick={() => { setChatId(c.id); setDrawer(false); }} className={`block w-full truncate rounded-lg px-2 py-2 text-left text-sm transition ${c.id === chatId ? "bg-neutral-200/80 text-neutral-900" : "text-neutral-700 hover:bg-neutral-200/50"}`}>
                {titleOf(c)}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-neutral-200 pt-3">
        <Link to="/results" className="block rounded-lg px-2 py-2 text-sm text-neutral-600 hover:bg-neutral-200/50">Paper results</Link>
        <Link to="/" className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-neutral-800 hover:bg-neutral-200/50">
          <span className="grid size-7 place-items-center rounded-full bg-crimson text-xs font-medium text-white">G</span> Guest
        </Link>
      </div>
    </div>
  );

  const prompt = (
    <div className="w-full">
      {notice && <p className="mb-2 text-center text-xs text-neutral-500">{notice}</p>}
      <PromptBar
        placeholder={`Ask about ${doc.title}`}
        sources={[{ key: "upload", name: "Upload document", description: ".txt, .pdf or .md, up to 200K tokens", icon: Attachment01Icon, attach: true }]}
        commands={[]}
        models={[]}
        efforts={[]}
        busy={busy}
        onSend={send}
        onStop={() => controller.current?.abort()}
        onAttach={() => { fileInput.current?.click(); }}
        insert={insert}
        trailing={<VoicePill reactive="mic" size={28} background="#F5F5F5" accentColor="#8E1219" iconColor="#737373" onStart={startDictation} onStop={stopDictation} />}
        background="#FFFFFF"
        color="#171717"
        menuBackground="#FFFFFF"
        sparkColor="#D3242B"
        width={768}
        radius={24}
        className="rounded-[24px] shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_8px_24px_-12px_rgba(0,0,0,0.15)]"
      />
    </div>
  );

  return (
    <div className="flex h-svh overflow-hidden bg-white">
      <input ref={fileInput} type="file" accept=".txt,.pdf,.md" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) startUpload(f); e.target.value = ""; }} />

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.aside initial={{ width: 0 }} animate={{ width: 260 }} exit={{ width: 0 }} transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }} className="hidden shrink-0 overflow-hidden lg:block">
            {sidebar}
          </motion.aside>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/20" onClick={() => setDrawer(false)} />
            <motion.div className="relative h-full w-[260px] shadow-xl" initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ ease: [0.22, 1, 0.36, 1] }}>{sidebar}</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:px-4">
          <button onClick={() => setDrawer(true)} aria-label="Open sidebar" className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 lg:hidden"><Menu className="size-5" /></button>
          {collapsed && (
            <span className="hidden gap-1 lg:flex">
              <button onClick={() => setCollapsed(false)} aria-label="Open sidebar" className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100"><PanelLeft className="size-4" /></button>
              <button onClick={startNewChat} aria-label="New chat" className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100"><SquarePen className="size-4" /></button>
            </span>
          )}
          <span className="px-1 text-sm font-medium text-neutral-800">T.A.M.O. <span className="font-normal text-neutral-400">Hybrid</span></span>
          <span className="ml-auto rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-500">Demo</span>
        </header>

        {upload ? (
          <div className="grid flex-1 place-items-center px-4">
            <div className="w-full max-w-sm">
              <p className="truncate text-sm font-medium text-neutral-900">{upload.name}</p>
              <p className="mt-1 text-sm text-neutral-500">{UPLOAD_STAGES[upload.stage]}…</p>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-neutral-100">
                <motion.div className="h-full bg-crimson" animate={{ width: `${((upload.stage + 1) / UPLOAD_STAGES.length) * 100}%` }} transition={{ duration: 0.7 }} />
              </div>
            </div>
          </div>
        ) : empty ? (
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-16">
            <motion.div key={chat.id + doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl">
              <h1 className="text-center font-serif text-4xl text-neutral-900 sm:text-5xl">What do you want to know?</h1>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-neutral-400">Asking</span>
                <DocChip doc={doc} />
              </div>
              <div className="mt-3">{prompt}</div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {suggestions(doc.id).map((q) => (
                  <button key={q} onClick={() => send(q)} className="rounded-full border border-neutral-200 px-3.5 py-1.5 text-sm text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900">{q}</button>
                ))}
              </div>
              <div className="mt-10 text-center">
                <p className="text-xs text-neutral-400">Or switch document</p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {docs.filter((d) => d.id !== doc.id).map((d) => (
                    <button key={d.id} onClick={() => updateChat(chatId, (c) => ({ ...c, docId: d.id }))} className="rounded-lg px-2.5 py-1 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800">{d.title}</button>
                  ))}
                  <button onClick={() => fileInput.current?.click()} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-crimson hover:bg-crimson/5"><Plus className="size-3" /> Upload your own</button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            <div ref={scroller} className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-3xl space-y-8 px-4 pb-10 pt-4">
                <div className="flex justify-center"><DocChip doc={doc} /></div>
                {chat.messages.map((m) =>
                  m.role === "user" ? (
                    <div key={m.id} className="flex justify-end">
                      <p className="max-w-[80%] rounded-3xl bg-neutral-100 px-5 py-2.5 text-[15px] leading-7 text-neutral-900">{m.text}</p>
                    </div>
                  ) : (
                    <AssistantTurn key={m.id} m={m} onSources={() => m.answer && setSources(m.answer)} onRetry={() => send(m.question)} />
                  ),
                )}
              </div>
            </div>
            <div className="shrink-0 px-4 pb-3">
              <div className="mx-auto max-w-3xl">{prompt}</div>
              <p className="mt-2 text-center text-[11px] text-neutral-400">Demo answers are scripted. Real answers arrive with the backend.</p>
            </div>
          </>
        )}
      </main>

      <AnimatePresence>{sources && <SourcesDrawer doc={doc} answer={sources} onClose={() => setSources(null)} />}</AnimatePresence>
    </div>
  );
}
