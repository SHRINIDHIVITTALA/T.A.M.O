import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import mascot from "@/assets/hero/mascot.webp";

type Mode = "login" | "signup";

const COPY = {
  login: { title: "Welcome back.", sub: "Log in to ask your documents anything.", cta: "Log in", switchText: "New to T.A.M.O.?", switchLink: "Create an account", switchTo: "/signup" },
  signup: { title: "Create your account.", sub: "Upload long documents and query up to 200K tokens.", cta: "Create account", switchText: "Already have an account?", switchLink: "Log in", switchTo: "/login" },
};

function Field({ label, type = "text", autoComplete, minLength }: { label: string; type?: string; autoComplete: string; minLength?: number }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ink/55">{label}</span>
      <span className="relative mt-2 block">
        <input
          required
          type={isPassword && show ? "text" : type}
          autoComplete={autoComplete}
          minLength={minLength}
          className="w-full border-b border-ink/25 bg-transparent py-2.5 pr-10 text-ink outline-none transition placeholder:text-ink/30 focus:border-crimson"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-0 top-1/2 -translate-y-1/2 text-ink/45 hover:text-ink">
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </span>
    </label>
  );
}

export default function Auth({ mode }: { mode: Mode }) {
  const c = COPY[mode];
  const navigate = useNavigate();

  // UI only for now: any details go straight to the demo. Real Supabase auth comes with the backend.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate("/app");
  };

  return (
    <div className="grid min-h-svh bg-cream lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#5A080D] via-crimson to-[#6E0A10] p-12 text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        <Link to="/" className="font-serif text-3xl">T.A.M.O.</Link>
        <div className="relative z-10 mt-[10svh] max-w-sm">
          <p className="font-serif text-5xl leading-[1.02]">Long documents, <em>short answers.</em></p>
          <p className="mt-5 font-mono text-xs leading-relaxed text-white/60">787 chunks · top-3 retrieval · 1 answer</p>
        </div>
        <img src={mascot} alt="" className="pointer-events-none absolute -bottom-8 -right-10 w-[min(400px,62%)] opacity-95" />
      </aside>

      {/* Form */}
      <main className="flex flex-col px-4 py-8 sm:px-10 lg:px-[7vw]">
        <Link to="/" className="inline-flex items-center gap-2 self-start text-sm text-ink/60 hover:text-ink">
          <ArrowLeft className="size-4" /> Back to home
        </Link>

        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
          className="my-auto w-full max-w-md py-12"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-crimson">{mode === "login" ? "Log in" : "Sign up"}</p>
          <h1 className="mt-3 font-serif text-5xl leading-[1.02] text-ink sm:text-6xl">{c.title}</h1>
          <p className="mt-3 text-ink/60">{c.sub}</p>

          <form onSubmit={onSubmit} className="mt-10 space-y-7">
            {mode === "signup" && <Field label="Full name" autoComplete="name" />}
            <Field label="Email" type="email" autoComplete="email" />
            <Field label="Password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "signup" ? 8 : undefined} />
            {mode === "login" && (
              <div className="-mt-3 text-right">
                <button type="button" className="text-xs text-ink/55 hover:text-crimson">Forgot password?</button>
              </div>
            )}

            <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#6E0A10] to-crimson py-3.5 text-sm font-medium text-white shadow-[0_12px_30px_-10px_rgba(142,18,25,0.7)] transition hover:brightness-110">
              {c.cta} <ArrowRight className="size-4" />
            </button>

          </form>

          <p className="mt-8 text-sm text-ink/60">
            {c.switchText}{" "}
            <Link to={c.switchTo} className="font-medium text-crimson hover:underline">{c.switchLink}</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
