import sqlite3
import json
import os
from datetime import datetime

# On Railway, mount a persistent volume at /data and set RAILWAY_VOLUME_MOUNT_PATH=/data
# In local dev this falls back to the directory containing database.py
_DATA_DIR = os.environ.get("RAILWAY_VOLUME_MOUNT_PATH", os.path.dirname(__file__))

DB_FILE = os.path.join(_DATA_DIR, "data.db")
UPLOADS_DIR = os.path.join(_DATA_DIR, "uploads")

os.makedirs(UPLOADS_DIR, exist_ok=True)


def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Settings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        publicEmail TEXT,
        phone TEXT,
        address TEXT,
        instagram TEXT,
        facebook TEXT,
        linkedin TEXT,
        studioName TEXT,
        tagline TEXT
    )
    """)

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        name TEXT,
        role TEXT,
        password TEXT
    )
    """)

    # Posts table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE,
        title TEXT,
        excerpt TEXT,
        content TEXT,
        thumbnail TEXT,
        platform TEXT,
        category TEXT,
        tags TEXT, -- JSON array stored as text
        externalUrl TEXT,
        status TEXT,
        featured INTEGER, -- boolean as 0/1
        views INTEGER DEFAULT 0,
        createdAt TEXT
    )
    """)

    # Inquiries table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        eventType TEXT,
        message TEXT,
        date TEXT,
        status TEXT,
        createdAt TEXT
    )
    """)

    # Logs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        icon TEXT,
        label TEXT,
        who TEXT,
        createdAt TEXT
    )
    """)

    # Media table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        filename TEXT,
        url TEXT,
        size INTEGER,
        createdAt TEXT
    )
    """)

    # Seed Default Settings
    cursor.execute("SELECT COUNT(*) FROM settings")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO settings (id, publicEmail, phone, address, instagram, facebook, linkedin, studioName, tagline)
        VALUES (1, 'hello@rentmyevent.com', '9625340109', 'Pan-India Coverage', 
                'https://instagram.com/rentmyevent', 'https://facebook.com/rentmyevent', 
                'https://linkedin.com/company/rentmyevent', 'Rent My Event', 
                'Plan smartly. Organize perfectly. Execute flawlessly.')
        """)

    # Seed Default Super Admin User only
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO users (email, name, role, password)
        VALUES ('admin@rentmyevent.com', 'Studio Owner', 'Super Admin', 'password')
        """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at", DB_FILE)
