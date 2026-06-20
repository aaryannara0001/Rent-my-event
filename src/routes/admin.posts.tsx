import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, Eye, ExternalLink, X, Star, Loader2, Sparkles } from "lucide-react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { categories, platformLabels, type Platform, type Category, type Post, type PostStatus } from "@/lib/store";
import { useAdminGuard } from "@/lib/use-admin-guard";
import { getPostsFn, createPostFn, updatePostFn, deletePostFn, uploadMediaFn, createLogFn, fetchMetadataFn } from "@/lib/server-fns";
import { proxyThumbnail } from "@/lib/proxy-image";

export const Route = createFileRoute("/admin/posts")({
  head: () => ({ meta: [{ title: "Blog Posts — Rent My Event Admin" }, { name: "robots", content: "noindex" }] }),
  loader: async () => {
    const posts = await getPostsFn();
    return { posts };
  },
  component: AdminPostsPage,
});

type FormState = {
  title: string; excerpt: string; content: string; thumbnail: string;
  platform: Platform; category: Category; tags: string; externalUrl: string;
  status: PostStatus; featured: boolean;
};

const empty: FormState = {
  title: "", excerpt: "", content: "", thumbnail: "",
  platform: "instagram", category: "Weddings", tags: "", externalUrl: "",
  status: "draft", featured: false,
};

