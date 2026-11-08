import { useEffect, useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";
import { Activity, FileText, LayoutGrid, Search, Workflow, type LucideIcon } from "lucide-react";
import tamo from "@/assets/tamo.webp";

// Stage geometry (px). The orbit is a flat ellipse seen slightly from above:
// cards at the back (top of the ellipse) pass behind the mascot, cards at the front pass over it.
const STAGE_W = 820;
const STAGE_H = 560;
const CX = STAGE_W / 2;
const CY = 250; // orbit centre — around the mascot's shoulders
const RX = 330;
const RY = 70;
const SPEED = 0.00016; // radians per ms → one lap ≈ 39 s

type OrbitCard = { title: string; sub: string; icon: LucideIcon };

const CARDS: OrbitCard[] = [
  { title: "Mamba", sub: "Linear-time encoder", icon: Activity },
  { title: "Transformer", sub: "Precise reasoning", icon: LayoutGrid },
  { title: "Orchestrator", sub: "Routes every query", icon: Workflow },
  { title: "Retrieval", sub: "Top-3 relevant chunks", icon: Search },
  { title: "200K tokens", sub: "Whole documents", icon: FileText },
];

// Half of the orbit ellipse: sweep 1 = back (upper) half, 0 = front (lower) half.
const arc = (ry: number, sweep: 0 | 1) => `M ${CX - RX} ${CY} A ${RX} ${ry} 0 0 ${sweep} ${CX + RX} ${CY}`;

export function OrbitStage() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const angle = useRef(0);
  const speed = useRef(1);
  const targetSpeed = useRef(1);
  const reduceMotion = useReducedMotion();
  // Mouse tilt: pointer position normalised to [-1, 1], eased toward each frame.
  const tilt = useRef({ x: 0, y: 0 });
  const targetTilt = useRef({ x: 0, y: 0 });
  const backArcRef = useRef<SVGPathElement>(null);
  const frontArcRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: MouseEvent) => {
      targetTilt.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion]);

  useAnimationFrame((_, delta) => {
    // Ease toward the target speed so hovering slows the orbit smoothly instead of snapping.
    speed.current += (targetSpeed.current - speed.current) * 0.04;
    if (!reduceMotion) angle.current += Math.min(delta, 50) * SPEED * speed.current;

    tilt.current.x += (targetTilt.current.x - tilt.current.x) * 0.06;
    tilt.current.y += (targetTilt.current.y - tilt.current.y) * 0.06;
    // Pointer low → we look down on the orbit (fuller ellipse); pointer high → flatter. Pointer left/right rolls it.
    const ry = RY * (1 + tilt.current.y * 0.45);
    const roll = tilt.current.x * 6; // degrees
    const rollRad = (roll * Math.PI) / 180;
    const arcTransform = `rotate(${roll} ${CX} ${CY})`;
    backArcRef.current?.setAttribute("d", arc(ry, 1));
    backArcRef.current?.setAttribute("transform", arcTransform);
    frontArcRef.current?.setAttribute("d", arc(ry, 0));
    frontArcRef.current?.setAttribute("transform", arcTransform);

    CARDS.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const theta = angle.current + (i * 2 * Math.PI) / CARDS.length;
      const sin = Math.sin(theta);
      const cos = Math.cos(theta); // cos > 0 → front half
      const depth = (cos + 1) / 2; // 0 = farthest, 1 = nearest

      // Point on the ellipse, rolled, plus a depth-based parallax shift (near cards move more).
      const ex = sin * RX;
      const ey = cos * ry;
      const x = ex * Math.cos(rollRad) - ey * Math.sin(rollRad) + tilt.current.x * 18 * cos;
      const y = ex * Math.sin(rollRad) + ey * Math.cos(rollRad);

      el.style.transform =
        `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) ` +
        `rotateY(${sin * 38}deg) scale(${0.68 + 0.32 * depth})`;
      el.style.zIndex = cos > 0 ? "30" : "5";
      el.style.opacity = String(0.45 + 0.55 * depth);
      el.style.filter = depth < 0.5 ? `blur(${(0.5 - depth) * 5}px)` : "none";
    });
  });

  return (
    <div
      className="relative mx-auto"
      style={{ width: STAGE_W, height: STAGE_H, perspective: 1400 }}
      onMouseEnter={() => (targetSpeed.current = 0.25)}
      onMouseLeave={() => (targetSpeed.current = 1)}
    >
      {/* Orbit path: back half behind the mascot, front half in front of it */}
      <svg className="pointer-events-none absolute inset-0 z-[4]" width={STAGE_W} height={STAGE_H}>
        <path ref={backArcRef} d={arc(RY, 1)} fill="none" stroke="currentColor" strokeOpacity={0.12} className="text-ink" />
      </svg>
      <svg className="pointer-events-none absolute inset-0 z-[25]" width={STAGE_W} height={STAGE_H}>
        <path ref={frontArcRef} d={arc(RY, 0)} fill="none" stroke="currentColor" strokeOpacity={0.22} className="text-ink" />
      </svg>

      {/* Soft cyan glow + floor shadow */}
      <div className="absolute left-1/2 top-[38%] z-[1] size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/15 blur-3xl" />
      <div className="absolute bottom-3 left-1/2 z-[1] h-8 w-[380px] -translate-x-1/2 rounded-[100%] bg-ink/20 blur-xl" />

      <img
        src={tamo}
        alt="T.A.M.O. mascot reading a book"
        draggable={false}
        className="tamo-breathe absolute bottom-0 left-1/2 z-10 w-[440px] -translate-x-1/2 select-none"
      />

      {CARDS.map(({ title, sub, icon: Icon }, i) => (
        <div
          key={title}
          ref={(el) => (cardRefs.current[i] = el)}
          className="absolute w-[190px] rounded-2xl border border-white/80 bg-white/55 p-3.5 shadow-[0_10px_40px_-12px_rgba(11,15,20,0.35)] backdrop-blur-md will-change-transform"
          style={{ left: CX, top: CY }}
        >
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-ink text-cyan">
              <Icon className="size-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-ink">{title}</span>
          </div>
          <p className="mt-2 text-xs text-ink/55">{sub}</p>
          <div className="mt-2.5 space-y-1.5">
            <div className="h-1 w-full rounded-full bg-ink/10" />
            <div className="h-1 w-2/3 rounded-full bg-ink/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
