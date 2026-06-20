import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, X, Trash2, Copy, Check, FileIcon, Loader2 } from "lucide-react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { useAdminGuard } from "@/lib/use-admin-guard";
import { getMediaFn, uploadMediaFn, deleteMediaFn, createLogFn } from "@/lib/server-fns";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin/media")({
  head: () => ({ meta: [{ title: "Media Library — Rent My Event Admin" }, { name: "robots", content: "noindex" }] }),
  loader: async () => {
    const media = await getMediaFn();
    return { media };
  },
  component: MediaPage,
});

export function MediaPage() {
  const auth = useAdminGuard();
  const { media } = Route.useLoaderData();
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!auth) return null;

  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = String(reader.result);
        await uploadMediaFn({ data: { filename: file.name, base64 } });
        await createLogFn({
          data: {
            icon: "Upload",
            label: `Uploaded media: ${file.name}`,
            who: auth.email,
          },
        });
        router.invalidate();
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert("Failed to upload media asset");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (confirm(`Are you sure you want to delete "${filename}"?`)) {
      try {
        await deleteMediaFn({ data: id });
        await createLogFn({
          data: {
            icon: "Trash2",
            label: `Deleted media: ${filename}`,
            who: auth.email,
          },
        });
        router.invalidate();
      } catch (err) {
        alert("Failed to delete media asset");
      }
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const isImageFile = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext || "");
  };

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Media library" 
        subtitle="Upload, search and organise the studio's visual library." 
      />

      {/* Upload Drop Zone */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleUpload(file);
        }}
        className={`gradient-border rounded-3xl p-10 text-center mb-8 transition-colors ${
          isDragOver ? "bg-[var(--electric)]/10 border-[var(--neon)]" : "glass hover:bg-white/[0.02]"
        }`}
      >
        <div className="size-12 rounded-2xl mx-auto bg-gradient-to-br from-[var(--electric)]/30 to-[var(--neon)]/30 grid place-items-center mb-4 text-[var(--neon)]">
          {uploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
        </div>
        <h3 className="font-display text-lg font-bold">
          {uploading ? "Uploading media file..." : "Drag & drop files here"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 mb-4">Support images, SVGs, or event visual mockups</p>
        <label className="btn-glow px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer">
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }} 
          />
          Choose File
        </label>
      </div>

      {/* Grid List */}
      {media.length === 0 ? (
        <div className="glass-strong rounded-3xl p-16 text-center text-muted-foreground">
          No media assets uploaded yet. Try adding some event mockups!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          <AnimatePresence>
            {media.map((asset) => (
              <motion.div 
                key={asset.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass rounded-2xl border border-white/5 overflow-hidden group relative flex flex-col justify-between"
              >
                {/* Image Preview or Icon */}
                <div className="aspect-square bg-black/40 relative grid place-items-center overflow-hidden border-b border-white/5">
                  {isImageFile(asset.filename) ? (
                    <img 
                      src={asset.url} 
                      alt={asset.filename} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <FileIcon className="size-10 text-muted-foreground" />
                  )}

                  {/* Actions overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => copyUrl(asset.id, asset.url)} 
                      className="size-9 rounded-lg bg-white/10 hover:bg-white/20 text-white grid place-items-center transition"
                      title="Copy URL"
                    >
                      {copiedId === asset.id ? <Check className="size-4 text-[var(--neon)]" /> : <Copy className="size-4" />}
                    </button>
                    <button 
                      onClick={() => handleDelete(asset.id, asset.filename)} 
                      className="size-9 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 grid place-items-center transition"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 min-w-0">
                  <div className="text-xs font-semibold truncate" title={asset.filename}>
                    {asset.filename}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1 flex justify-between">
                    <span>{formatSize(asset.size)}</span>
                    <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </AdminLayout>
  );
}
