import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Aurora } from "@/components/site/Aurora";
import { Particles } from "@/components/site/Particles";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import sw from "@/assets/show-wedding.jpg";
import sc from "@/assets/show-concert.jpg";
import sco from "@/assets/show-corporate.jpg";
import sf from "@/assets/show-fashion.jpg";
import { getMediaFn } from "@/lib/server-fns";
import { X } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Rent My Event" },
      { name: "description", content: "An immersive showcase of weddings, corporate seminars, private events, theme designs and rentals." },
      { property: "og:title", content: "Gallery — Rent My Event" },
      { property: "og:description", content: "Moments we turned into memories." },
    ],
  }),
  loader: async () => {
    try {
      const media = await getMediaFn();
      return { media };
    } catch {
      return { media: [] };
    }
  },
  component: GalleryPage,
});

const items = [
  { src: g4, cat: "Concerts", title: "Pyro Festival" },
  { src: sw, cat: "Weddings", title: "Crystal Mandap" },
  { src: g3, cat: "DJ Nights", title: "Console Glow" },
  { src: sc, cat: "Concerts", title: "Laser Storm" },
  { src: g2, cat: "Weddings", title: "Chandelier Hall" },
  { src: g1, cat: "Lighting", title: "Truss Rainbow" },
  { src: sco, cat: "Corporate", title: "Summit Curve" },
  { src: g6, cat: "LED Walls", title: "Booth Build" },
  { src: sf, cat: "Stage Setup", title: "Runway Gradient" },
  { src: g5, cat: "LED Walls", title: "Reveal Stage" },
];

const filters = ["All", "Weddings", "Concerts", "DJ Nights", "Corporate", "LED Walls", "Stage Setup", "Lighting"];

function GalleryPage() {
  const { media } = Route.useLoaderData();
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState<number | null>(null);

  // Map dynamic backend media to gallery items
  const dynamicItems = media.map(m => ({
    src: m.url,
    cat: "LED Walls",
    title: m.filename.split(".")[0].replace(/-/g, " ")
  }));

  const allItems = [...dynamicItems, ...items];
  const filtered = active === "All" ? allItems : allItems.filter((i) => i.cat === active);
  return (
    <SiteLayout>
      <section className="relative pt-40 pb-20 overflow-hidden">
        <Aurora />
        <Particles count={16} />
        <div className="relative mx-auto max-w-7xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Portfolio
          </div>
          <h1 className="font-display mt-6 text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight">
            Moments we turned into
            <br />
            <span className="text-gradient-primary">experiences</span>.
          </h1>
        </div>
      </section>

      <section className="relative pb-32">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                  active === f
                    ? "btn-glow"
                    : "glass hover:bg-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5">
            {filtered.map((it, i) => (
              <motion.button
                layout
                key={it.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                onClick={() => setOpen(allItems.indexOf(it))}
                className="group block w-full break-inside-avoid relative overflow-hidden rounded-2xl gradient-border text-left"
              >
                <img src={it.src} alt={it.title} loading="lazy" className="w-full group-hover:scale-110 transition duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-70 group-hover:opacity-90 transition" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--cyan-glow)]">{it.cat}</div>
                  <div className="font-display text-xl font-semibold mt-1">{it.title}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>
 
      {open !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[80] bg-background/90 backdrop-blur-2xl grid place-items-center p-6"
        >
          <button className="absolute top-6 right-6 size-12 rounded-full glass-strong grid place-items-center" onClick={() => setOpen(null)}>
            <X />
          </button>
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            src={allItems[open].src}
            alt={allItems[open].title}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-[0_0_120px_-20px_var(--neon)]"
          />
        </motion.div>
      )}
    </SiteLayout>
  );
}
