import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, ArrowUpRight, Mail, Lock } from "lucide-react";
import { Aurora } from "@/components/site/Aurora";
import { Particles } from "@/components/site/Particles";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Rent My Event" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLoginPage,
});

export function AdminLoginPage() {
  const login = useStore((s) => s.login);
  const auth = useStore((s) => s.auth);
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@rentmyevent.com");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [forgot, setForgot] = useState(false);

  useEffect(() => {
    if (auth) navigate({ to: "/admin" });
  }, [auth, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const ok = login(email.trim(), password);
    if (!ok) setErr("Invalid credentials. Use any email and a password of 4+ characters.");
    else navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen relative overflow-hidden grid place-items-center px-5 py-10">
      <Aurora />
      <Particles count={24} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-8 sm:p-10 border border-white/5">
          <Link to="/" className="flex items-center gap-2.5 mb-7">
            <div className="size-11 rounded-xl bg-gradient-to-br from-[var(--electric)] via-[var(--neon)] to-[var(--cyan-glow)] grid place-items-center shadow-[0_0_30px_-5px_var(--neon)]">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-none">RENT MY EVENT</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Admin Studio</div>
            </div>
          </Link>

          {forgot ? (
            <>
              <h1 className="font-display text-3xl font-bold">Reset password</h1>
              <p className="text-sm text-foreground/65 mt-2">Enter your admin email — a reset link will be sent within minutes.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgot(false);
                  setErr("Check your inbox — reset instructions sent.");
                }}
                className="mt-7 space-y-4"
              >
                <Field icon={Mail} label="Admin email" type="email" value={email} onChange={setEmail} />
                <button className="btn-glow w-full px-5 py-3.5 rounded-2xl font-semibold inline-flex items-center justify-center gap-2">
                  Send reset link <ArrowUpRight className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setForgot(false)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition"
                >
                  Back to sign in
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold">Welcome back</h1>
              <p className="text-sm text-foreground/65 mt-2">Sign in to manage stories, media and inquiries.</p>
              <form onSubmit={onSubmit} className="mt-7 space-y-4">
                <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} />
                <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
                {err && <div className="text-xs text-[var(--neon)]">{err}</div>}
                <button className="btn-glow w-full px-5 py-3.5 rounded-2xl font-semibold inline-flex items-center justify-center gap-2">
                  Sign in <ArrowUpRight className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setForgot(true)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition"
                >
                  Forgot password?
                </button>
              </form>
            </>
          )}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-5">
          Demo: any email · password length 4+
        </p>
      </motion.div>
    </div>
  );
}

function Field({
  icon: Icon, label, type = "text", value, onChange, placeholder,
}: {
  icon: typeof Mail; label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      <div className="mt-2 relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--neon)] transition"
        />
      </div>
    </label>
  );
}
