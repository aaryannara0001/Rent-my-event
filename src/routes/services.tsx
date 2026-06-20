import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Tv2, Hammer, Volume2, Disc3, Briefcase, Heart, Music4, Building2, Radio, Cable, ArrowUpRight, Sparkles, Star, Utensils, Camera } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Aurora } from "@/components/site/Aurora";
import { Tilt3D } from "@/components/site/Tilt3D";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Rent My Event" },
      { name: "description", content: "Event planning, venue decoration, theme-based styling, wedding planning, corporate events, catering, photography, and equipment rentals." },
      { property: "og:title", content: "Services — Rent My Event" },
      { property: "og:description", content: "Plan smartly. Organize perfectly. Execute flawlessly." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Briefcase, title: "Event Planning & Coordination", desc: "Seamless orchestration of your event from concept to flawless execution." },
  { icon: Sparkles, title: "Venue Decoration", desc: "Stunning floral setups, bespoke themes, and jaw-dropping ambiance designs." },
  { icon: Star, title: "Theme-based Styling", desc: "Custom themes (luxury, traditional, modern) tailored to tell your unique story." },
  { icon: Heart, title: "Wedding Planning", desc: "Cinematic mandaps, sangeets, and receptions designed with passion and precision." },
  { icon: Building2, title: "Corporate Events & Seminars", desc: "End-to-end management, professional staging, and seamless execution for global brands." },
  { icon: Tv2, title: "Stage Setup & Lighting", desc: "Certified trussing, custom-built stages, moving heads, and choreographed lighting." },
  { icon: Volume2, title: "Sound Systems & DJ", desc: "High-fidelity line arrays, professional audio tuning, and top-tier DJ setups." },
  { icon: Utensils, title: "Catering & Production", desc: "Premium multi-cuisine menus, live stations, and complete event production services." },
  { icon: Camera, title: "Photography & Videography", desc: "Cinematic event coverage, pre-wedding shoots, and memories captured for a lifetime." },
  { icon: Hammer, title: "Equipment Rentals", desc: "Premium inventory: chairs, tables, tents, LED walls, sound, lights, and truss systems." },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <section className="relative pt-40 pb-16 overflow-hidden">
        <Aurora />
        <div className="relative mx-auto max-w-7xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Services
          </div>
          <h1 className="font-display mt-6 text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight">
            Plan smartly. <span className="text-gradient-primary">Execute flawlessly.</span>
          </h1>
          <p className="mt-7 text-lg text-foreground/70 max-w-2xl mx-auto">
            At Rent My Event, we combine professional expertise with innovative thinking to offer end-to-end event solutions.
          </p>
        </div>
      </section>

      <section className="relative pb-32">
        <div className="mx-auto max-w-7xl px-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
            >
              <Tilt3D max={9} className="h-full">
                <div className="gradient-border p-8 group h-full">
                  <div className="size-14 rounded-2xl grid place-items-center bg-gradient-to-br from-[var(--electric)] to-[var(--neon)] shadow-[0_0_30px_-5px_var(--neon)] tilt-pop">
                    <s.icon className="size-6 text-white" />
                  </div>
                  <h3 className="font-display mt-6 text-2xl font-semibold tilt-pop-sm">{s.title}</h3>
                  <p className="mt-3 text-muted-foreground">{s.desc}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gradient-primary tilt-pop-sm">
                    Get a quote <ArrowUpRight className="size-4" />
                  </div>
                </div>
              </Tilt3D>
            </motion.div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
