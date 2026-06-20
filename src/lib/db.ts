import fs from "fs/promises";
import path from "path";

export type Platform = "instagram" | "facebook" | "linkedin";
export type Category = "Weddings" | "Corporate" | "Concerts" | "Lighting" | "LED Walls" | "Stage Design";
export type PostStatus = "published" | "draft";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  platform: Platform;
  category: Category;
  tags: string[];
  externalUrl: string;
  status: PostStatus;
  featured: boolean;
  views: number;
  createdAt: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  message: string;
  date: string;
  status: "new" | "completed";
  createdAt: string;
};

export type Settings = {
  publicEmail: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  studioName: string;
  tagline: string;
};

// Seed images (copied from store assets imports)
// Since we are running on the server, we can just use relative URLs/imports for client assets or direct paths
const seedPosts: Post[] = [
  {
    id: "p1", slug: "cinematic-mandap-jaipur",
    title: "A Cinematic Mandap Under the Jaipur Sky",
    excerpt: "Gold drapery, 360° projection, and a 12-piece live ensemble — a wedding production years in the making.",
    content: "Three days in Jaipur. Eighteen tons of rigging. A handcrafted mandap lit by 240 fixtures synchronised to a custom score. This is how we approached one of the most ambitious luxury weddings of the season — from concept to show-call.",
    thumbnail: "/src/assets/show-wedding.jpg", platform: "instagram", category: "Weddings",
    tags: ["wedding", "mandap", "luxury"], externalUrl: "https://instagram.com",
    status: "published", featured: true, views: 12400,
    createdAt: "2025-04-12T10:00:00.000Z",
  },
  {
    id: "p2", slug: "led-wall-summit-mumbai",
    title: "Curved LED Wall: Building a 40m Centerpiece",
    excerpt: "How we engineered a seamless 4K curved LED backdrop for a global tech summit in Mumbai.",
    content: "Three weeks of pre-production. A custom curved truss system. P2.5 modules colour-matched on-site. Here's the complete production breakdown.",
    thumbnail: "/src/assets/show-corporate.jpg", platform: "linkedin", category: "LED Walls",
    tags: ["corporate", "led", "summit"], externalUrl: "https://linkedin.com",
    status: "published", featured: true, views: 8800,
    createdAt: "2025-04-22T10:00:00.000Z",
  },
  {
    id: "p3", slug: "stadium-lasers-arjit",
    title: "Choreographing 32 Lasers for a Stadium Tour",
    excerpt: "Designing a laser show that's safe, breathtaking, and perfectly timed to every drop.",
    content: "32 RGB lasers. 60,000 audience members. One show-call cue list. We unpack the lighting design philosophy behind a full stadium-scale tour.",
    thumbnail: "/src/assets/show-concert.jpg", platform: "instagram", category: "Concerts",
    tags: ["concert", "lasers", "tour"], externalUrl: "https://instagram.com",
    status: "published", featured: true, views: 21500,
    createdAt: "2025-05-01T10:00:00.000Z",
  },
  {
    id: "p4", slug: "fashion-runway-bengaluru",
    title: "Runway, Reimagined: A Fashion Show in Light",
    excerpt: "A 60-meter mirrored runway, kinetic lighting, and a custom-built finale moment.",
    content: "Behind the scenes of a Bengaluru couture week show that pushed our kinetic rig further than any production before it.",
    thumbnail: "/src/assets/show-fashion.jpg", platform: "facebook", category: "Stage Design" as any,
    tags: ["fashion", "stage", "kinetic"], externalUrl: "https://facebook.com",
    status: "published", featured: false, views: 5400,
    createdAt: "2025-05-04T10:00:00.000Z",
  },
  {
    id: "p5", slug: "intimate-ceremony-goa",
    title: "An Intimate Ceremony on a Goan Cliff",
    excerpt: "Soft pastels, ambient string lighting, and a sunset that did most of the work.",
    content: "Sixty guests. One cliffside. A production approach designed to disappear into the landscape.",
    thumbnail: "/src/assets/gallery-1.jpg", platform: "instagram", category: "Weddings",
    tags: ["wedding", "destination", "intimate"], externalUrl: "https://instagram.com",
    status: "published", featured: false, views: 7600,
    createdAt: "2025-05-06T10:00:00.000Z",
  },
  {
    id: "p6", slug: "brand-launch-delhi",
    title: "A Brand Launch That Felt Like a Premiere",
    excerpt: "Tier-1 line array, an immersive product reveal, and a custom 9-screen LED façade.",
    content: "How we transformed a hotel ballroom into a cinema-grade product reveal experience for a global brand.",
    thumbnail: "/src/assets/gallery-2.jpg", platform: "linkedin", category: "Corporate",
    tags: ["corporate", "launch", "audio"], externalUrl: "https://linkedin.com",
    status: "published", featured: false, views: 4200,
    createdAt: "2025-05-08T10:00:00.000Z",
  },
  {
    id: "p7", slug: "festival-stage-lonavala",
    title: "A Modular Festival Stage in 72 Hours",
    excerpt: "Two stages, six bands, one production crew working around the clock.",
    content: "Our load-in/load-out playbook for a multi-stage music festival in Lonavala.",
    thumbnail: "/src/assets/gallery-3.jpg", platform: "facebook", category: "Concerts",
    tags: ["festival", "stage", "music"], externalUrl: "https://facebook.com",
    status: "published", featured: false, views: 3100,
    createdAt: "2025-05-09T10:00:00.000Z",
  },
  {
    id: "p8", slug: "color-story-gradient-lighting",
    title: "Color Stories: Gradient Lighting & Emotional Arcs",
    excerpt: "How we use color temperature shifts to guide an audience through a 4-hour ceremony.",
    content: "A practical guide to designing lighting that supports — not competes with — your storytelling.",
    thumbnail: "/src/assets/gallery-4.jpg", platform: "instagram", category: "Lighting",
    tags: ["lighting", "design", "color"], externalUrl: "https://instagram.com",
    status: "published", featured: false, views: 6700,
    createdAt: "2025-05-10T10:00:00.000Z",
  },
  {
    id: "p9", slug: "case-study-tech-summit",
    title: "Case Study: A 3-City Tech Summit Tour",
    excerpt: "Identical brand experience across Mumbai, Delhi, and Bengaluru — in 14 days.",
    content: "Logistics, crew planning, and the systems we built to ship a consistent show across three cities.",
    thumbnail: "/src/assets/gallery-5.jpg", platform: "linkedin", category: "Corporate",
    tags: ["case-study", "summit", "tour"], externalUrl: "https://linkedin.com",
    status: "published", featured: false, views: 2900,
    createdAt: "2025-05-11T10:00:00.000Z",
  },
  {
    id: "p10", slug: "behind-the-decor-wedding",
    title: "Behind the Decor: 11,000 Stems in 9 Hours",
    excerpt: "A floral install timelapse, plus the rigging plan that made it possible.",
    content: "A backstage look at the install process for a luxury wedding floral takeover.",
    thumbnail: "/src/assets/gallery-6.jpg", platform: "facebook", category: "Weddings",
    tags: ["wedding", "decor", "florals"], externalUrl: "https://facebook.com",
    status: "published", featured: false, views: 5800,
    createdAt: "2025-05-13T10:00:00.000Z",
  },
];

