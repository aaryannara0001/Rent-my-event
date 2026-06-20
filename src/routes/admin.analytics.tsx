import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, Inbox, MousePointerClick, TrendingUp } from "lucide-react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { useAdminGuard } from "@/lib/use-admin-guard";
import { getPostsFn, getInquiriesFn } from "@/lib/server-fns";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Rent My Event Admin" }, { name: "robots", content: "noindex" }] }),
  loader: async () => {
    const posts = await getPostsFn();
    const inquiries = await getInquiriesFn();
    return { posts, inquiries };
  },
  component: AnalyticsPage,
});

export function AnalyticsPage() {
  const auth = useAdminGuard();
  const { posts, inquiries } = Route.useLoaderData();
  if (!auth) return null;

  const top = [...posts].sort((a, b) => b.views - a.views).slice(0, 6);
  const totalViews = posts.reduce((s, p) => s + p.views, 0);
  const max = Math.max(...top.map((p) => p.views), 1);

  const stats = [
    { label: "Total views", value: totalViews.toLocaleString(), Icon: Eye },
    { label: "Inquiries", value: inquiries.length, Icon: Inbox },
    { label: "Avg. CTR", value: "4.2%", Icon: MousePointerClick },
    { label: "Engagement", value: "+18%", Icon: TrendingUp },
  ];

  return (
    <AdminLayout>
      <AdminPageHeader title="Analytics" subtitle="Audience pulse across stories, platforms and inquiries." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="gradient-border rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.label}</div>
                <div className="font-display text-3xl font-bold mt-2">{s.value}</div>
              </div>
              <div className="size-11 rounded-xl glass grid place-items-center text-[var(--neon)]">
                <s.Icon className="size-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-strong rounded-2xl p-6">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Top performers</div>
        <h3 className="font-display text-xl font-bold mt-1 mb-6">Most viewed posts</h3>
        <div className="space-y-3">
          {top.map((p, i) => {
            const pct = (p.views / max) * 100;
            return (
              <div key={p.id} className="flex items-center gap-4">
                <div className="size-7 rounded-full glass grid place-items-center text-xs font-bold text-muted-foreground shrink-0">{i + 1}</div>
                <img src={p.thumbnail} alt="" className="size-10 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-sm">{p.title}</div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-[var(--electric)] to-[var(--neon)]" />
                  </div>
                </div>
                <div className="text-sm tabular-nums text-foreground/80 shrink-0">{p.views.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
