import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import planet from "@/assets/hero/planet.webp";
import spires from "@/assets/hero/spires.webp";
import arc from "@/assets/hero/arc.webp";
import platform from "@/assets/hero/platform.webp";
import mascot from "@/assets/hero/mascot.webp";
import bonsai from "@/assets/hero/bonsai.webp";
import cloud from "@/assets/hero/cloud.webp";

// Scene is laid out on a fixed 960×900 stage, then scaled to fit its container.
// Each layer has a depth: deeper layers move less when the mouse moves (parallax).
const STAGE_W = 960;
const STAGE_H = 900;

type Layer = { src: string; left: number; top: number; width: number; depth: number; className?: string };

const LAYERS: Layer[] = [
  { src: planet, left: 330, top: -60, width: 600, depth: 4 },
  { src: spires, left: 40, top: 230, width: 300, depth: 8 },
  { src: spires, left: 700, top: 70, width: 270, depth: 8, className: "-scale-x-100" },
  { src: arc, left: 0, top: 90, width: 960, depth: 12 },
  { src: platform, left: 110, top: 500, width: 880, depth: 16 },
  { src: mascot, left: 350, top: 195, width: 520, depth: 18, className: "tamo-breathe" },
  { src: bonsai, left: 730, top: 300, width: 320, depth: 22 },
  { src: cloud, left: -120, top: 640, width: 520, depth: 26, className: "scene-drift" },
  { src: cloud, left: 520, top: 700, width: 620, depth: 28, className: "scene-drift [animation-delay:-9s]" },
];

export function HeroScene() {
  const boxRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const reduceMotion = useReducedMotion();

  // Fit the stage to the container (whichever of width/height runs out first).
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setScale(Math.min(width / STAGE_W, height / STAGE_H));
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  // Mouse position → CSS vars in [-1, 1]; layers read them in their transform.
  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: MouseEvent) => {
      stageRef.current?.style.setProperty("--mx", String((e.clientX / window.innerWidth) * 2 - 1));
      stageRef.current?.style.setProperty("--my", String((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion]);

  return (
    <div ref={boxRef} className="pointer-events-none absolute inset-0">
      <div
        ref={stageRef}
        className="absolute right-0 top-0 origin-top-right"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
      >
        {/* Pale halo behind the planet */}
        <div className="absolute left-[150px] top-[-40px] size-[480px] rounded-full bg-[radial-gradient(circle,rgba(120,100,100,0.18)_0%,rgba(120,100,100,0.08)_60%,transparent_72%)]" />
        {LAYERS.map(({ src, left, top, width, depth, className }, i) => (
          <div
            key={i}
            className="absolute transition-transform duration-500 ease-out"
            style={{
              left, top, width,
              transform: `translate(calc(var(--mx, 0) * ${-depth}px), calc(var(--my, 0) * ${-depth * 0.6}px))`,
            }}
          >
            <img src={src} alt={src === mascot ? "T.A.M.O. mascot reading a book" : ""} draggable={false} className={`w-full select-none ${className ?? ""}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