const seedInquiries: Inquiry[] = [
  { id: "i1", name: "Anaya Kapoor", email: "anaya@studio.in", phone: "+91 98 1100 2233", eventType: "Wedding", message: "Looking for a destination setup in Udaipur, December.", date: "2025-12-14", status: "new", createdAt: "2025-05-12T08:00:00.000Z" },
  { id: "i2", name: "Rohan Mehta", email: "rohan@nimbus.co", phone: "+91 98 7766 5544", eventType: "Corporate", message: "3-city brand summit. Need full AV + LED.", date: "2025-09-03", status: "new", createdAt: "2025-05-11T08:00:00.000Z" },
  { id: "i3", name: "Sonia Iyer", email: "sonia@artelive.com", phone: "+91 98 5544 1122", eventType: "Concert", message: "Festival stage rental for a 2-day event.", date: "2025-11-22", status: "completed", createdAt: "2025-05-09T08:00:00.000Z" },
];

export const defaultSettings: Settings = {
  publicEmail: "hello@rentmyevent.com",
  phone: "9625340107",
  address: "Pan-India Coverage",
  instagram: "https://instagram.com/rentmyevent",
  facebook: "https://facebook.com/rentmyevent",
  linkedin: "https://linkedin.com/company/rentmyevent",
  studioName: "Rent My Event",
  tagline: "Plan smartly. Organize perfectly. Execute flawlessly.",
};

class PromiseQueue {
  private queue: Promise<any> = Promise.resolve();
  add<T>(fn: () => Promise<T> | T): Promise<T> {
    const next = this.queue.then(fn);
    this.queue = next.catch(() => {});
    return next;
  }
}

const dbQueue = new PromiseQueue();
const DB_FILE = path.join(process.cwd(), "src", "data", "db.json");

type DatabaseSchema = {
  posts: Post[];
  inquiries: Inquiry[];
  settings: Settings;
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

async function ensureDbInitialized(): Promise<DatabaseSchema> {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    const schema = JSON.parse(data);
    let changed = false;
    if (!schema.settings) {
      schema.settings = defaultSettings;
      changed = true;
    }
    if (changed) {
      await saveDb(schema);
    }
    return schema;
  } catch (error) {
    // create dir
    await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
    // seed
    const schema: DatabaseSchema = {
      posts: seedPosts,
      inquiries: seedInquiries,
      settings: defaultSettings,
    };
    await fs.writeFile(DB_FILE, JSON.stringify(schema, null, 2), "utf-8");
    return schema;
  }
}

