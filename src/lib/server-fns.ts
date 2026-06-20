import { createServerFn } from "@tanstack/react-start";
import type { Post, Inquiry, Settings } from "./db";

// Typings for new entities
export type User = {
  email: string;
  name: string;
  role: string;
  password?: string;
};

export type ActivityLog = {
  id: string;
  icon: string;
  label: string;
  who: string;
  createdAt: string;
};

export type MediaAsset = {
  id: string;
  filename: string;
  url: string;
  size: number;
  createdAt: string;
};

const PYTHON_URL = process.env["PYTHON_URL"] ?? "http://127.0.0.1:8000";


// ─────────────────────────────────────────────────────────────────────────────
// Helper: cast any server function to a typed callable so VS Code IntelliSense
// sees exact (opts: { data: TIn }) => Promise<TOut> without relying on TanStack
// Start's deep generic inference (which can lag in the language server).
// ─────────────────────────────────────────────────────────────────────────────
function typed<TIn, TOut>(fn: unknown): (opts: { data: TIn }) => Promise<TOut> {
  return fn as (opts: { data: TIn }) => Promise<TOut>;
}

// ─── POSTS ────────────────────────────────────────────────────────────────────

export const getPostsFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<Post[]> => {
    const res = await fetch(`${PYTHON_URL}/api/posts`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return await res.json();
  });

const _getPostBySlugFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<Post | null> => {
    const res = await fetch(`${PYTHON_URL}/api/posts/${slug}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch post by slug");
    return await res.json();
  });
export const getPostBySlugFn = typed<string, Post | null>(_getPostBySlugFn);

const _createPostFn = createServerFn({ method: "POST" })
  .validator((post: Omit<Post, "id" | "slug" | "createdAt" | "views">) => post)
  .handler(async ({ data: post }) => {
    const res = await fetch(`${PYTHON_URL}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    if (!res.ok) throw new Error("Failed to create post");
    return await res.json() as Post;
  });
export const createPostFn = typed<Omit<Post, "id" | "slug" | "createdAt" | "views">, Post>(_createPostFn);

const _updatePostFn = createServerFn({ method: "POST" })
  .validator((input: { id: string; patch: Partial<Post> }) => input)
  .handler(async ({ data: { id, patch } }) => {
    const res = await fetch(`${PYTHON_URL}/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error("Failed to update post");
    return await res.json() as Post;
  });
export const updatePostFn = typed<{ id: string; patch: Partial<Post> }, Post>(_updatePostFn);

const _deletePostFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const res = await fetch(`${PYTHON_URL}/api/posts/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete post");
    return await res.json();
  });
export const deletePostFn = typed<string, void>(_deletePostFn);

const _incrementPostViewFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const res = await fetch(`${PYTHON_URL}/api/posts/${id}/view`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to increment post view");
    return await res.json();
  });
export const incrementPostViewFn = typed<string, void>(_incrementPostViewFn);

// ─── INQUIRIES ────────────────────────────────────────────────────────────────

export const getInquiriesFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<Inquiry[]> => {
    const res = await fetch(`${PYTHON_URL}/api/inquiries`);
    if (!res.ok) throw new Error("Failed to fetch inquiries");
    return await res.json();
  });

const _createInquiryFn = createServerFn({ method: "POST" })
  .validator((inquiry: Omit<Inquiry, "id" | "createdAt" | "status">) => inquiry)
  .handler(async ({ data: inquiry }) => {
    const res = await fetch(`${PYTHON_URL}/api/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry),
    });
    if (!res.ok) throw new Error("Failed to create inquiry");
    return await res.json() as Inquiry;
  });
export const createInquiryFn = typed<Omit<Inquiry, "id" | "createdAt" | "status">, Inquiry>(_createInquiryFn);

const _updateInquiryFn = createServerFn({ method: "POST" })
  .validator((input: { id: string; patch: Partial<Inquiry> }) => input)
  .handler(async ({ data: { id, patch } }) => {
    const res = await fetch(`${PYTHON_URL}/api/inquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error("Failed to update inquiry");
    return await res.json() as Inquiry;
  });
export const updateInquiryFn = typed<{ id: string; patch: Partial<Inquiry> }, Inquiry>(_updateInquiryFn);

const _deleteInquiryFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const res = await fetch(`${PYTHON_URL}/api/inquiries/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete inquiry");
    return await res.json();
  });
export const deleteInquiryFn = typed<string, void>(_deleteInquiryFn);

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

export const getSettingsFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<Settings> => {
    const res = await fetch(`${PYTHON_URL}/api/settings`);
    if (!res.ok) throw new Error("Failed to fetch settings");
    return await res.json();
  });

const _updateSettingsFn = createServerFn({ method: "POST" })
  .validator((settings: Settings) => settings)
  .handler(async ({ data: settings }) => {
    const res = await fetch(`${PYTHON_URL}/api/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error("Failed to update settings");
    return await res.json() as Settings;
  });
