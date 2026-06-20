import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-5 transition-all duration-500 ${
          scrolled ? "max-w-6xl" : ""
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-2xl px-5 py-3 ${
            scrolled ? "glass-strong shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]" : ""
          }`}
        >
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="relative">
              <div className="size-9 rounded-xl bg-gradient-to-br from-[var(--electric)] via-[var(--neon)] to-[var(--cyan-glow)] grid place-items-center shadow-[0_0_30px_-5px_var(--neon)]">
                <Sparkles className="size-4 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--electric)] to-[var(--neon)] blur-xl opacity-50 group-hover:opacity-80 transition" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-base tracking-tight">RENT MY EVENT</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Event Planning & Rentals
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="relative px-4 py-2 text-sm text-foreground/80 hover:text-foreground transition group"
                activeProps={{ className: "text-foreground" }}
              >
                <span>{l.label}</span>
                <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-gradient-to-r from-[var(--electric)] via-[var(--neon)] to-[var(--cyan-glow)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/admin/login"
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-foreground/70 hover:text-foreground transition glass"
            >
              Login
            </Link>
            <Link
              to="/contact"
              className="btn-glow px-5 py-2.5 rounded-xl text-sm font-semibold magnetic"
            >
              Plan Your Event
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg glass"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 glass-strong rounded-2xl p-4 flex flex-col gap-1"
          >
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-white/5 text-sm"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg hover:bg-white/5 text-sm border border-white/10"
            >
              Login
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn-glow mt-2 px-5 py-3 rounded-xl text-sm font-semibold text-center"
            >
              Plan Your Event
            </Link>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
