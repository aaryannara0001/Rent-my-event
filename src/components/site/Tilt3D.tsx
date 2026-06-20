import { useRef, type ReactNode, type CSSProperties } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  max?: number; // max rotation deg
  scale?: number;
  glare?: boolean;
  style?: CSSProperties;
};

export function Tilt3D({ children, className = "", max = 10, scale = 1.02, glare = true, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      el.style.setProperty("--s", `${scale}`);
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--s", "1");
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      className={`tilt-card relative ${className}`}
    >
      <div className="tilt-inner">{children}</div>
      {glare && <div className="tilt-glare pointer-events-none" aria-hidden />}
    </div>
  );
}
