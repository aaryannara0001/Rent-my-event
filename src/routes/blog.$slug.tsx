import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Calendar, Eye, Instagram, Facebook, Linkedin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Aurora } from "@/components/site/Aurora";
import { getPostBySlugFn, getPostsFn, incrementPostViewFn } from "@/lib/server-fns";
import type { Platform } from "@/lib/store";
import { useEffect } from "react";
import { proxyThumbnail } from "@/lib/proxy-image";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params: { slug } }) => {
    const post = await getPostBySlugFn({ data: slug });
    if (!post) throw notFound();
    // Increment view count on the server
    await incrementPostViewFn({ data: post.id });
    const allPosts = await getPostsFn();
    return { post, allPosts };
  },
  component: BlogDetailsPage,
});

type PlatformMeta = Record<Platform, { Icon: typeof Instagram; label: string }>;

function BlogDetailsPage() {
  const { post, allPosts } = Route.useLoaderData();

  useEffect(() => {
    if (post.externalUrl) {
      window.location.replace(post.externalUrl);
    }
  }, [post.externalUrl]);

  const related = allPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.platform === post.platform))
    .slice(0, 3);

  const platformMeta: PlatformMeta = {
    instagram: { Icon: Instagram, label: "View on Instagram" },
    facebook: { Icon: Facebook, label: "View on Facebook" },
    linkedin: { Icon: Linkedin, label: "View on LinkedIn" },
  };
  const { Icon: PIcon, label: pLabel } = platformMeta[post.platform];

  return (
    <SiteLayout>
      <article className="relative pt-32 pb-20">
        <Aurora />
        <div className="relative mx-auto max-w-5xl px-5">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8">
            <ArrowLeft className="size-4" /> Back to journal
          </Link>
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{post.category}</div>
          <h1 className="font-display mt-4 text-4xl sm:text-6xl font-bold leading-[1.05] tracking-tight">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Calendar className="size-4" /> {new Date(post.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}</span>
            <span className="inline-flex items-center gap-2"><Eye className="size-4" /> {post.views.toLocaleString()} views</span>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mt-10 relative gradient-border overflow-hidden rounded-3xl"
          >
            <img src={proxyThumbnail(post.thumbnail)} alt={post.title} className="w-full aspect-[16/9] object-cover" />
          </motion.div>

          <div className="mt-12 grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-6 text-lg text-foreground/85 leading-relaxed">
              <p className="text-2xl text-foreground/90 font-light leading-relaxed">{post.excerpt}</p>
              <p>{post.content}</p>
              <p>
                Every Rent My Event production starts with a single question — what should the audience
                feel? From there we work backwards through design, styling, staging, and coordination to
                build a sequence of moments that earn the emotion the brief asked for.
              </p>
              <h2 className="font-display text-3xl font-bold pt-6">Behind the build</h2>
              <p>
                Our production team specialises in tightly choreographed multi-day installs, with
                show-call timelines synchronised across crew, talent and clients. The result is a
                premium experience that lands precisely on cue — every cue.
              </p>
              <div className="flex flex-wrap gap-2 pt-6">
                {post.tags.map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-full glass text-xs uppercase tracking-widest">#{t}</span>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-5">
              <div className="glass-strong rounded-3xl p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Originally posted on</div>
                <a href={post.externalUrl} target="_blank" rel="noreferrer" className="btn-glow w-full px-5 py-3.5 rounded-2xl font-semibold inline-flex items-center justify-center gap-2">
                  <PIcon className="size-4" /> {pLabel} <ArrowUpRight className="size-4" />
                </a>
              </div>
              <div className="glass rounded-3xl p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Plan something similar</div>
                <p className="text-sm text-foreground/75 mb-4">Tell us about your event and we'll architect the production around it.</p>
                <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--neon)] hover:gap-3 transition-all">
                  Start a brief <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </aside>
          </div>

          {/* Gallery */}
          <div className="mt-20">
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-6">From the production</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[post.thumbnail, ...allPosts.slice(0, 5).map((p) => p.thumbnail)].slice(0, 6).map((src, i) => (
                <div key={i} className="relative overflow-hidden rounded-2xl gradient-border aspect-[4/3] group">
                  <img src={proxyThumbnail(src)} alt="" className="size-full object-cover group-hover:scale-110 transition duration-1000" />
                </div>
              ))}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-24">
              <h3 className="font-display text-2xl sm:text-3xl font-bold mb-6">Related stories</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group gradient-border overflow-hidden block">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={proxyThumbnail(p.thumbnail)} alt={p.title} className="size-full object-cover group-hover:scale-110 transition duration-1000" />
                    </div>
                    <div className="p-5">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.category}</div>
                      <h4 className="mt-2 font-display text-lg font-bold leading-tight">{p.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </SiteLayout>
  );
}
