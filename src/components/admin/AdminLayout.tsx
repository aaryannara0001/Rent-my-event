import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  Inbox,
  BarChart3,
  Users,
  Settings,
  ScrollText,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";

const items: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/posts", label: "Blog Posts", icon: FileText },
  { to: "/admin/media", label: "Media Gallery", icon: ImageIcon },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/logs", label: "Activity Logs", icon: ScrollText },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const auth = useStore((s) => s.auth);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const handleLogout = () => {
    logout();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-[var(--electric)]/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 size-[500px] rounded-full bg-[var(--neon)]/10 blur-[120px]" />
      </div>

      {/* mobile topbar */}
      <div className="lg:hidden sticky top-0 z-40 glass-strong px-4 py-3 flex items-center justify-between border-b border-white/5">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-[var(--electric)] to-[var(--neon)] grid place-items-center">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="font-display font-bold text-sm">RENT MY EVENT</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg glass">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div className="relative flex">
        {/* SIDEBAR */}
        <aside
          className={`${
            open ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-30 h-screen w-72 transition-transform duration-300`}
        >
          <div className="h-full m-3 lg:m-4 glass-strong rounded-3xl flex flex-col p-5 border border-white/5">
            <Link to="/" className="flex items-center gap-2.5 mb-8 px-2">
              <div className="size-10 rounded-xl bg-gradient-to-br from-[var(--electric)] via-[var(--neon)] to-[var(--cyan-glow)] grid place-items-center shadow-[0_0_30px_-5px_var(--neon)]">
                <Sparkles className="size-5 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-base leading-none">RENT MY EVENT</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Admin Studio</div>
              </div>
            </Link>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {items.map(({ to, label, icon: Icon, exact }) => {
                const active = isActive(to, exact);
                return (
                  <Link
                    key={to}
                    to={to as "/admin"}
                    onClick={() => setOpen(false)}
                    className={`relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition group ${
                      active
                        ? "text-foreground"
                        : "text-foreground/65 hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="admin-active"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--electric)]/25 to-[var(--neon)]/25 border border-white/10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className={`relative size-4 ${active ? "text-[var(--neon)]" : ""}`} />
                    <span className="relative">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="px-2 mb-3">
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Signed in</div>
                <div className="text-sm font-medium truncate">{auth?.email ?? "—"}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 transition"
              >
                <LogOut className="size-4" /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 min-w-0 lg:pl-0 p-4 sm:p-8 lg:py-8 lg:pr-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2">{title}</h1>
        {subtitle && <p className="text-foreground/65 mt-2 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}