export const updateSettingsFn = typed<Settings, Settings>(_updateSettingsFn);

// ─── USERS ────────────────────────────────────────────────────────────────────

export const getUsersFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<User[]> => {
    const res = await fetch(`${PYTHON_URL}/api/users`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
  });

const _createUserFn = createServerFn({ method: "POST" })
  .validator((user: User) => user)
  .handler(async ({ data: user }) => {
    const res = await fetch(`${PYTHON_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return await res.json() as User;
  });
export const createUserFn = typed<User, User>(_createUserFn);

const _updateUserFn = createServerFn({ method: "POST" })
  .validator((input: { email: string; user: User }) => input)
  .handler(async ({ data: { email, user } }) => {
    const res = await fetch(`${PYTHON_URL}/api/users/${email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Failed to update user");
    return await res.json() as User;
  });
export const updateUserFn = typed<{ email: string; user: User }, User>(_updateUserFn);

const _deleteUserFn = createServerFn({ method: "POST" })
  .validator((email: string) => email)
  .handler(async ({ data: email }) => {
    const res = await fetch(`${PYTHON_URL}/api/users/${email}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete user");
    return await res.json();
  });
export const deleteUserFn = typed<string, void>(_deleteUserFn);

// ─── LOGS ─────────────────────────────────────────────────────────────────────

export const getLogsFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<ActivityLog[]> => {
    const res = await fetch(`${PYTHON_URL}/api/logs`);
    if (!res.ok) throw new Error("Failed to fetch logs");
    return await res.json();
  });

const _createLogFn = createServerFn({ method: "POST" })
  .validator((log: Omit<ActivityLog, "id" | "createdAt">) => log)
  .handler(async ({ data: log }) => {
    const res = await fetch(`${PYTHON_URL}/api/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });
    if (!res.ok) throw new Error("Failed to create log");
    return await res.json() as ActivityLog;
  });
export const createLogFn = typed<Omit<ActivityLog, "id" | "createdAt">, ActivityLog>(_createLogFn);

// ─── MEDIA ────────────────────────────────────────────────────────────────────

export const getMediaFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<MediaAsset[]> => {
    const res = await fetch(`${PYTHON_URL}/api/media`);
    if (!res.ok) throw new Error("Failed to fetch media assets");
    const list: MediaAsset[] = await res.json();
    return list.map(m => ({
      ...m,
      url: m.url.startsWith("http") ? m.url : `${PYTHON_URL}${m.url}`
    }));
  });

const _uploadMediaFn = createServerFn({ method: "POST" })
  .validator((input: { filename: string; base64: string }) => input)
  .handler(async ({ data }): Promise<MediaAsset> => {
    const { filename, base64 } = data;
    const buffer = Buffer.from(base64.split(",")[1] || base64, "base64");
    const formData = new FormData();
    const blob = new Blob([buffer]);
    formData.append("file", blob, filename);
    const res = await fetch(`${PYTHON_URL}/api/media/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload media to Python API");
    const m: MediaAsset = await res.json();
    return { ...m, url: m.url.startsWith("http") ? m.url : `${PYTHON_URL}${m.url}` };
  });
export const uploadMediaFn = typed<{ filename: string; base64: string }, MediaAsset>(_uploadMediaFn);

const _deleteMediaFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const res = await fetch(`${PYTHON_URL}/api/media/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete media asset");
    return await res.json();
  });
export const deleteMediaFn = typed<string, void>(_deleteMediaFn);

// ─── METADATA ─────────────────────────────────────────────────────────────────

export type MetadataResult = {
  title: string;
  excerpt: string;
  thumbnail: string;
  platform: string;
};

const _fetchMetadataFn = createServerFn({ method: "GET" })
  .validator((url: string) => url)
  .handler(async ({ data: url }) => {
    const res = await fetch(`${PYTHON_URL}/api/posts/fetch-metadata?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error("Failed to fetch metadata");
    return await res.json() as MetadataResult;
  });
export const fetchMetadataFn = typed<string, MetadataResult>(_fetchMetadataFn);
