import { createFileRoute } from "@tanstack/react-router";
import { LogIn, FileText, Trash2, Upload, Settings as SettingsIcon, ShieldAlert, Plus, HelpCircle } from "lucide-react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { useAdminGuard } from "@/lib/use-admin-guard";
import { getLogsFn } from "@/lib/server-fns";

export const Route = createFileRoute("/admin/logs")({
  head: () => ({ meta: [{ title: "Activity Logs — Rent My Event Admin" }, { name: "robots", content: "noindex" }] }),
  loader: async () => {
    const logs = await getLogsFn();
    return { logs };
  },
  component: LogsPage,
});

const iconMap: Record<string, any> = {
  LogIn,
  FileText,
  Upload,
  Settings: SettingsIcon,
  Trash2,
  Plus,
  ShieldAlert
};

export function LogsPage() {
  const auth = useAdminGuard();
  const { logs } = Route.useLoaderData();

  if (!auth) return null;

  const getRelativeTime = (isoString: string) => {
    try {
      const parsed = new Date(isoString);
      const diffMs = Date.now() - parsed.getTime();
      const diffMin = Math.round(diffMs / 60000);
      const diffHrs = Math.round(diffMin / 60);
      
      if (diffMin < 1) return "Just now";
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      
      return parsed.toLocaleDateString("en-US", { dateStyle: "medium" });
    } catch {
      return "Some time ago";
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader title="Activity logs" subtitle="Every meaningful action across the studio admin." />
      <div className="glass-strong rounded-2xl p-2">
        {logs.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">No activities recorded yet.</div>
        )}
        {logs.map((e) => {
          const IconComponent = iconMap[e.icon] || HelpCircle;
          return (
            <div key={e.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition border-b border-white/5 last:border-0">
              <div className="size-10 rounded-xl glass grid place-items-center text-[var(--neon)] shrink-0">
                <IconComponent className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">{e.label}</div>
                <div className="text-xs text-muted-foreground">{e.who}</div>
              </div>
              <div className="text-xs text-muted-foreground shrink-0">{getRelativeTime(e.createdAt)}</div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
