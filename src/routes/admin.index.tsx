import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Inbox, Image as ImageIcon, Eye, Instagram, Facebook, Linkedin, ArrowUpRight, Plus, TrendingUp } from "lucide-react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { useAdminGuard } from "@/lib/use-admin-guard";
import { getPostsFn, getInquiriesFn } from "@/lib/server-fns";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — Rent My Event Admin" }, { name: "robots", content: "noindex" }] }),
  loader: async () => {
    const posts = await getPostsFn();
    const inquiries = await getInquiriesFn();
    return { posts, inquiries };
  },
  component: DashboardPage,
});

export function DashboardPage() {
  const auth = useAdminGuard();
  const { posts, inquiries } = Route.useLoaderData();
  if (!auth) return null;

  const totalPosts = posts.length;
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const byPlatform = {
    instagram: posts.filter((p) => p.platform === "instagram").length,
    facebook: posts.filter((p) => p.platform === "facebook").length,
    linkedin: posts.filter((p) => p.platform === "linkedin").length,
  };
  const recentPosts = [...posts].slice(0, 4);
  const recentInquiries = [...inquiries].slice(0, 4);

  const stats = [
    { label: "Total Posts", value: totalPosts, Icon: FileText, accent: "var(--electric)" },
    { label: "Total Views", value: totalViews.toLocaleString(), Icon: Eye, accent: "var(--neon)" },
    { label: "New Inquiries", value: newInquiries, Icon: Inbox, accent: "var(--cyan-glow)" },
    { label: "Media Assets", value: 86, Icon: ImageIcon, accent: "var(--gold)" },
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Studio overview"
        subtitle="Real-time pulse of your stories, audience and incoming briefs."
        actions={
          <Link to="/admin/posts" className="btn-glow px-4 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="size-4" /> New Post
          </Link>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative gradient-border rounded-2xl p-5 overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 size-32 rounded-full opacity-30 blur-3xl" style={{ background: s.accent }} />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.label}</div>
                <div className="font-display text-3xl font-bold mt-2">{s.value}</div>
              </div>
              <div className="size-11 rounded-xl glass grid place-items-center" style={{ color: s.accent }}>
                <s.Icon className="size-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-8">
        {/* Platform breakdown */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">By platform</div>
          <h3 className="font-display text-xl font-bold mt-1">Content distribution</h3>
          <div className="mt-6 space-y-4">
            <PlatformRow Icon={Instagram} name="Instagram" count={byPlatform.instagram} total={totalPosts} from="from-pink-500" to="to-orange-500" />
            <PlatformRow Icon={Facebook} name="Facebook" count={byPlatform.facebook} total={totalPosts} from="from-blue-500" to="to-blue-700" />
            <PlatformRow Icon={Linkedin} name="LinkedIn" count={byPlatform.linkedin} total={totalPosts} from="from-sky-600" to="to-blue-800" />
          </div>
        </div>

        {/* Recent posts */}
        <div className="lg:col-span-2 glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Latest stories</div>
              <h3 className="font-display text-xl font-bold mt-1">Recent posts</h3>
            </div>
            <Link to="/admin/posts" className="text-xs text-[var(--neon)] inline-flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition">
                <img src={p.thumbnail} alt="" className="size-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{p.platform} · {p.category}</div>
                </div>
                <div className="text-xs text-muted-foreground inline-flex items-center gap-1 shrink-0">
                  <Eye className="size-3" /> {p.views.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        <div className="lg:col-span-2 glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Inbox</div>
              <h3 className="font-display text-xl font-bold mt-1">Recent inquiries</h3>
            </div>
            <Link to="/admin/inquiries" className="text-xs text-[var(--neon)] inline-flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentInquiries.map((i) => (
              <div key={i.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition">
                <div className="min-w-0">
                  <div className="font-medium truncate">{i.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{i.eventType} · {i.email}</div>
                </div>
                <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full ${
                  i.status === "new" ? "bg-[var(--neon)]/20 text-[var(--neon)]" : "bg-white/5 text-muted-foreground"
                }`}>
                  {i.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Quick actions</div>
          <h3 className="font-display text-xl font-bold mt-1">Jump in</h3>
          <div className="mt-5 space-y-2">
            {[
              { to: "/admin/posts", label: "Create new post", Icon: Plus },
              { to: "/admin/inquiries", label: "Review inquiries", Icon: Inbox },
              { to: "/admin/analytics", label: "View analytics", Icon: TrendingUp },
              { to: "/admin/media", label: "Upload media", Icon: ImageIcon },
            ].map(({ to, label, Icon }) => (
              <Link key={to} to={to as "/admin/posts"} className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/10 transition group">
                <Icon className="size-4 text-[var(--neon)]" />
                <span className="text-sm flex-1">{label}</span>
                <ArrowUpRight className="size-3.5 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function PlatformRow({ Icon, name, count, total, from, to }: { Icon: typeof Instagram; name: string; count: number; total: number; from: string; to: string }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="inline-flex items-center gap-2"><Icon className="size-4" /> {name}</span>
        <span className="text-muted-foreground">{count} · {pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${from} ${to}`}
        />
      </div>
    </div>
  );
}
