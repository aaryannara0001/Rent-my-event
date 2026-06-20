import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, Trash2, Eye, X, Mail, Phone, Calendar } from "lucide-react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import type { Inquiry } from "@/lib/store";
import { useAdminGuard } from "@/lib/use-admin-guard";
import { getInquiriesFn, updateInquiryFn, deleteInquiryFn, createLogFn } from "@/lib/server-fns";

export const Route = createFileRoute("/admin/inquiries")({
  head: () => ({ meta: [{ title: "Inquiries — Rent My Event Admin" }, { name: "robots", content: "noindex" }] }),
  loader: async () => {
    const inquiries = await getInquiriesFn();
    return { inquiries };
  },
  component: AdminInquiriesPage,
});

export function AdminInquiriesPage() {
  const auth = useAdminGuard();
  const { inquiries } = Route.useLoaderData();
  const router = useRouter();

  const handleUpdateInquiry = async (id: string, name: string, patch: Partial<Inquiry>) => {
    await updateInquiryFn({ data: { id, patch } });
    if (auth) {
      await createLogFn({ data: { icon: "Settings", label: `Completed inquiry: ${name}`, who: auth.email } });
    }
    router.invalidate();
  };

  const handleDeleteInquiry = async (id: string, name: string) => {
    await deleteInquiryFn({ data: id });
    if (auth) {
      await createLogFn({ data: { icon: "Trash2", label: `Deleted inquiry: ${name}`, who: auth.email } });
    }
    router.invalidate();
  };

  const [filter, setFilter] = useState<"all" | "new" | "completed">("all");
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<Inquiry | null>(null);

  const filtered = useMemo(() => inquiries.filter((i) => {
    if (filter !== "all" && i.status !== filter) return false;
    if (query && !`${i.name} ${i.email} ${i.eventType}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [inquiries, filter, query]);

  if (!auth) return null;

  return (
    <AdminLayout>
      <AdminPageHeader title="Inquiries" subtitle="All event briefs submitted through the contact form." />

      <div className="glass-strong rounded-2xl p-4 flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search inquiries..."
            className="w-full bg-transparent border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--neon)] transition" />
        </div>
        <div className="flex gap-2">
          {(["all", "new", "completed"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-medium transition ${
                filter === f ? "bg-gradient-to-r from-[var(--electric)] to-[var(--neon)] text-white" : "glass hover:bg-white/10 text-foreground/70"
              }`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Phone</th>
                <th className="text-left p-4">Event</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={7} className="p-12 text-center text-muted-foreground">No inquiries.</td></tr>}
              {filtered.map((i) => (
                <tr key={i.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition">
                  <td className="p-4 font-medium">{i.name}</td>
                  <td className="p-4 text-foreground/80">{i.email}</td>
                  <td className="p-4 text-foreground/80">{i.phone}</td>
                  <td className="p-4 text-foreground/80">{i.eventType}</td>
                  <td className="p-4 text-muted-foreground">{i.date}</td>
                  <td className="p-4">
                    <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      i.status === "new" ? "bg-[var(--neon)]/20 text-[var(--neon)]" : "bg-white/5 text-muted-foreground"
                    }`}>{i.status}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewing(i)} className="p-2 rounded-lg hover:bg-white/10 transition" title="View">
                        <Eye className="size-4" />
                      </button>
                      {i.status === "new" && (
                        <button onClick={() => handleUpdateInquiry(i.id, i.name, { status: "completed" })} className="p-2 rounded-lg hover:bg-[var(--neon)]/20 hover:text-[var(--neon)] transition" title="Mark complete">
                          <CheckCircle2 className="size-4" />
                        </button>
                      )}
                      <button onClick={() => { if (confirm("Delete inquiry?")) handleDeleteInquiry(i.id, i.name); }}
                        className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition" title="Delete">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {viewing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4"
            onClick={() => setViewing(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass-strong rounded-3xl p-8 border border-white/10">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Inquiry</div>
                  <h2 className="font-display text-2xl font-bold mt-1">{viewing.name}</h2>
                </div>
                <button onClick={() => setViewing(null)} className="p-2 rounded-lg hover:bg-white/10"><X className="size-5" /></button>
              </div>
              <div className="space-y-3 text-sm">
                <Row Icon={Mail} label="Email" value={viewing.email} />
                <Row Icon={Phone} label="Phone" value={viewing.phone} />
                <Row Icon={Calendar} label="Event date" value={viewing.date} />
                <div className="pt-3 border-t border-white/5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Event type</div>
                  <div>{viewing.eventType}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Message</div>
                  <p className="text-foreground/80 leading-relaxed">{viewing.message}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

function Row({ Icon, label, value }: { Icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-9 rounded-lg glass grid place-items-center text-[var(--neon)]"><Icon className="size-4" /></div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