export function AdminPostsPage() {
  const auth = useAdminGuard();
  const { posts } = Route.useLoaderData();
  const router = useRouter();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [extractStatus, setExtractStatus] = useState<"idle" | "success" | "partial" | "blocked">("idle");

  const handleCreatePost = async (post: Omit<Post, "id" | "slug" | "createdAt" | "views">) => {
    await createPostFn({ data: post });
    if (auth) {
      await createLogFn({ data: { icon: "FileText", label: `Created post: ${post.title}`, who: auth.email } });
    }
    router.invalidate();
  };

  const handleUpdatePost = async (id: string, patch: Partial<Post>) => {
    await updatePostFn({ data: { id, patch } });
    if (auth) {
      await createLogFn({ data: { icon: "FileText", label: `Updated post: ${patch.title || 'Untitled'}`, who: auth.email } });
    }
    router.invalidate();
  };

  const handleDeletePost = async (id: string, title: string) => {
    await deletePostFn({ data: id });
    if (auth) {
      await createLogFn({ data: { icon: "Trash2", label: `Deleted post: ${title}`, who: auth.email } });
    }
    router.invalidate();
  };

  const [filter, setFilter] = useState<"all" | Platform>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<FormState>(empty);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (filter !== "all" && p.platform !== filter) return false;
      if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [posts, filter, query]);

  if (!auth) return null;

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };
  const openEdit = (p: Post) => {
    setEditing(p);
    setForm({
      title: p.title, excerpt: p.excerpt, content: p.content, thumbnail: p.thumbnail,
      platform: p.platform, category: p.category, tags: p.tags ? p.tags.join(", ") : "", externalUrl: p.externalUrl,
      status: p.status, featured: p.featured,
    });
    setOpen(true);
  };

  const handleUrlBlur = async (url: string) => {
    if (!url || !url.startsWith("http")) return;
    setFetchingMeta(true);
    try {
      const data = await fetchMetadataFn({ data: url });
      setForm((prev) => ({
        ...prev,
        title: prev.title || data.title || "",
        excerpt: prev.excerpt || data.excerpt || "",
        thumbnail: prev.thumbnail || data.thumbnail || "",
        platform: (data.platform as any) || prev.platform,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingMeta(false);
    }
  };

  const handleExtractDetails = async () => {
    const url = form.externalUrl;
    if (!url || !url.startsWith("http")) return;
    setFetchingMeta(true);
    setExtractStatus("idle");
    try {
      const data = await fetchMetadataFn({ data: url });
      const gotTitle = !!data.title;
      const gotThumbnail = !!data.thumbnail;
      setForm((prev) => ({
        ...prev,
        title: data.title || prev.title || "",
        excerpt: data.excerpt || prev.excerpt || "",
        thumbnail: data.thumbnail || prev.thumbnail || "",
        platform: (data.platform as any) || prev.platform,
      }));
      if (gotTitle && gotThumbnail) {
        setExtractStatus("success");
      } else if (gotTitle || gotThumbnail) {
        setExtractStatus("partial");
      } else {
        setExtractStatus("blocked");
      }
    } catch (err) {
      console.error(err);
      setExtractStatus("blocked");
    } finally {
      setFetchingMeta(false);
    }
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = String(reader.result);
        const res = await uploadMediaFn({ data: { filename: file.name, base64 } });
        setForm((f) => ({ ...f, thumbnail: res.url }));
        if (auth) {
          await createLogFn({ data: { icon: "Upload", label: `Uploaded post thumbnail: ${file.name}`, who: auth.email } });
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const thumbnail = form.thumbnail || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200";
    if (editing) {
      await handleUpdatePost(editing.id, { ...form, tags, thumbnail });
    } else {
      await handleCreatePost({ ...form, tags, thumbnail });
    }
    setOpen(false);
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Blog posts"
        subtitle="Curate the stories that appear across the public journal."
        actions={
          <button onClick={openNew} className="btn-glow px-4 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="size-4" /> New post
          </button>
        }
      />

      {/* filters */}
      <div className="glass-strong rounded-2xl p-4 flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full bg-transparent border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--neon)] transition"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "instagram", "facebook", "linkedin"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-medium transition ${
                filter === f
                  ? "bg-gradient-to-r from-[var(--electric)] to-[var(--neon)] text-white"
                  : "glass hover:bg-white/10 text-foreground/70"
              }`}
            >
              {f === "all" ? "All" : platformLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <th className="text-left p-4">Post</th>
                <th className="text-left p-4">Platform</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Views</th>
                <th className="text-left p-4">Date</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-12 text-center text-muted-foreground">No posts match.</td></tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={p.thumbnail} alt="" className="size-12 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium truncate flex items-center gap-2">
                          {p.featured && <Star className="size-3 text-[var(--gold)] fill-[var(--gold)]" />}
                          {p.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{p.excerpt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 capitalize text-foreground/80">{p.platform}</td>
                  <td className="p-3 text-foreground/80">{p.category}</td>
                  <td className="p-3">
                    <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      p.status === "published"
                        ? "bg-[var(--neon)]/20 text-[var(--neon)]"
                        : "bg-white/5 text-muted-foreground"
                    }`}>{p.status}</span>
                  </td>
                  <td className="p-3 text-foreground/70">{p.views.toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-white/10 transition" title="Preview">
                        <Eye className="size-4" />
                      </a>
                      <a href={p.externalUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-white/10 transition" title="External">
                        <ExternalLink className="size-4" />
                      </a>
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-white/10 transition" title="Edit">
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Delete "${p.title}"?`)) handleDeletePost(p.id, p.title); }}
                        className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition"
                        title="Delete"
                      >
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

      {/* DIALOG */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto"
            onClick={() => setOpen(false)}
          >
            <motion.form
              initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={onSubmit}
              className="my-10 w-full max-w-2xl glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{editing ? "Edit" : "Create"}</div>
                  <h2 className="font-display text-2xl font-bold mt-1">{editing ? "Edit post" : "New post"}</h2>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition">
                  <X className="size-5" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Select label="Platform" value={form.platform} onChange={(v) => setForm({ ...form, platform: v as Platform })} options={[
                  { v: "instagram", l: "Instagram" }, { v: "facebook", l: "Facebook" }, { v: "linkedin", l: "LinkedIn" },
                ]} />
                <Select label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v as Category })} options={categories.map((c) => ({ v: c, l: c }))} />
              </div>
              <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <Input label="Short excerpt" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} required />
              <Textarea label="Full content" value={form.content} onChange={(v) => setForm({ ...form, content: v })} rows={5} />
              <Input label="Tags (comma separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} placeholder="wedding, lighting, decor" />
              <div className="space-y-2">
                <Input label="External link" value={form.externalUrl} onChange={(v) => { setForm({ ...form, externalUrl: v }); setExtractStatus("idle"); }} onBlur={() => handleUrlBlur(form.externalUrl)} placeholder="https://instagram.com/p/... or youtube.com/watch?v=..." />
                <button
                  type="button"
                  onClick={handleExtractDetails}
                  disabled={!form.externalUrl || !form.externalUrl.startsWith("http") || fetchingMeta}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--neon)]/40 text-[var(--neon)] text-xs font-semibold uppercase tracking-widest hover:bg-[var(--neon)]/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {fetchingMeta ? (
                    <><Loader2 className="size-3.5 animate-spin" /> Extracting details...</>
                  ) : (
                    <><Sparkles className="size-3.5" /> Extract details from link</>
                  )}
                </button>
                {extractStatus === "success" && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 px-1">
                    <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
                    Details extracted successfully — title, excerpt &amp; thumbnail filled.
                  </div>
                )}
                {extractStatus === "partial" && (
                  <div className="flex items-center gap-2 text-xs text-amber-400 px-1">
                    <span className="size-1.5 rounded-full bg-amber-400 inline-block" />
                    Partial details extracted. Fill in the remaining fields manually.
                  </div>
                )}
                {extractStatus === "blocked" && (
                  <div className="flex items-center gap-2 text-xs text-rose-400 px-1">
                    <span className="size-1.5 rounded-full bg-rose-400 inline-block" />
                    This platform blocks automated extraction (Instagram/Facebook). Please fill in the title, excerpt &amp; thumbnail manually.
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Thumbnail</span>
                <div className="mt-2 flex items-center gap-3">
                  <label className="flex-1 cursor-pointer glass rounded-xl px-4 py-3 text-sm hover:bg-white/10 transition border border-white/10 flex items-center justify-center gap-2">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} disabled={uploadingImage} />
                    {uploadingImage && <Loader2 className="size-4 animate-spin text-[var(--neon)]" />}
                    {uploadingImage ? "Uploading..." : form.thumbnail ? "Replace image" : "Upload image"}
                  </label>
                  {form.thumbnail && <img src={proxyThumbnail(form.thumbnail)} alt="" className="size-14 rounded-lg object-cover" />}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Select label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v as PostStatus })} options={[
                  { v: "draft", l: "Draft" }, { v: "published", l: "Published" },
                ]} />
                <label className="flex items-center gap-3 mt-7 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="size-4 accent-[var(--neon)]" />
                  <span className="text-sm">Mark as featured</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 rounded-xl glass hover:bg-white/10 text-sm">
                  Cancel
                </button>
                <button type="submit" className="btn-glow px-6 py-2.5 rounded-xl text-sm font-semibold">
                  {editing ? "Save changes" : "Create post"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

function Input({ label, value, onChange, required, placeholder, onBlur }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; onBlur?: () => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} required={required} placeholder={placeholder} className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon)] transition" />
    </label>
  );
}
function Textarea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon)] transition resize-none" />
    </label>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon)] transition">
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
}
