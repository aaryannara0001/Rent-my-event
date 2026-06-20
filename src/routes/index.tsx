import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowUpRight,
  Sparkles,
  Tv2,
  Hammer,
  Volume2,
  Disc3,
  Briefcase,
  Heart,
  Music4,
  Building2,
  Radio,
  Cable,
  Star,
  CheckCircle2,
  Users,
  Trophy,
  MapPin,
  CalendarHeart,
  Quote,
  Utensils,
  Camera,
  Gift,
  Home,
  Check,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Aurora } from "@/components/site/Aurora";
import { Particles } from "@/components/site/Particles";
import { Tilt3D } from "@/components/site/Tilt3D";
import { getPostsFn } from "@/lib/server-fns";
import heroStage from "@/assets/hero-stage.jpg";
import showWedding from "@/assets/show-wedding.jpg";
import showConcert from "@/assets/show-concert.jpg";
import showCorporate from "@/assets/show-corporate.jpg";
import showFashion from "@/assets/show-fashion.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rent My Event — Premium Event Planning & Rentals" },
      {
        name: "description",
        content:
          "Rent My Event is a full-service event management and event rental company. Plan smartly, organize perfectly, execute flawlessly.",
      },
      { property: "og:title", content: "Rent My Event — Premium Event Planning & Rentals" },
      { property: "og:description", content: "Rent My Event is a full-service event management and event rental company." },
    ],
  }),
  loader: async () => {
    const posts = await getPostsFn();
    return { posts };
  },
  component: HomePage,
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

const showcase = [
  {
    img: showWedding,
    tag: "Luxury Weddings",
    title: "Where Two Worlds Become One Story",
    desc: "Floral skylines, crystal chandeliers, and bespoke mandaps engineered for every emotion.",
  },
  {
    img: showConcert,
    tag: "Live Concerts",
    title: "Sound, Light, Adrenaline. On Cue.",
    desc: "Festival-grade rigs and tour-ready production for headline artists across India.",
  },
  {
    img: showCorporate,
    tag: "Corporate Summits",
    title: "Boardroom Vision, Stadium Execution",
    desc: "Curved LEDs, broadcast streams, and seamless show-calling for global brands.",
  },
  {
    img: showFashion,
    tag: "Fashion & Launches",
    title: "Runways That Photograph Themselves",
    desc: "Cinematic gradient lighting and sculptural stages designed for the front row.",
  },
];

const features = [
  { icon: Users, title: "Expert Team with Real Experience", desc: "Our skilled planners, designers, decorators, and technicians ensure your event runs smoothly from start to finish." },
  { icon: Sparkles, title: "One-Stop Event Solution", desc: "From décor to rentals, sound to seating, lights to logistics — everything under one roof." },
  { icon: Heart, title: "Creative Themes & Premium Décor", desc: "We design modern, traditional, luxury, and customized themes to match your vision." },
  { icon: CheckCircle2, title: "Quality You Can Trust", desc: "We use premium materials, safe installations, professional-grade equipment, and reliable manpower." },
  { icon: Trophy, title: "Affordable Pricing", desc: "We believe every celebration deserves perfection — at a price that fits your budget." },
  { icon: MapPin, title: "Pan-India Coverage", desc: "We proudly serve customers across India with a wide range of event solutions." },
];

const testimonials = [
  {
    quote: "Rent My Event turned our corporate seminar into an absolute masterpiece. The stage setup and coordination were flawless.",
    name: "Aanya Mehta",
    role: "Brand Lead, Atlas Mobility",
  },
  {
    quote: "From sangeet to the grand reception — every transition was perfect. The wedding décor and theme design surpassed our dreams.",
    name: "Karan & Riya",
    role: "Wedding · Udaipur 2025",
  },
  {
    quote: "Amazing team, professional equipment, and flawless execution. They handled our stage setup, sound, and lighting with extreme precision.",
    name: "Rajesh Sharma",
    role: "Event Director, Cultural Fest",
  },
];

