import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Search, ArrowUpRight, Instagram, Facebook, Linkedin, Sparkles, Eye } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Aurora } from "@/components/site/Aurora";
import { getPostsFn } from "@/lib/server-fns";
import { categories, type Platform, type Category } from "@/lib/store";
import { proxyThumbnail } from "@/lib/proxy-image";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Stories & Inspirations — Rent My Event" },
      { name: "description", content: "Weddings, corporate productions, theme decorations, rentals, and behind-the-scenes stories from Rent My Event across Instagram, Facebook and LinkedIn." },
      { property: "og:title", content: "Stories & Inspirations — Rent My Event" },
      { property: "og:description", content: "Editorial highlights from our event productions across socials." },
    ],
  }),
  loader: async () => {
    const posts = await getPostsFn();
    return { posts };
  },
  component: BlogPage,
});

const platformTabs: { id: "all" | Platform; label: string; Icon: typeof Instagram }[] = [
  { id: "all", label: "All", Icon: Sparkles },
  { id: "instagram", label: "Instagram", Icon: Instagram },
  { id: "facebook", label: "Facebook", Icon: Facebook },
  { id: "linkedin", label: "LinkedIn", Icon: Linkedin },
];

function BlogPage() {
  const { posts } = Route.useLoaderData();
  const [platform, setPlatform] = useState<"all" | Platform>("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");

  const published = useMemo(() => posts.filter((p) => p.status === "published"), [posts]);
  const featured = useMemo(() => published.filter((p) => p.featured).slice(0, 3), [published]);

  const filtered = useMemo(() => {
    return published.filter((p) => {
      if (platform !== "all" && p.platform !== platform) return false;
      if (category !== "all" && p.category !== category) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.excerpt.toLowerCase().includes(q) &&
          !p.tags.some((t) => t.toLowerCase().includes(q))
        )
          return false;
      }
      return true;
    });
  }, [published, platform, category, query]);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <Aurora />
        <div className="relative mx-auto max-w-7xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            The Studio Journal
          </div>
          <h1 className="font-display mt-6 text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight">
            Stories, Experiences &
            <br />
            <span className="text-gradient-primary">Event Inspirations</span>
          </h1>
          <p className="mt-7 max-w-3xl mx-auto text-lg text-foreground/70">
            Explore luxury weddings, corporate productions, concert setups and behind-the-scenes
            event stories — curated from our socials and the show floor.
          </p>
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="relative pb-20">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Trending</div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold">Featured Stories</h2>
              </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              {featured.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`group gradient-border overflow-hidden ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
                >
                  {p.externalUrl ? (
                    <a href={p.externalUrl} target="_blank" rel="noreferrer" className="block">
                      <div className="relative overflow-hidden aspect-[16/10]">
                        <img src={proxyThumbnail(p.thumbnail)} alt={p.title} className="size-full object-cover group-hover:scale-110 transition duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent opacity-80" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <PlatformPill p={p.platform} />
                          <span className="px-3 py-1 rounded-full glass-strong text-[10px] uppercase tracking-widest">{p.category}</span>
                        </div>
                      </div>
                      <div className="p-7">
                        <h3 className={`font-display font-bold leading-tight ${i === 0 ? "text-3xl sm:text-4xl" : "text-xl"}`}>
                          {p.title}
                        </h3>
                        <p className="mt-3 text-sm text-foreground/70 line-clamp-2">{p.excerpt}</p>
                        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5"><Eye className="size-3.5" /> {p.views.toLocaleString()} views</span>
                          <ArrowUpRight className="size-4 text-[var(--neon)] group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                        </div>
                      </div>
                    </a>
                  ) : (
                    <Link to="/blog/$slug" params={{ slug: p.slug }} className="block">
                      <div className="relative overflow-hidden aspect-[16/10]">
                        <img src={proxyThumbnail(p.thumbnail)} alt={p.title} className="size-full object-cover group-hover:scale-110 transition duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent opacity-80" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <PlatformPill p={p.platform} />
                          <span className="px-3 py-1 rounded-full glass-strong text-[10px] uppercase tracking-widest">{p.category}</span>
                        </div>
                      </div>
                      <div className="p-7">
                        <h3 className={`font-display font-bold leading-tight ${i === 0 ? "text-3xl sm:text-4xl" : "text-xl"}`}>
                          {p.title}
                        </h3>
                        <p className="mt-3 text-sm text-foreground/70 line-clamp-2">{p.excerpt}</p>
                        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5"><Eye className="size-3.5" /> {p.views.toLocaleString()} views</span>
                          <ArrowUpRight className="size-4 text-[var(--neon)] group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                        </div>
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FILTERS */}
      <section className="relative pb-12">
        <div className="mx-auto max-w-7xl px-5">
          <div className="glass-strong rounded-3xl p-5 sm:p-7 flex flex-col gap-5">
            {/* platform tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {platformTabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setPlatform(id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    platform === id
                      ? "bg-gradient-to-r from-[var(--electric)] to-[var(--neon)] text-white shadow-[0_0_25px_-5px_var(--neon)]"
                      : "glass hover:bg-white/10 text-foreground/80"
                  }`}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>
            {/* search + category */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search stories, weddings, lighting..."
                  className="w-full bg-transparent border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--neon)] transition"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory("all")}
                  className={`px-3.5 py-2 rounded-full text-xs uppercase tracking-widest transition ${
                    category === "all" ? "bg-white/15 text-foreground" : "glass text-foreground/70 hover:text-foreground"
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3.5 py-2 rounded-full text-xs uppercase tracking-widest transition ${
                      category === c ? "bg-white/15 text-foreground" : "glass text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="relative pb-32">
        <div className="mx-auto max-w-7xl px-5">
          {filtered.length === 0 ? (
            <div className="glass rounded-3xl p-16 text-center">
              <h3 className="font-display text-2xl font-bold">No stories match your filters</h3>
              <p className="text-muted-foreground mt-2">Try a different platform, category or search term.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
                  className="group gradient-border overflow-hidden flex flex-col"
                >
                  {p.externalUrl ? (
                    <a href={p.externalUrl} target="_blank" rel="noreferrer" className="block">
                      <div className="relative overflow-hidden aspect-[16/10]">
                        <img src={proxyThumbnail(p.thumbnail)} alt={p.title} loading="lazy" className="size-full object-cover group-hover:scale-110 transition duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/20 to-transparent" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <PlatformPill p={p.platform} />
                        </div>
                      </div>
                    </a>
                  ) : (
                    <Link to="/blog/$slug" params={{ slug: p.slug }} className="block">
                      <div className="relative overflow-hidden aspect-[16/10]">
                        <img src={proxyThumbnail(p.thumbnail)} alt={p.title} loading="lazy" className="size-full object-cover group-hover:scale-110 transition duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/20 to-transparent" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <PlatformPill p={p.platform} />
                        </div>
                      </div>
                    </Link>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.category}</div>
                    {p.externalUrl ? (
                      <a href={p.externalUrl} target="_blank" rel="noreferrer">
                        <h3 className="mt-2 font-display text-xl font-bold leading-tight group-hover:text-gradient-primary transition">
                          {p.title}
                        </h3>
                      </a>
                    ) : (
                      <Link to="/blog/$slug" params={{ slug: p.slug }}>
                        <h3 className="mt-2 font-display text-xl font-bold leading-tight group-hover:text-gradient-primary transition">
                          {p.title}
                        </h3>
                      </Link>
                    )}
                    <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{p.excerpt}</p>
                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                      <a
                        href={p.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-foreground/70 hover:text-[var(--neon)] transition"
                      >
                        View on {p.platform} <ArrowUpRight className="size-3.5" />
                      </a>
                      <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><Eye className="size-3" />{p.views.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative pb-32">
        <div className="mx-auto max-w-6xl px-5">
          <div className="relative gradient-border overflow-hidden rounded-3xl p-10 sm:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--electric)]/15 via-transparent to-[var(--neon)]/15" />
            <div className="relative">
              <h3 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
                Ready to <span className="text-gradient-primary">create your story?</span>
              </h3>
              <p className="mt-4 text-foreground/70 max-w-xl mx-auto">
                From intimate ceremonies to stadium-scale productions — let's build the experience.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Link to="/contact" className="btn-glow px-6 py-3.5 rounded-2xl font-semibold inline-flex items-center gap-2">
                  Plan Your Event <ArrowUpRight className="size-4" />
                </Link>
                <Link to="/services" className="px-6 py-3.5 rounded-2xl glass-strong font-semibold">
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function PlatformPill({ p }: { p: Platform }) {
  const map: Record<Platform, { Icon: typeof Instagram; cls: string; label: string }> = {
    instagram: { Icon: Instagram, cls: "from-pink-500 to-orange-500", label: "Instagram" },
    facebook: { Icon: Facebook, cls: "from-blue-500 to-blue-700", label: "Facebook" },
    linkedin: { Icon: Linkedin, cls: "from-sky-600 to-blue-800", label: "LinkedIn" },
  };
  const { Icon, cls, label } = map[p];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-white bg-gradient-to-r ${cls} shadow-lg`}>
      <Icon className="size-3" />
      {label}
    </span>
  );
}
