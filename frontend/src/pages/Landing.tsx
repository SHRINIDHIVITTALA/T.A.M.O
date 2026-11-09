import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Infinity as InfinityIcon, Target, Zap } from "lucide-react";
import { HeroScene } from "@/components/landing/HeroScene";
import { Pipeline } from "@/components/landing/Pipeline";
import { Architecture, Closing, Findings, Footer, Problem } from "@/components/landing/Sections";
import leaf0 from "@/assets/hero/leaf0.webp";
import leaf2 from "@/assets/hero/leaf2.webp";
import leaf3 from "@/assets/hero/leaf3.webp";
import leaf5 from "@/assets/hero/leaf5.webp";

const NAV = [
  { label: "Home", id: "top" },
  { label: "Problem", id: "problem" },
  { label: "How it works", id: "how-it-works" },
  { label: "Architecture", id: "architecture" },
  { label: "Findings", id: "findings" },
];

// TODO: real URLs once the accounts / repo exist.
const SOCIALS = [
  { label: "GitHub", href: "#", path: "M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" },
  { label: "X", href: "#", path: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" },
  { label: "Discord", href: "#", path: "M20.32 4.37A19.8 19.8 0 0 0 15.4 2.85a13.7 13.7 0 0 0-.63 1.29 18.4 18.4 0 0 0-5.53 0 13.7 13.7 0 0 0-.64-1.29 19.7 19.7 0 0 0-4.92 1.52C.53 9.05-.32 13.6.1 18.1a19.9 19.9 0 0 0 6.03 3.05c.49-.66.92-1.36 1.29-2.1a12.9 12.9 0 0 1-2.03-.97l.5-.39a14.2 14.2 0 0 0 12.22 0l.5.39c-.65.38-1.33.71-2.04.98.37.73.8 1.43 1.29 2.09a19.8 19.8 0 0 0 6.04-3.05c.5-5.22-.84-9.73-3.58-13.73ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42s.95-2.42 2.16-2.42 2.18 1.09 2.16 2.42c0 1.34-.95 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42s.95-2.42 2.15-2.42 2.18 1.09 2.16 2.42c0 1.34-.94 2.42-2.16 2.42Z" },
];

function StarMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0 13.6 10.4 24 12 13.6 13.6 12 24 10.4 13.6 0 12 10.4 10.4Z" fill="currentColor" />
    </svg>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 text-ink">
      <StarMark className="size-8 text-ink" />
      <span className="font-serif text-3xl">T.A.M.O.</span>
    </Link>
  );
}

// Tracks which section is in the middle of the viewport.
function useActiveSection() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

// Dark rail on the left from lg up: section links with an active dot, socials at the bottom.
function Sidebar() {
  const active = useActiveSection();
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[118px] flex-col justify-between bg-gradient-to-b from-[#1A1010] via-[#120B0B] to-[#2A1A18] py-10 lg:flex">
      <div>
        <div className="mx-auto h-24 w-px bg-gradient-to-b from-transparent to-ember/70" />
        <div className="mx-auto -mt-0.5 size-1.5 rounded-full bg-ember" />
        <nav className="mt-8 flex flex-col gap-5 pl-7" aria-label="Sections">
          {NAV.map(({ label, id }) => (
            <a key={id} href={`#${id}`} className={`relative text-[13px] transition ${active === id ? "text-white" : "text-white/55 hover:text-white"}`}>
              {active === id && <span className="absolute -left-3 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-ember" />}
              {label}
            </a>
          ))}
          <Link to="/results" className="text-[13px] text-ember transition hover:text-white">Results ↗</Link>
        </nav>
      </div>
      <div className="flex flex-col items-center gap-5">
        {SOCIALS.map(({ label, href, path }) => (
          <a key={label} href={href} aria-label={label} className="text-white/60 transition hover:text-white">
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor"><path d={path} /></svg>
          </a>
        ))}
        <StarMark className="mt-2 size-4 text-white/40" />
      </div>
    </aside>
  );
}

// Below lg: simple top bar instead of the sidebar.
function MobileBar() {
  return (
    <header className="relative z-40 flex h-16 items-center justify-between px-4 sm:px-8 lg:hidden">
      <Logo />
      <nav className="hidden gap-6 md:flex">
        {NAV.slice(1).map(({ label, id }) => (
          <a key={id} href={`#${id}`} className="text-sm text-ink/70 hover:text-ink">{label}</a>
        ))}
        <Link to="/results" className="text-sm text-crimson">Results</Link>
      </nav>
    </header>
  );
}