const stats = [
  { v: "5,000+", l: "Events Delivered" },
  { v: "15+", l: "Years of Craft" },
  { v: "120+", l: "Expert Crew" },
  { v: "Pan-India", l: "Coverage" },
];

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <Marquee />
      <WhoWeAre />
      <Services />
      <Showcase />
      <WhyUs />
      <GalleryPreview />
      <Testimonials />
      <CTA />
    </SiteLayout>
  );
}

function WhoWeAre() {
  const steps = [
    { num: "01", title: "Plan Smartly", desc: "Meticulous pre-production planning and coordinate logistics down to the finest detail.", icon: Sparkles },
    { num: "02", title: "Organize Perfectly", desc: "Sourcing premium materials, design alignment, and complete resource scheduling.", icon: Users },
    { num: "03", title: "Execute Flawlessly", desc: "Live show production, timing management, and certified safe crew deployments.", icon: CheckCircle2 },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
      <Aurora className="opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Who We Are
            </div>
            <h2 className="font-display mt-5 text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight">
              India's Trusted <br />
              <span className="text-gradient-primary">Event Management</span> <br />
              & Rentals Partner
            </h2>
            <p className="mt-6 text-lg text-foreground/75 leading-relaxed">
              Rent My Event is a full-service event management and event rental company dedicated to delivering seamless, stylish, and stress-free events. We combine professional expertise with innovative thinking to offer end-to-end event solutions.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link to="/contact" className="btn-glow px-6 py-3.5 rounded-xl text-sm font-semibold">
                Get in Touch
              </Link>
              <a href="tel:9625340107" className="px-6 py-3.5 rounded-xl glass hover:bg-white/10 text-sm font-semibold transition">
                Call 9625340107
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs uppercase tracking-widest text-[var(--neon)] mb-2 font-semibold">
              Our Simple Mission
            </div>
            <div className="grid gap-5">
              {steps.map((step) => (
                <div key={step.num} className="glass rounded-2xl p-6 flex items-start gap-4 hover:border-white/20 transition-all duration-300">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-[var(--electric)] to-[var(--neon)] grid place-items-center shrink-0">
                    <step.icon className="size-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold flex items-center gap-2">
                      <span className="text-sm font-mono text-[var(--neon)]">{step.num} ·</span>
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden flex items-center pt-32 pb-20">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <img
          src={heroStage}
          alt="Cinematic concert stage with LED walls and lasers"
          className="size-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/50" />
      </motion.div>

      <Aurora />
      <Particles count={22} />

      {/* Floating light beams */}
      <div className="absolute -top-40 left-1/4 w-2 h-[120%] bg-gradient-to-b from-[var(--neon)] via-[var(--electric)] to-transparent blur-3xl opacity-50 rotate-12" />
      <div className="absolute -top-40 right-1/4 w-2 h-[120%] bg-gradient-to-b from-[var(--cyan-glow)] via-[var(--electric)] to-transparent blur-3xl opacity-40 -rotate-12" />

      <motion.div style={{ opacity }} className="relative mx-auto max-w-7xl px-5 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs uppercase tracking-[0.25em]"
        >
          <span className="size-1.5 rounded-full bg-[var(--neon)] animate-pulse shadow-[0_0_10px_var(--neon)]" />
          Premium Event Planning & Rentals · Support: 9625340107
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-display mt-6 text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] tracking-tight font-bold max-w-5xl"
        >
          Transforming Your <span className="text-gradient-primary">Moments</span>
          <br />
          Into <em className="not-italic text-gradient">Unforgettable Memories</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 text-lg sm:text-xl text-foreground/75 max-w-2xl"
        >
          At Rent My Event, we plan, design, and execute weddings, corporate events, birthday parties, stage shows, and event rentals with passion, creativity, and precision.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link to="/contact" className="btn-glow px-7 py-4 rounded-2xl font-semibold inline-flex items-center gap-2">
            Plan Your Event <ArrowUpRight className="size-4" />
          </Link>
          <Link
            to="/gallery"
            className="px-7 py-4 rounded-2xl font-semibold glass-strong hover:bg-white/10 transition inline-flex items-center gap-2"
          >
            Explore Experiences
          </Link>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              whileHover={{ y: -6 }}
              className="gradient-border p-6"
            >
              <div className="font-display text-3xl sm:text-4xl font-bold text-gradient-primary">
                {s.v}
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {s.l}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <div className="scroll-indicator" />
        <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Scroll</div>
      </motion.div>
    </section>
  );
}

function Marquee() {
  const items = ["Weddings", "Concerts", "Corporate Summits", "Engagements", "Exhibitions", "Seminars", "Birthday Parties", "Stage Shows", "Baby Showers", "House Warmings"];
  return (
    <div className="relative py-10 border-y border-white/10 overflow-hidden bg-gradient-to-r from-transparent via-white/[0.02] to-transparent">
      <div className="flex gap-16 animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="font-display text-2xl sm:text-3xl font-semibold text-foreground/40 hover:text-foreground transition">
            ✦ {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ kicker, title, sub }: { kicker: string; title: React.ReactNode; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="max-w-3xl"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        <span className="size-1 rounded-full bg-[var(--neon)] shadow-[0_0_8px_var(--neon)]" />
        {kicker}
      </div>
      <h2 className="font-display mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
        {title}
      </h2>
      {sub && <p className="mt-5 text-lg text-foreground/70 max-w-2xl">{sub}</p>}
    </motion.div>
  );
}

function Services() {
  return (
    <section className="relative py-32">
      <Aurora className="opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5">
        <SectionHeader
          kicker="Our Services"
          title={<>Everything your <span className="text-gradient-primary">celebration</span> needs,<br />all under one roof.</>}
          sub="From décor to rentals, sound to seating, lights to logistics — we plan and execute flawlessly."
        />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 perspective-1000">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.05 }}
            >
              <Tilt3D max={11} className="h-full">
                <div className="gradient-border p-6 relative overflow-hidden h-full">
                  <div className="size-12 rounded-xl grid place-items-center bg-gradient-to-br from-[var(--electric)]/30 to-[var(--neon)]/30 border border-white/10 shadow-[0_0_30px_-5px_var(--neon)] tilt-pop">
                    <s.icon className="size-5 text-[var(--neon)]" />
                  </div>
                  <h3 className="font-display mt-5 text-lg font-semibold tilt-pop-sm">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </Tilt3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          kicker="Experiences"
          title={<>Stories told in <span className="text-gradient-primary">light, sound & scale</span>.</>}
        />
        <div className="mt-16 space-y-28">
          {showcase.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`grid lg:grid-cols-12 gap-10 items-center ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}
            >
              <div className="lg:col-span-7 relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-[var(--electric)] via-[var(--neon)] to-[var(--cyan-glow)] rounded-3xl blur-2xl opacity-30 group-hover:opacity-60 transition duration-700" />
                <div className="relative overflow-hidden rounded-3xl gradient-border">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 px-3 py-1.5 rounded-full glass-strong text-xs uppercase tracking-widest">
                    {s.tag}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="text-xs uppercase tracking-[0.3em] text-[var(--neon)]">0{i + 1} / 0{showcase.length}</div>
                <h3 className="font-display mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  {s.title}
                </h3>
                <p className="mt-5 text-foreground/70 text-lg">{s.desc}</p>
                <Link to="/gallery" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold group/link">
                  <span className="text-gradient-primary">View case study</span>
                  <ArrowUpRight className="size-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="relative py-32 overflow-hidden">
      <Aurora />
      <div className="relative mx-auto max-w-7xl px-5">
        <SectionHeader
          kicker="Why Choose Us"
          title={<>Crafting perfection. <span className="text-gradient-primary">Priced for your budget.</span></>}
        />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 perspective-1000">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Tilt3D max={8} className="h-full">
                <div className="glass-strong rounded-3xl p-7 h-full">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl grid place-items-center bg-gradient-to-br from-[var(--electric)] to-[var(--neon)] shadow-[0_0_30px_-5px_var(--neon)] tilt-pop">
                      <f.icon className="size-5 text-white" />
                    </div>
                    <div className="tilt-pop-sm">
                      <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                      <p className="mt-2 text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                </div>
              </Tilt3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryPreview() {
  const imgs = [g1, g2, g3, g4, g5, g6];
  const tags = ["LED Walls", "Weddings", "DJ Nights", "Festivals", "Launches", "Exhibitions"];
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <SectionHeader
            kicker="Selected Work"
            title={<>Moments we turned into <span className="text-gradient-primary">memories</span>.</>}
          />
          <Link to="/gallery" className="px-5 py-3 rounded-xl glass-strong hover:bg-white/10 inline-flex items-center gap-2 text-sm font-semibold">
            See full gallery <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="mt-14 grid grid-cols-12 gap-4 auto-rows-[180px]">
          {imgs.map((img, i) => {
            const layouts = [
              "col-span-12 sm:col-span-6 lg:col-span-5 row-span-2",
              "col-span-6 sm:col-span-6 lg:col-span-3 row-span-2",
              "col-span-6 sm:col-span-6 lg:col-span-4 row-span-2",
              "col-span-12 sm:col-span-8 lg:col-span-7 row-span-2",
              "col-span-12 sm:col-span-4 lg:col-span-5 row-span-2",
              "col-span-12 row-span-2",
            ];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`${layouts[i]} group relative overflow-hidden rounded-3xl gradient-border`}
              >
                <img
                  src={img}
                  alt={tags[i]}
                  loading="lazy"
                  className="size-full object-cover group-hover:scale-110 transition duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition" />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--electric)]/0 via-transparent to-[var(--neon)]/0 group-hover:from-[var(--electric)]/30 group-hover:to-[var(--neon)]/30 transition" />
                <div className="absolute bottom-5 left-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--cyan-glow)]">Featured</div>
                  <div className="font-display text-xl font-semibold">{tags[i]}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative py-32 overflow-hidden">
      <Aurora className="opacity-50" />
      <div className="relative mx-auto max-w-7xl px-5">
        <SectionHeader
          kicker="Client Stories"
          title={<>Trusted by visionaries, <span className="text-gradient-primary">felt by thousands</span>.</>}
        />
        <div className="mt-16 grid lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-strong rounded-3xl p-8 relative overflow-hidden group"
            >
              <Quote className="size-10 text-[var(--neon)] opacity-60" />
              <p className="mt-5 text-lg leading-relaxed text-foreground/85">"{t.quote}"</p>
              <div className="mt-8 flex items-center gap-4 pt-6 border-t border-white/10">
                <div className="size-12 rounded-full bg-gradient-to-br from-[var(--electric)] via-[var(--neon)] to-[var(--cyan-glow)] grid place-items-center font-display font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
                <div className="ml-auto flex">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="size-4 fill-[var(--gold)] text-[var(--gold)]" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="relative overflow-hidden rounded-[2.5rem] p-10 sm:p-16 lg:p-24 text-center gradient-border">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--electric)]/30 via-[var(--neon)]/20 to-[var(--cyan-glow)]/30" />
          <Aurora />
          <Particles count={16} />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.4em] text-[var(--cyan-glow)]">
              Let's Build Something Iconic
            </div>
            <h2 className="font-display mt-4 text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl mx-auto">
              Ready to create an <span className="text-gradient-primary">unforgettable</span> experience?
            </h2>
            <p className="mt-6 text-foreground/75 max-w-xl mx-auto text-lg">
              Your celebration deserves nothing less than perfection. Call our support team at <a href="tel:9625340107" className="underline font-semibold hover:text-[var(--neon)] transition">9625340107</a> to plan, design, and execute your vision.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="tel:9625340107" className="btn-glow px-7 py-4 rounded-2xl font-semibold inline-flex items-center gap-2">
                Call Now: 9625340107 <ArrowUpRight className="size-4" />
              </a>
              <Link to="/contact" className="px-7 py-4 rounded-2xl font-semibold glass-strong hover:bg-white/10 transition">
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
