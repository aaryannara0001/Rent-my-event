import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, User as UserIcon, Pencil, Trash2, Plus, X } from "lucide-react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { useAdminGuard } from "@/lib/use-admin-guard";
import { getUsersFn, createUserFn, deleteUserFn, createLogFn } from "@/lib/server-fns";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — Rent My Event Admin" }, { name: "robots", content: "noindex" }] }),
  loader: async () => {
    const users = await getUsersFn();
    return { users };
  },
  component: UsersPage,
});

export function UsersPage() {
  const auth = useAdminGuard();
  const { users } = Route.useLoaderData();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Admin");
  const [err, setErr] = useState("");

  if (!auth) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !name.trim()) {
      setErr("All fields are required.");
      return;
    }
    try {
      await createUserFn({ data: { email: email.trim(), name: name.trim(), role, password: "password" } });
      await createLogFn({ data: { icon: "Plus", label: `Added user: ${name.trim()}`, who: auth.email } });
      setOpen(false);
      setEmail("");
      setName("");
      setRole("Admin");
      router.invalidate();
    } catch (error) {
      setErr("Failed to add user. Email might be already in use.");
    }
  };

  const handleDelete = async (userEmail: string, userName: string) => {
    if (userEmail === auth.email) {
      alert("You cannot delete your own logged-in account!");
      return;
    }
    if (confirm(`Are you sure you want to remove ${userName}?`)) {
      try {
        await deleteUserFn({ data: userEmail });
        await createLogFn({ data: { icon: "Trash2", label: `Removed user: ${userName}`, who: auth.email } });
        router.invalidate();
      } catch (error) {
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Users & roles" 
        subtitle="Manage who can author stories and run the admin." 
        actions={
          <button onClick={() => setOpen(true)} className="btn-glow px-4 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="size-4" /> Add User
          </button>
        }
      />
      <div className="glass-strong rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <th className="text-left p-4">Member</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-to-br from-[var(--electric)] to-[var(--neon)] grid place-items-center">
                      <UserIcon className="size-4 text-white" />
                    </div>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="p-4 text-foreground/80">{u.email}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs">
                    <Shield className="size-3 text-[var(--neon)]" /> {u.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(u.email, u.name)} 
                    disabled={u.email === auth.email}
                    className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit transition"
                    title="Remove"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.form 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleAdd}
              className="w-full max-w-md glass-strong rounded-3xl p-8 border border-white/10 space-y-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Team Member</div>
                  <h2 className="font-display text-2xl font-bold mt-1">Add new user</h2>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-white/10"><X className="size-5" /></button>
              </div>

              {err && <div className="text-xs text-[var(--neon)]">{err}</div>}

              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Full name</span>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                  placeholder="Aanya Sharma"
                  className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon)] transition" 
                />
              </label>

              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Email address</span>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                  placeholder="aanya@rentmyevent.com"
                  className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon)] transition" 
                />
              </label>

              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Role</span>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-2 w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon)] transition"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                </select>
              </label>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Cancel</button>
                <button type="submit" className="btn-glow px-6 py-2.5 rounded-xl text-sm font-semibold">Create user</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
