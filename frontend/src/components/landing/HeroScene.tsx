import tamo from "@/assets/tamo.webp";

// Pure-CSS scene behind the mascot: sunset sky disc with layered mountains, a moon,
// tilted orbit rings, floating glass panels, and a cloud bank the mascot sits on.
const STAGE_W = 820;
const STAGE_H = 620;

// Glass panels scattered along the orbit ring: [left, top, width, height, rotate, delay].
const PANELS: [number, number, number, number, number, number][] = [
  [110, 120, 54, 70, -24, 0],
  [80, 300, 46, 64, 18, 1.5],
  [640, 150, 60, 80, 14, 0.8],
  [720, 330, 40, 74, -12, 2.4],
  [180, 410, 70, 44, 8, 3.2],
];

export function HeroScene() {
  return (
    <div className="relative mx-auto" style={{ width: STAGE_W, height: STAGE_H }}>
      {/* Back half of the orbit rings (behind the sky disc) */}
      <svg className="pointer-events-none absolute inset-0 z-[1]" width={STAGE_W} height={STAGE_H}>
        <ellipse cx={420} cy={300} rx={390} ry={95} transform="rotate(-14 420 300)" fill="none" stroke="#1A2456" strokeOpacity={0.14} />
        <ellipse cx={430} cy={250} rx={330} ry={120} transform="rotate(-28 430 250)" fill="none" stroke="#1A2456" strokeOpacity={0.08} />
      </svg>

      {/* Sky disc */}
      <div
        className="absolute left-[150px] top-[10px] z-[2] size-[540px] overflow-hidden rounded-full shadow-[0_40px_120px_-40px_rgba(26,36,86,0.45)]"
        style={{ background: "linear-gradient(180deg, #3E4F80 0%, #7383AE 32%, #C7A9B8 56%, #F2C6A8 70%, #F7E6DC 100%)" }}
      >
        {/* Sun glow on the horizon */}
        <div className="absolute left-[18%] top-[52%] size-[180px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#FFE9C7_0%,rgba(255,214,170,0.55)_35%,transparent_70%)]" />
        {/* Mountain ranges, far to near */}
        <div className="absolute inset-x-0 bottom-[26%] h-[40%] bg-[#8E86AE]/70" style={{ clipPath: "polygon(0 70%,12% 45%,22% 60%,35% 20%,46% 50%,58% 30%,70% 55%,82% 15%,92% 40%,100% 30%,100% 100%,0 100%)" }} />
        <div className="absolute inset-x-0 bottom-[18%] h-[34%] bg-[#5E5A86]/85" style={{ clipPath: "polygon(0 60%,10% 35%,20% 55%,30% 10%,40% 45%,52% 25%,62% 50%,75% 5%,86% 45%,100% 25%,100% 100%,0 100%)" }} />
        <div className="absolute inset-x-0 bottom-[10%] h-[26%] bg-[#3B3D63]" style={{ clipPath: "polygon(0 55%,15% 30%,26% 50%,40% 20%,55% 60%,66% 35%,80% 55%,92% 30%,100% 50%,100% 100%,0 100%)" }} />
        {/* Mist over the valleys */}
        <div className="scene-drift absolute -left-10 bottom-[16%] h-16 w-[70%] rounded-full bg-white/60 blur-2xl" />
        <div className="scene-drift absolute -right-10 bottom-[8%] h-20 w-[75%] rounded-full bg-white/70 blur-2xl [animation-delay:-9s]" />
        <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-white/90 to-transparent" />
      </div>

      {/* Moon */}
      <div className="absolute left-[560px] top-[70px] z-[3] size-[64px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#F4F5FA_0%,#C9CEDF_55%,#9AA2BE_100%)] opacity-90 shadow-[0_0_30px_rgba(255,255,255,0.5)]" />

      {/* Floating glass panels */}
      {PANELS.map(([left, top, w, h, rot, delay]) => (
        <div
          key={`${left}-${top}`}
          className="scene-float absolute z-[4] rounded-md border border-white/70 bg-white/30 shadow-[0_8px_30px_-10px_rgba(26,36,86,0.35)] backdrop-blur-sm"
          style={{ left, top, width: w, height: h, rotate: `${rot}deg`, animationDelay: `-${delay}s` }}
        />
      ))}

      {/* Cloud bank the mascot sits on */}
      <div className="absolute bottom-0 left-1/2 z-[6] h-28 w-[640px] -translate-x-1/2">
        <div className="absolute bottom-6 left-10 h-24 w-64 rounded-full bg-white blur-xl" />
        <div className="absolute bottom-4 left-48 h-28 w-80 rounded-full bg-white blur-xl" />
        <div className="absolute bottom-6 right-6 h-20 w-60 rounded-full bg-white blur-xl" />
        <div className="absolute inset-x-0 bottom-0 h-14 rounded-full bg-white/90 blur-lg" />
      </div>

      {/* Mascot (size unchanged) */}
      <img
        src={tamo}
        alt="T.A.M.O. mascot reading a book"
        draggable={false}
        className="tamo-breathe absolute bottom-[34px] left-[50%] z-[7] w-[440px] -translate-x-[40%] select-none"
      />

      {/* Front half of the main orbit ring, crossing in front of the scene */}
      <svg className="pointer-events-none absolute inset-0 z-[8]" width={STAGE_W} height={STAGE_H}>
        <path d="M 42 394 A 390 95 -14 0 0 798 206"fill="none" stroke="#1A2456" strokeOpacity={0.22} />
      </svg>
    </div>
  );
}
