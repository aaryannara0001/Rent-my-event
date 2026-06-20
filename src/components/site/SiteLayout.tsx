import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="relative min-h-screen">
      <div
        className="fixed top-0 left-0 right-0 h-0.5 z-[60] origin-left"
        style={{
          background: "linear-gradient(90deg, var(--electric), var(--neon), var(--cyan-glow))",
          transform: `scaleX(${progress / 100})`,
          transition: "transform .1s linear",
        }}
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 size-14 grid place-items-center rounded-full bg-gradient-to-br from-[var(--electric)] via-[var(--neon)] to-[var(--orange-glow)] shadow-[0_0_40px_-5px_var(--neon)] hover:scale-110 transition-transform animate-float"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="size-6 text-white" />
      </a>
    </div>
  );
}
