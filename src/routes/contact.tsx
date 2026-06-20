import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Aurora } from "@/components/site/Aurora";
import { Particles } from "@/components/site/Particles";
import { createInquiryFn } from "@/lib/server-fns";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Rent My Event" },
      { name: "description", content: "Get in touch with Rent My Event. Call 9625340107 to plan, design, and execute your events." },
      { property: "og:title", content: "Contact Rent My Event" },
      { property: "og:description", content: "Get a free quote for weddings, corporate events, and rentals." },
    ],
  }),
  component: ContactPage,
});

const eventTypes = ["Wedding", "Concert", "Corporate", "Launch", "Festival", "Other"];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", message: "", eventType: "Wedding" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createInquiryFn({
      data: {
        name: form.name || "Anonymous",
        email: form.email,
        phone: form.phone,
        eventType: form.eventType,
        date: form.date,
        message: form.message,
      }
    });
    setSent(true);
  };

  return (
    <SiteLayout>
      <section className="relative pt-40 pb-32 overflow-hidden">
        <Aurora />
        <Particles count={16} />
        <div className="relative mx-auto max-w-7xl px-5 grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Let's talk
            </div>
            <h1 className="font-display mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
              Tell us your <span className="text-gradient-primary">vision</span>.
            </h1>
            <p className="mt-6 text-lg text-foreground/75">
              Reach out to us directly via call, WhatsApp, or by submitting this brief. We plan, design, and execute every event with passion, creativity, and precision.
            </p>
            <div className="mt-10 space-y-5">
              {[
                { I: Mail, l: "hello@rentmyevent.com", k: "Email" },
                { I: Phone, l: "+91 9625340107", k: "Phone / WhatsApp" },
                { I: MapPin, l: "Pan-India Coverage", k: "Service Area" },
              ].map(({ I, l, k }) => (
                <div key={k} className="flex items-center gap-4 glass rounded-2xl p-4">
                  <div className="size-11 rounded-xl bg-gradient-to-br from-[var(--electric)] to-[var(--neon)] grid place-items-center shadow-[0_0_25px_-5px_var(--neon)]">
                    <I className="size-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{k}</div>
                    <div className="font-medium">{l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            onSubmit={onSubmit}
            className="lg:col-span-7 glass-strong rounded-3xl p-8 sm:p-10 space-y-5"
          >
            {sent ? (
              <div className="text-center py-16">
                <div className="size-16 rounded-full bg-gradient-to-br from-[var(--electric)] to-[var(--neon)] grid place-items-center mx-auto shadow-[0_0_40px_-5px_var(--neon)]">
                  <CheckCircle2 className="size-8 text-white" />
                </div>
                <h3 className="font-display text-3xl font-bold mt-6">Brief received.</h3>
                <p className="text-muted-foreground mt-3">A producer will reach out within 4 business hours.</p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Your name" placeholder="Anaya Kapoor" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field label="Email" placeholder="you@studio.com" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Phone" placeholder="+91 98 ..." value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  <Field label="Event date" placeholder="DD / MM / YYYY" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Event type</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {eventTypes.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setForm({ ...form, eventType: t })}
                        className={`px-4 py-2 rounded-full text-sm transition ${
                          form.eventType === t
                            ? "bg-gradient-to-r from-[var(--electric)] to-[var(--neon)] text-white shadow-[0_0_20px_-5px_var(--neon)]"
                            : "glass hover:bg-white/10"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Tell us about it</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Vibe, scale, location, budget hints..."
                    className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon)] transition"
                  />
                </div>
                <button className="btn-glow w-full px-6 py-4 rounded-2xl font-semibold inline-flex items-center justify-center gap-2">
                  Send Brief <ArrowUpRight className="size-4" />
                </button>
              </>
            )}
          </motion.form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, placeholder, type = "text", value, onChange }: { label: string; placeholder: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon)] transition"
      />
    </div>
  );
}
