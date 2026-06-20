import { useMemo } from "react";

// Deterministic seeded PRNG (mulberry32) so SSR + client render the same particles.
function makeRng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function Particles({ count = 40, seed = 1337 }: { count?: number; seed?: number }) {
  const dots = useMemo(() => {
    const rng = makeRng(seed + count);
    const palette = ["var(--electric)", "var(--neon)", "var(--cyan-glow)", "var(--gold)"];
    return Array.from({ length: count }).map(() => {
      const size = 1 + rng() * 3;
      return {
        left: rng() * 100,
        top: rng() * 100,
        size,
        delay: rng() * 8,
        duration: 6 + rng() * 10,
        hue: palette[Math.floor(rng() * palette.length)],
      };
    });
  }, [count, seed]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            background: d.hue,
            boxShadow: `0 0 ${d.size * 6}px ${d.hue}`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}