async function saveDb(schema: DatabaseSchema): Promise<void> {
  const tempFile = DB_FILE + ".tmp";
  await fs.writeFile(tempFile, JSON.stringify(schema, null, 2), "utf-8");
  await fs.rename(tempFile, DB_FILE);
}

export const db = {
  async getPosts(): Promise<Post[]> {
    return dbQueue.add(async () => {
      const schema = await ensureDbInitialized();
      return schema.posts;
    });
  },

  async getPostBySlug(slug: string): Promise<Post | null> {
    return dbQueue.add(async () => {
      const schema = await ensureDbInitialized();
      return schema.posts.find((p) => p.slug === slug) || null;
    });
  },

  async addPost(p: Omit<Post, "id" | "slug" | "createdAt" | "views">): Promise<Post> {
    return dbQueue.add(async () => {
      const schema = await ensureDbInitialized();
      const newPost: Post = {
        ...p,
        id: `p${Date.now()}`,
        slug: slugify(p.title) || `post-${Date.now()}`,
        views: 0,
        createdAt: new Date().toISOString(),
      };
      schema.posts.unshift(newPost);
      await saveDb(schema);
      return newPost;
    });
  },

  async updatePost(id: string, patch: Partial<Post>): Promise<Post | null> {
    return dbQueue.add(async () => {
      const schema = await ensureDbInitialized();
      let updatedPost: Post | null = null;
      schema.posts = schema.posts.map((p) => {
        if (p.id === id) {
          updatedPost = {
            ...p,
            ...patch,
            slug: patch.title ? slugify(patch.title) : p.slug,
          };
          return updatedPost;
        }
        return p;
      });
      if (updatedPost) {
        await saveDb(schema);
      }
      return updatedPost;
    });
  },

  async deletePost(id: string): Promise<boolean> {
    return dbQueue.add(async () => {
      const schema = await ensureDbInitialized();
      const originalLength = schema.posts.length;
      schema.posts = schema.posts.filter((p) => p.id !== id);
      const changed = schema.posts.length !== originalLength;
      if (changed) {
        await saveDb(schema);
      }
      return changed;
    });
  },

  async incrementPostView(id: string): Promise<void> {
    return dbQueue.add(async () => {
      const schema = await ensureDbInitialized();
      let changed = false;
      schema.posts = schema.posts.map((p) => {
        if (p.id === id) {
          changed = true;
          return { ...p, views: p.views + 1 };
        }
        return p;
      });
      if (changed) {
        await saveDb(schema);
      }
    });
  },

  async getInquiries(): Promise<Inquiry[]> {
    return dbQueue.add(async () => {
      const schema = await ensureDbInitialized();
      return schema.inquiries;
    });
  },

  async addInquiry(i: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<Inquiry> {
    return dbQueue.add(async () => {
      const schema = await ensureDbInitialized();
      const newInquiry: Inquiry = {
        ...i,
        id: `i${Date.now()}`,
        status: "new",
        createdAt: new Date().toISOString(),
      };
      schema.inquiries.unshift(newInquiry);
      await saveDb(schema);
      return newInquiry;
    });
  },

  async updateInquiry(id: string, patch: Partial<Inquiry>): Promise<Inquiry | null> {
    return dbQueue.add(async () => {
      const schema = await ensureDbInitialized();
      let updated: Inquiry | null = null;
      schema.inquiries = schema.inquiries.map((i) => {
        if (i.id === id) {
          updated = { ...i, ...patch };
          return updated;
        }
        return i;
      });
      if (updated) {
        await saveDb(schema);
      }
      return updated;
    });
  },

  async deleteInquiry(id: string): Promise<boolean> {
    return dbQueue.add(async () => {
      const schema = await ensureDbInitialized();
      const originalLength = schema.inquiries.length;
      schema.inquiries = schema.inquiries.filter((i) => i.id !== id);
      const changed = schema.inquiries.length !== originalLength;
      if (changed) {
        await saveDb(schema);
      }
      return changed;
    });
  },

  async getSettings(): Promise<Settings> {
    return dbQueue.add(async () => {
      const schema = await ensureDbInitialized();
      return schema.settings;
    });
  },

  async updateSettings(settings: Settings): Promise<Settings> {
    return dbQueue.add(async () => {
      const schema = await ensureDbInitialized();
      schema.settings = { ...schema.settings, ...settings };
      await saveDb(schema);
      return schema.settings;
    });
  },
};