const LEAVES = [
  { src: leaf3, left: "62%", size: 46, duration: 14, delay: 0 },
  { src: leaf0, left: "78%", size: 30, duration: 17, delay: -6 },
  { src: leaf2, left: "45%", size: 26, duration: 19, delay: -11 },
  { src: leaf5, left: "90%", size: 22, duration: 15, delay: -3 },
  { src: leaf0, left: "55%", size: 20, duration: 21, delay: -15 },
  { src: leaf2, left: "70%", size: 34, duration: 16, delay: -9 },
];

function FallingLeaves() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      {LEAVES.map(({ src, left, size, duration, delay }, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="leaf-fall absolute top-0"
          style={{ left, width: size, animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}

const HIGHLIGHTS = [
  { icon: InfinityIcon, title: "Hybrid intelligence", sub: "Mamba + Transformer" },
  { icon: Zap, title: "200K tokens", sub: "Long-context processing" },
  { icon: Target, title: "84% hit@3", sub: "Retrieval accuracy" },
  { icon: BarChart3, title: "28–40% accuracy", sub: "vs 2–8% baseline" },
];

function Hero() {
  return (
    <section id="top" className="relative flex flex-col overflow-hidden lg:block lg:min-h-[max(100svh,640px)]">
      {/* Scene: right side from lg (full height), its own block below */}
      <div className="relative order-2 h-[95vw] max-h-[620px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:max-h-none lg:w-[68%]">
        <HeroScene />
      </div>
      <FallingLeaves />

      <div className="relative z-30 order-1 px-4 sm:px-8 lg:px-[6vw]">
        <div className="hidden pt-[4svh] lg:block"><Logo /></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
          className="max-w-[560px] pt-6 lg:pt-[4svh]"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-crimson/40 px-4 py-1.5 text-sm text-ink/80">
            <span className="size-1.5 rounded-full bg-crimson" /> Hybrid Long-Context AI System
          </span>
          <h1 className="mt-[2.5svh] font-serif leading-[0.95] text-ink">
            <span className="block text-[clamp(4rem,min(7.5vw,13svh),7.5rem)]">T.A.M.O<span className="text-crimson">.</span></span>
            <span className="mt-2 block text-[clamp(2.2rem,min(3.5vw,6svh),3.6rem)] leading-[1.02]">Transformer And Mamba Orchestrator</span>
          </h1>
          <p className="mt-[2svh] font-serif text-[clamp(1.4rem,min(1.8vw,3.2svh),1.8rem)] italic text-ink">
            Unifying the best of <span className="text-crimson">both worlds</span>.
          </p>
          <p className="mt-[1.5svh] max-w-md leading-relaxed text-ink/75">
            Combines a Mamba state space model with a Transformer, retrieving only the relevant passages from
            documents of up to 200K tokens and routing each question to the model it needs.
          </p>
          <Link
            to="/login"
            className="mt-[3.5svh] inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#6E0A10] to-crimson px-7 py-3.5 text-sm font-medium text-white shadow-[0_12px_30px_-10px_rgba(142,18,25,0.7)] transition hover:brightness-110"
          >
            Explore the System <ArrowRight className="size-4" />
          </Link>
        </motion.div>

        <div
          className="mt-10 grid lg:mt-[4svh] grid-cols-1 sm:grid-cols-2 gap-y-5 rounded-2xl border border-white/70 bg-white/55 px-2 py-5 shadow-[0_20px_60px_-30px_rgba(40,10,10,0.35)] backdrop-blur-md md:grid-cols-4 md:divide-x md:divide-ink/10 lg:max-w-[1100px]"
        >
          {HIGHLIGHTS.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 px-4">
              <Icon className="size-8 shrink-0 text-crimson" strokeWidth={1.4} />
              <div>
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="text-xs text-ink/60">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <a href="#problem" className="mt-[3svh] hidden items-center gap-4 pb-[3svh] text-sm text-ink/70 lg:inline-flex">
          Scroll to explore <span className="size-3 rounded-full border border-ink/60" /> <span className="h-px w-20 bg-ink/40" />
        </a>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-clip bg-cream">
      <Sidebar />
      <div className="lg:pl-[118px]">
        <MobileBar />
        <Hero />
        <Problem />
        <Pipeline />
        <Architecture />
        <Findings />
        <Closing />
        <Footer />
      </div>
    </div>
  );
}
