import { Link } from "@tanstack/react-router";
import { Sparkles, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--neon)] to-transparent opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--electric)]/5 to-[var(--neon)]/10 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-5 py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="size-10 rounded-xl bg-gradient-to-br from-[var(--electric)] via-[var(--neon)] to-[var(--cyan-glow)] grid place-items-center shadow-[0_0_30px_-5px_var(--neon)]">
                <Sparkles className="size-5 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-lg">RENT MY EVENT</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Event Planning & Rentals
                </div>
              </div>
            </Link>
            <p className="text-muted-foreground max-w-md">
              At Rent My Event, we plan, design, and execute every event with passion, creativity, and precision. We transform your moments into unforgettable memories.
            </p>
            <div className="mt-8 glass rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Stay in the loop
              </div>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="you@studio.com"
                  className="flex-1 bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon)] transition"
                />
                <button className="btn-glow px-5 rounded-xl text-sm font-semibold">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Studio
            </div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services" className="hover:text-foreground text-foreground/70">Services</Link></li>
              <li><Link to="/gallery" className="hover:text-foreground text-foreground/70">Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-foreground text-foreground/70">Journal</Link></li>
              <li><Link to="/contact" className="hover:text-foreground text-foreground/70">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Services
            </div>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li>Event Planning</li>
              <li>Venue Decoration</li>
              <li>Equipment Rentals</li>
              <li>Luxury Weddings</li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Connect
            </div>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li className="flex items-center gap-3"><Mail className="size-4 text-[var(--neon)]" /><span>hello@rentmyevent.com</span></li>
              <li className="flex items-center gap-3"><Phone className="size-4 text-[var(--cyan-glow)]" /><span>+91 9625340107</span></li>
              <li className="flex items-center gap-3"><MapPin className="size-4 text-[var(--gold)]" /><span>Pan-India Coverage</span></li>
            </ul>
            <div className="flex gap-3 mt-5">
              {[Instagram, Youtube, Linkedin].map((I, i) => (
                <a key={i} href="#" className="size-10 grid place-items-center rounded-xl glass hover:scale-110 hover:shadow-[0_0_25px_-5px_var(--neon)] transition">
                  <I className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Rent My Event. All rights reserved.</div>
          <div>Privacy · Terms · Cookies</div>
        </div>
      </div>
    </footer>
  );
}
