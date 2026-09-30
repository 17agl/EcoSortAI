import sqlite3
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "ecosort.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables():
    connection = get_connection()
    cursor = connection.cursor()

    # Create scans table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            filename TEXT NOT NULL,
            class_name TEXT NOT NULL,
            confidence REAL NOT NULL,
            action TEXT NOT NULL,
            instruction TEXT NOT NULL,
            reason TEXT NOT NULL,
            mode TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    # Add user_id to older databases that already have scans table
    cursor.execute("PRAGMA table_info(scans)")
    scan_columns = [column["name"] for column in cursor.fetchall()]

    if "user_id" not in scan_columns:
        cursor.execute(
            "ALTER TABLE scans ADD COLUMN user_id INTEGER"
        )

    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


# =========================
# USER FUNCTIONS
# =========================

def create_user(name, email, password_hash):
    connection = get_connection()
    cursor = connection.cursor()

    created_at = datetime.utcnow().isoformat()

    cursor.execute("""
        INSERT INTO users (
            name,
            email,
            password_hash,
            created_at
        )
        VALUES (?, ?, ?, ?)
    """, (
        name,
        email,
        password_hash,
        created_at
    ))

    connection.commit()

    user_id = cursor.lastrowid

    connection.close()

    return user_id, created_at


def get_user_by_email(email):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    )

    user = cursor.fetchone()

    connection.close()

    return user


# =========================
# SCAN FUNCTIONS
# =========================

def create_scan(
    user_id,
    filename,
    class_name,
    confidence,
    action,
    instruction,
    reason,
    mode
):
    connection = get_connection()
    cursor = connection.cursor()

    created_at = datetime.utcnow().isoformat()

    cursor.execute("""
        INSERT INTO scans (
            user_id,
            filename,
            class_name,
            confidence,
            action,
            instruction,
            reason,
            mode,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        filename,
        class_name,
        confidence,
        action,
        instruction,
        reason,
        mode,
        created_at
    ))

    connection.commit()

    scan_id = cursor.lastrowid

    connection.close()

    return scan_id, created_at


def get_all_scans(user_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM scans
        WHERE user_id = ?
        ORDER BY id DESC
    """, (user_id,))

    rows = cursor.fetchall()

    connection.close()

    return rows


def get_scan_by_id(scan_id, user_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM scans
        WHERE id = ?
        AND user_id = ?
    """, (
        scan_id,
        user_id
    ))

    row = cursor.fetchone()

    connection.close()

    return row