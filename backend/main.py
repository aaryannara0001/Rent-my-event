from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import uuid
import json
import shutil
import urllib.request
import urllib.parse
import re
import sqlite3
from datetime import datetime
from database import get_db_connection, init_db, UPLOADS_DIR

# Ensure DB is initialized
init_db()

app = FastAPI(title="Rent My Event Backend API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads static files
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Pydantic Schemas
class SettingsSchema(BaseModel):
    publicEmail: str
    phone: str
    address: str
    instagram: str
    facebook: str
    linkedin: str
    studioName: str
    tagline: str

class UserSchema(BaseModel):
    email: str
    name: str
    role: str
    password: Optional[str] = "password"

class PostCreateSchema(BaseModel):
    title: str
    excerpt: str
    content: str
    thumbnail: str
    platform: str
    category: str
    tags: List[str]
    externalUrl: str
    status: str
    featured: bool

class PostUpdateSchema(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    thumbnail: Optional[str] = None
    platform: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    externalUrl: Optional[str] = None
    status: Optional[str] = None
    featured: Optional[bool] = None

class InquiryCreateSchema(BaseModel):
    name: str
    email: str
    phone: str
    eventType: str
    message: str
    date: str

class InquiryUpdateSchema(BaseModel):
    status: str

class LogCreateSchema(BaseModel):
    icon: str
    label: str
    who: str

# Helper to format row dicts
def row_to_dict(row):
    d = dict(row)
    if "tags" in d and d["tags"]:
        try:
            d["tags"] = json.loads(d["tags"])
        except:
            d["tags"] = []
    if "featured" in d:
        d["featured"] = bool(d["featured"])
    return d

# Helper to extract meta tags using regex
def extract_meta(html: str, property_name: str) -> Optional[str]:
    pattern_prop_first = rf'<meta\s+[^>]*?(?:property|name)=["\']{property_name}["\']\s+[^>]*?content=["\'](.*?)["\']'
    match = re.search(pattern_prop_first, html, re.IGNORECASE)
    if not match:
        pattern_content_first = rf'<meta\s+[^>]*?content=["\'](.*?)["\']\s+[^>]*?(?:property|name)=["\']{property_name}["\']'
        match = re.search(pattern_content_first, html, re.IGNORECASE)
    return match.group(1) if match else None

def extract_title(html: str) -> Optional[str]:
    match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
    return match.group(1) if match else None

def download_and_cache_image(image_url: str, request_headers: dict) -> Optional[str]:
    """Download an external image server-side and save it to our uploads dir.
    Returns a local /uploads/... URL so the browser never has to hit the CDN directly.
    This avoids Instagram/Facebook CORP (Cross-Origin-Resource-Policy) blocking."""
    try:
        req = urllib.request.Request(image_url, headers=request_headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            image_data = resp.read()
            content_type = resp.headers.get('Content-Type', 'image/jpeg')

        # Pick extension from content-type
        ext = 'jpg'
        if 'png' in content_type:
            ext = 'png'
        elif 'webp' in content_type:
            ext = 'webp'

        filename = f"cached_{uuid.uuid4().hex[:16]}.{ext}"
        filepath = os.path.join(UPLOADS_DIR, filename)
        with open(filepath, 'wb') as f:
            f.write(image_data)

        return f"/uploads/{filename}"
    except Exception:
        return None

from fastapi.responses import Response as FastAPIResponse

@app.get("/api/proxy-image")
def proxy_image(url: str):
    """Proxy external images (Instagram/Facebook CDN) through our server.
    Instagram CDN sets Cross-Origin-Resource-Policy: same-origin which blocks
    browsers from loading them directly. This endpoint fetches the image
    server-side and re-serves it with permissive headers."""
    try:
        proxy_headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.instagram.com/',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        }
        req = urllib.request.Request(url, headers=proxy_headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read()
            content_type = resp.headers.get('Content-Type', 'image/jpeg')
        return FastAPIResponse(
            content=content,
            media_type=content_type,
            headers={
                'Cache-Control': 'public, max-age=86400',
                'Access-Control-Allow-Origin': '*',
                'Cross-Origin-Resource-Policy': 'cross-origin',
            }
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Could not proxy image: {str(e)}")

@app.get("/api/posts/fetch-metadata")
def fetch_metadata(url: str):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }

    # Detect platform from domain
    platform = "instagram"
    if "facebook.com" in url:
        platform = "facebook"
    elif "linkedin.com" in url:
        platform = "linkedin"
    elif "instagram.com" in url:
        platform = "instagram"

    title = ""
    excerpt = ""
    thumbnail = ""

    # ── YouTube: oEmbed API (no API key needed) + maxres thumbnail ──
    if "youtube.com" in url or "youtu.be" in url:
        try:
            oembed_endpoint = f"https://www.youtube.com/oembed?url={urllib.parse.quote(url, safe='')}&format=json"
            req = urllib.request.Request(oembed_endpoint, headers=headers)
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                title = data.get("title", "")
                author = data.get("author_name", "")
                excerpt = f"A YouTube video by {author}" if author else "A YouTube video"
        except Exception:
            pass

        # Extract video ID for maxresdefault thumbnail
        video_id = None
        if "youtube.com/watch" in url:
            m = re.search(r'v=([^&#\s]+)', url)
            if m:
                video_id = m.group(1)
        elif "youtube.com/shorts" in url:
            m = re.search(r'/shorts/([^?#\s]+)', url)
            if m:
                video_id = m.group(1)
        elif "youtu.be/" in url:
            m = re.search(r'youtu\.be/([^?#\s]+)', url)
            if m:
                video_id = m.group(1)

        if video_id:
            thumbnail = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"

        # Proxy YouTube thumbnail through our server to avoid CORS issues
        if thumbnail:
            local = download_and_cache_image(thumbnail, headers)
            if local:
                thumbnail = f"http://127.0.0.1:8000{local}"

        return {"title": title, "excerpt": excerpt, "thumbnail": thumbnail, "platform": "instagram"}

    # ── Instagram: multi-strategy scraper ──
    if "instagram.com" in url:
        # Extract shortcode from /p/, /reel/, /tv/ paths
        shortcode_match = re.search(r'instagram\.com/(?:p|reel|tv)/([^/?&#\s]+)', url)
        shortcode = shortcode_match.group(1) if shortcode_match else None

        if shortcode:
            embed_headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Referer': 'https://www.instagram.com/',
                'Sec-Fetch-Dest': 'iframe',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
            }

            for embed_path in [
                f"/reel/{shortcode}/embed/captioned/",
                f"/p/{shortcode}/embed/captioned/",
                f"/reel/{shortcode}/embed/",
                f"/p/{shortcode}/embed/",
            ]:
                try:
                    embed_url = f"https://www.instagram.com{embed_path}"
                    req = urllib.request.Request(embed_url, headers=embed_headers)
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        html = resp.read().decode('utf-8', errors='ignore')

                    # Extract actual post thumbnail (t51.82787-15 = post media, not profile pic)
                    # Use fna.fbcdn.net URLs which are actual CDN media, not static icons
                    media_imgs = re.findall(
                        r'https://instagram\.[^\s"\'\\]*\.fna\.fbcdn\.net/v/t51\.82787-15/[^\s"\'\\]*\.(?:jpg|jpeg|png|webp)[^\s"\'\\]*',
                        html
                    )
                    if media_imgs:
                        # Pick the highest resolution one (prefer larger stp size params)
                        def img_score(u):
                            m = re.search(r's(\d+)x(\d+)', u)
                            return int(m.group(1)) * int(m.group(2)) if m else 0
                        media_imgs.sort(key=img_score, reverse=True)
                        thumbnail = media_imgs[0].replace('&amp;', '&')

                    # ── Extract actual caption from the embed page ──

                    # Strategy A: Caption is JSON-embedded in edge_media_to_caption
                    cap_json = re.search(
                        r'edge_media_to_caption\\+":\s*{\\+"edges\\+":\s*\[{\\+"node\\+":\s*{\\+"text\\+":\\+"((?:[^"\\\\]|\\\\.)*)\\+"',
                        html
                    )
                    if not cap_json:
                        # Try with double-escaped form inside the JS payload
                        cap_json = re.search(
                            r'edge_media_to_caption\\":\{\\"edges\\":\[\{\\"node\\":\{\\"text\\":\\"((?:[^"\\\\]|\\\\.)*)\\"',
                            html
                        )
                    if cap_json:
                        raw_cap = cap_json.group(1)
                        # Unescape \n, \\n, Unicode escapes
                        caption_text = raw_cap.replace('\\\\n', '\n').replace('\\n', '\n').replace('\\"', '"')
                        caption_lines = [l.strip() for l in caption_text.split('\n') if l.strip()]
                        if caption_lines:
                            title = caption_lines[0][:120]
                            # First few meaningful lines as excerpt (skip phone numbers / hashtag lines)
                            body_lines = [l for l in caption_lines[1:] if l and not l.startswith('#') and not l.startswith('Call')]
                            excerpt = ' '.join(body_lines[:3])[:300]

                    # Strategy B: Caption as rendered HTML (has <br />, &amp; etc.)
                    if not title:
                        # Pattern: after username link anchor, text before first hashtag anchor
                        cap_html = re.search(
                            r'data-log-event="captionProfileClick"[^>]*>[^<]+</a>(?:<br\s*/>)+(.+?)(?=<a href="/explore/tags/|$)',
                            html, re.DOTALL
                        )
                        if cap_html:
                            raw = cap_html.group(1)
                            # Strip HTML tags and normalize
                            clean = re.sub(r'<br\s*/?>', '\n', raw)
                            clean = re.sub(r'<[^>]+>', '', clean)
                            clean = clean.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').strip()
                            lines = [l.strip() for l in clean.split('\n') if l.strip()]
                            if lines:
                                title = lines[0][:120]
                                body = [l for l in lines[1:] if not l.startswith('#') and not l.startswith('Call')]
                                excerpt = ' '.join(body[:3])[:300]

                    # Extract username (for title prefix if no caption)
                    uname_matches = re.findall(r'instagram\.com/([a-zA-Z0-9_.]{2,30})/', html)
                    skip = {'rsrc.php', 'reel', 'p', 'tv', 'stories', 'explore', 'static', 'accounts'}
                    usernames = [u for u in uname_matches if u not in skip and not u.startswith('rsrc')]
                    uname = usernames[0] if usernames else None

                    # Fallback: use username-based title if no caption found
                    if not title and uname:
                        title = f"Instagram post by @{uname}"
                    if not excerpt and uname:
                        excerpt = f"Posted by @{uname} on Instagram"


                    # OG tags (embed page sometimes has them)
                    og_title = extract_meta(html, "og:title")
                    og_desc = extract_meta(html, "og:description")
                    if og_title and not title:
                        title = og_title.strip()
                    if og_desc and not excerpt:
                        excerpt = og_desc.strip()

                    if thumbnail:
                        # Proxy the CDN image through our server to bypass CORP/CORS blocking
                        local = download_and_cache_image(thumbnail, embed_headers)
                        if local:
                            thumbnail = f"http://127.0.0.1:8000{local}"
                        break
                except Exception:
                    continue

        # Strategy 2: Fallback — try oEmbed API (may need auth, but worth a shot)
        if not thumbnail:
            try:
                clean_url = re.sub(r'[?&]utm_[^&]*', '', url).rstrip('?&')
                clean_url = re.sub(r'[?&]igsh[^&]*', '', clean_url).rstrip('?&')
                oembed_endpoint = f"https://api.instagram.com/oembed/?url={urllib.parse.quote(clean_url, safe='')}"
                req = urllib.request.Request(oembed_endpoint, headers=headers)
                with urllib.request.urlopen(req, timeout=8) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    author = data.get("author_name", "")
                    if not title:
                        title = data.get("title", "") or (f"Instagram post by @{author}" if author else "")
                    if not excerpt:
                        excerpt = f"Posted by @{author} on Instagram" if author else "Instagram post"
                    if not thumbnail:
                        thumbnail = data.get("thumbnail_url", "")
            except Exception:
                pass

        # Proxy oEmbed thumbnail if we got one
        if thumbnail and thumbnail.startswith('http') and 'fbcdn' in thumbnail:
            local = download_and_cache_image(thumbnail, headers)
            if local:
                thumbnail = f"http://127.0.0.1:8000{local}"

        return {"title": title, "excerpt": excerpt, "thumbnail": thumbnail, "platform": "instagram"}

    # ── Generic OG tag scraper (Facebook, LinkedIn, etc.) ──
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as response:
            html = response.read().decode('utf-8', errors='ignore')

        title = extract_meta(html, "og:title") or extract_title(html) or ""
        excerpt = extract_meta(html, "og:description") or extract_meta(html, "description") or ""
        thumbnail = extract_meta(html, "og:image") or ""

        if title:
            title = title.strip()
        if excerpt:
            excerpt = excerpt.strip()

        return {
            "title": title,
            "excerpt": excerpt,
            "thumbnail": thumbnail,
            "platform": platform
        }
    except Exception as e:
        return {
            "title": "",
            "excerpt": "",
            "thumbnail": "",
            "platform": platform,
            "error": str(e)
        }

# SETTINGS API
@app.get("/api/settings", response_model=SettingsSchema)
def get_settings():
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM settings WHERE id = 1").fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Settings not found")
    return dict(row)

@app.put("/api/settings", response_model=SettingsSchema)
def update_settings(settings: SettingsSchema):
    conn = get_db_connection()
    conn.execute("""
    UPDATE settings 
    SET publicEmail = ?, phone = ?, address = ?, instagram = ?, facebook = ?, linkedin = ?, studioName = ?, tagline = ?
    WHERE id = 1
    """, (settings.publicEmail, settings.phone, settings.address, settings.instagram, settings.facebook, settings.linkedin, settings.studioName, settings.tagline))
    conn.commit()
    conn.close()
    return settings

# USERS API
@app.get("/api/users", response_model=List[UserSchema])
def get_users():
    conn = get_db_connection()
    rows = conn.execute("SELECT email, name, role FROM users").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/users", response_model=UserSchema)
def create_user(user: UserSchema):
    conn = get_db_connection()
    try:
        conn.execute("""
        INSERT INTO users (email, name, role, password)
        VALUES (?, ?, ?, ?)
        """, (user.email, user.name, user.role, user.password or "password"))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="User already exists")
    conn.close()
    return user

@app.put("/api/users/{email}", response_model=UserSchema)
def update_user(email: str, user: UserSchema):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE users
    SET name = ?, role = ?
    WHERE email = ?
    """, (user.name, user.role, email))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
    conn.commit()
    conn.close()
    return user

@app.delete("/api/users/{email}")
def delete_user(email: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE email = ?", (email,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
    conn.commit()
    conn.close()
    return {"message": "User deleted successfully"}

# LOGS API
@app.get("/api/logs")
def get_logs():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM logs ORDER BY createdAt DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/logs")
def create_log(log: LogCreateSchema):
    conn = get_db_connection()
    log_id = f"l{uuid.uuid4().hex[:8]}"
    created_at = datetime.utcnow().isoformat() + "Z"
    conn.execute("""
    INSERT INTO logs (id, icon, label, who, createdAt)
    VALUES (?, ?, ?, ?, ?)
    """, (log_id, log.icon, log.label, log.who, created_at))
    conn.commit()
    conn.close()
    return {"id": log_id, "createdAt": created_at}

# POSTS API
@app.get("/api/posts")
def get_posts():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM posts ORDER BY createdAt DESC").fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]

@app.get("/api/posts/{slug}")
def get_post(slug: str):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM posts WHERE slug = ?", (slug,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Post not found")
    return row_to_dict(row)

@app.post("/api/posts")
def create_post(post: PostCreateSchema):
    conn = get_db_connection()
    post_id = f"p{uuid.uuid4().hex[:8]}"
    slug = post.title.lower().replace(" ", "-").replace("/", "-").strip()
    slug = "".join([c for c in slug if c.isalnum() or c == "-"])
    if not slug:
        slug = f"post-{post_id}"

    created_at = datetime.utcnow().isoformat() + "Z"
    
    try:
        conn.execute("""
        INSERT INTO posts (id, slug, title, excerpt, content, thumbnail, platform, category, tags, externalUrl, status, featured, views, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
        """, (
            post_id, slug, post.title, post.excerpt, post.content, post.thumbnail,
            post.platform, post.category, json.dumps(post.tags), post.externalUrl,
            post.status, 1 if post.featured else 0, created_at
        ))
        conn.commit()
    except sqlite3.IntegrityError:
        # If slug is duplicate, generate unique slug
        slug = f"{slug}-{post_id}"
        conn.execute("""
        INSERT INTO posts (id, slug, title, excerpt, content, thumbnail, platform, category, tags, externalUrl, status, featured, views, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
        """, (
            post_id, slug, post.title, post.excerpt, post.content, post.thumbnail,
            post.platform, post.category, json.dumps(post.tags), post.externalUrl,
            post.status, 1 if post.featured else 0, created_at
        ))
        conn.commit()
        
    conn.close()
    return {"id": post_id, "slug": slug}

@app.put("/api/posts/{id}")
def update_post(id: str, post: PostUpdateSchema):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get current values to merge
    current = conn.execute("SELECT * FROM posts WHERE id = ?", (id,)).fetchone()
    if not current:
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")

    title = post.title if post.title is not None else current["title"]
    excerpt = post.excerpt if post.excerpt is not None else current["excerpt"]
    content = post.content if post.content is not None else current["content"]
    thumbnail = post.thumbnail if post.thumbnail is not None else current["thumbnail"]
    platform = post.platform if post.platform is not None else current["platform"]
    category = post.category if post.category is not None else current["category"]
    
    if post.tags is not None:
        tags_str = json.dumps(post.tags)
    else:
        tags_str = current["tags"]
        
    externalUrl = post.externalUrl if post.externalUrl is not None else current["externalUrl"]
    status = post.status if post.status is not None else current["status"]
    
    if post.featured is not None:
        featured = 1 if post.featured else 0
    else:
        featured = current["featured"]

    # Auto generate slug if title changed
    if post.title is not None and post.title != current["title"]:
        slug = post.title.lower().replace(" ", "-").replace("/", "-").strip()
        slug = "".join([c for c in slug if c.isalnum() or c == "-"])
    else:
        slug = current["slug"]

    cursor.execute("""
    UPDATE posts
    SET slug = ?, title = ?, excerpt = ?, content = ?, thumbnail = ?, platform = ?, category = ?, tags = ?, externalUrl = ?, status = ?, featured = ?
    WHERE id = ?
    """, (slug, title, excerpt, content, thumbnail, platform, category, tags_str, externalUrl, status, featured, id))
    
    conn.commit()
    conn.close()
    return {"id": id, "slug": slug}

@app.delete("/api/posts/{id}")
def delete_post(id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM posts WHERE id = ?", (id,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")
    conn.commit()
    conn.close()
    return {"message": "Post deleted successfully"}

@app.post("/api/posts/{id}/view")
def increment_view(id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE posts SET views = views + 1 WHERE id = ?", (id,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")
    conn.commit()
    conn.close()
    return {"message": "Views incremented"}

# INQUIRIES API
@app.get("/api/inquiries")
def get_inquiries():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM inquiries ORDER BY createdAt DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/inquiries")
def create_inquiry(inquiry: InquiryCreateSchema):
    conn = get_db_connection()
    inquiry_id = f"i{uuid.uuid4().hex[:8]}"
    created_at = datetime.utcnow().isoformat() + "Z"
    
    conn.execute("""
    INSERT INTO inquiries (id, name, email, phone, eventType, message, date, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)
    """, (inquiry_id, inquiry.name, inquiry.email, inquiry.phone, inquiry.eventType, inquiry.message, inquiry.date, created_at))
    
    conn.commit()
    conn.close()
    return {"id": inquiry_id}

@app.put("/api/inquiries/{id}")
def update_inquiry(id: str, inquiry: InquiryUpdateSchema):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE inquiries SET status = ? WHERE id = ?", (inquiry.status, id))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Inquiry not found")
    conn.commit()
    conn.close()
    return {"id": id, "status": inquiry.status}

@app.delete("/api/inquiries/{id}")
def delete_inquiry(id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM inquiries WHERE id = ?", (id,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Inquiry not found")
    conn.commit()
    conn.close()
    return {"message": "Inquiry deleted successfully"}

# MEDIA API
@app.get("/api/media")
def get_media():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM media ORDER BY createdAt DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/media/upload")
async def upload_file(file: UploadFile = File(...)):
    # Create unique filename
    file_id = f"m{uuid.uuid4().hex[:8]}"
    ext = os.path.splitext(file.filename)[1]
    filename = f"{file_id}{ext}"
    filepath = os.path.join(UPLOADS_DIR, filename)

    # Save to disk
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Get file size
    size = os.path.getsize(filepath)
    
    # URL to access the uploaded file
    # We return /uploads/filename relative URL so it works easily
    url = f"/uploads/{filename}"
    
    # Save to SQLite
    created_at = datetime.utcnow().isoformat() + "Z"
    conn = get_db_connection()
    conn.execute("""
    INSERT INTO media (id, filename, url, size, createdAt)
    VALUES (?, ?, ?, ?, ?)
    """, (file_id, file.filename, url, size, created_at))
    conn.commit()
    conn.close()
    
    return {"id": file_id, "filename": file.filename, "url": url, "size": size}

@app.delete("/api/media/{id}")
def delete_media(id: str):
    conn = get_db_connection()
    row = conn.execute("SELECT filename FROM media WHERE id = ?", (id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Media not found")
        
    # Delete from disk
    filepath = os.path.join(UPLOADS_DIR, row["filename"])
    if os.path.exists(filepath):
        try:
            os.remove(filepath)
        except Exception as e:
            print("Error deleting file", filepath, e)
            
    # Delete from DB
    conn.execute("DELETE FROM media WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return {"message": "Media deleted successfully"}
