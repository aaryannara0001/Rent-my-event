import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { useAdminGuard } from "@/lib/use-admin-guard";
import { getSettingsFn, updateSettingsFn } from "@/lib/server-fns";
import { Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Rent My Event Admin" }, { name: "robots", content: "noindex" }] }),
  loader: async () => {
    const settings = await getSettingsFn();
    return { settings };
  },
  component: SettingsPage,
});

export function SettingsPage() {
  const auth = useAdminGuard();
  const { settings } = Route.useLoaderData();
  const router = useRouter();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!auth) return null;

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateSettingsFn({ data: formData });
      router.invalidate();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof typeof settings, val: string) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <AdminLayout>
      <AdminPageHeader title="Settings" subtitle="Studio identity, contact details and admin preferences." />
      <div className="grid lg:grid-cols-2 gap-5">
        <Section title="Contact information">
          <Field label="Public email" value={formData.publicEmail} onChange={(v) => updateField("publicEmail", v)} />
          <Field label="Phone" value={formData.phone} onChange={(v) => updateField("phone", v)} />
          <Field label="Studio addresses" value={formData.address} onChange={(v) => updateField("address", v)} />
        </Section>
        <Section title="Social media links">
          <Field label="Instagram" value={formData.instagram} onChange={(v) => updateField("instagram", v)} />
          <Field label="Facebook" value={formData.facebook} onChange={(v) => updateField("facebook", v)} />
          <Field label="LinkedIn" value={formData.linkedin} onChange={(v) => updateField("linkedin", v)} />
        </Section>
        <Section title="Branding">
          <Field label="Studio name" value={formData.studioName} onChange={(v) => updateField("studioName", v)} />
          <Field label="Tagline" value={formData.tagline} onChange={(v) => updateField("tagline", v)} />
        </Section>
        <Section title="Change password">
          <Field label="Current password" type="password" value="" onChange={() => {}} />
          <Field label="New password" type="password" value="" onChange={() => {}} />
          <Field label="Confirm new password" type="password" value="" onChange={() => {}} />
        </Section>
      </div>
      <div className="flex items-center justify-end gap-4 mt-6">
        {saved && (
          <span className="text-xs text-[var(--neon)] flex items-center gap-1">
            <Check className="size-4" /> Settings saved successfully
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-glow px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </AdminLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-strong rounded-2xl p-6 space-y-4">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon)] transition"
      />
    </label>
  );
}
