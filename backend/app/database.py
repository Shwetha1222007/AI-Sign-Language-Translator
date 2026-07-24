"""
database.py

Purpose: SQLite database layer for the SignSpeak AI backend.
- Uses Python's built-in sqlite3 (zero extra dependencies).
- Single translations table with auto-increment primary key.
- All functions return plain dicts or lists of dicts — no ORM abstractions.
- Thread-safe: uses check_same_thread=False (FastAPI runs async workers).
"""

import sqlite3
import logging
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional

logger = logging.getLogger("signspeak_backend.database")

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

ROOT_DIR = Path(__file__).resolve().parents[1]
DB_PATH = ROOT_DIR / "signspeak.db"


# ---------------------------------------------------------------------------
# Connection Factory
# ---------------------------------------------------------------------------

def get_connection() -> sqlite3.Connection:
    """
    Return a SQLite connection with:
    - Row factory so rows behave like dicts (conn.row_factory = sqlite3.Row).
    - check_same_thread=False for use with FastAPI's async workers.
    """
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row  # enables row["column_name"] access
    return conn


# ---------------------------------------------------------------------------
# Schema Initialization
# ---------------------------------------------------------------------------

def init_db() -> None:
    """
    Create the `translations` table if it does not already exist.
    Called once on application startup.
    """
    sql = """
    CREATE TABLE IF NOT EXISTS translations (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        prediction  TEXT    NOT NULL,
        confidence  REAL    NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
        created_at  TEXT    NOT NULL
    );
    """
    try:
        with get_connection() as conn:
            conn.execute(sql)
            conn.commit()
        logger.info("Database initialized at: %s", DB_PATH)
    except sqlite3.Error as exc:
        logger.error("Failed to initialize database: %s", exc)
        raise


# ---------------------------------------------------------------------------
# CRUD Functions
# ---------------------------------------------------------------------------

def insert_translation(prediction: str, confidence: float) -> dict:
    """
    Insert a new translation record.

    Args:
        prediction: The predicted sign label (e.g. "Hello").
        confidence: Model confidence score (0.0–1.0).

    Returns:
        The inserted record as a dict with keys: id, prediction, confidence, created_at.
    """
    created_at = datetime.now(timezone.utc).isoformat()

    sql = """
    INSERT INTO translations (prediction, confidence, created_at)
    VALUES (?, ?, ?)
    """
    try:
        with get_connection() as conn:
            cursor = conn.execute(sql, (prediction, round(confidence, 6), created_at))
            conn.commit()
            row_id = cursor.lastrowid

        logger.debug("Inserted translation id=%d prediction=%s confidence=%.4f", row_id, prediction, confidence)

        return {
            "id": row_id,
            "prediction": prediction,
            "confidence": confidence,
            "created_at": created_at,
        }
    except sqlite3.Error as exc:
        logger.error("Failed to insert translation: %s", exc)
        raise


def get_all_translations(limit: int = 100) -> list[dict]:
    """
    Retrieve the most recent translations, newest first.

    Args:
        limit: Maximum number of records to return (default 100).

    Returns:
        List of translation dicts ordered by created_at DESC.
    """
    sql = """
    SELECT id, prediction, confidence, created_at
    FROM translations
    ORDER BY id DESC
    LIMIT ?
    """
    try:
        with get_connection() as conn:
            rows = conn.execute(sql, (limit,)).fetchall()
        return [dict(row) for row in rows]
    except sqlite3.Error as exc:
        logger.error("Failed to fetch translations: %s", exc)
        raise


def delete_translation(record_id: int) -> bool:
    """
    Delete a single translation record by its primary key.

    Args:
        record_id: The integer primary key.

    Returns:
        True if a row was deleted, False if the ID did not exist.
    """
    sql = "DELETE FROM translations WHERE id = ?"
    try:
        with get_connection() as conn:
            cursor = conn.execute(sql, (record_id,))
            conn.commit()
            deleted = cursor.rowcount > 0

        if deleted:
            logger.debug("Deleted translation id=%d", record_id)
        else:
            logger.warning("Delete attempted on non-existent id=%d", record_id)

        return deleted
    except sqlite3.Error as exc:
        logger.error("Failed to delete translation id=%d: %s", record_id, exc)
        raise


def clear_all_translations() -> int:
    """
    Delete ALL translation records from the database.

    Returns:
        The number of rows deleted.
    """
    sql = "DELETE FROM translations"
    try:
        with get_connection() as conn:
            cursor = conn.execute(sql)
            conn.commit()
            count = cursor.rowcount
        logger.info("Cleared all translations (%d rows deleted)", count)
        return count
    except sqlite3.Error as exc:
        logger.error("Failed to clear translations: %s", exc)
        raise


def get_translation_count() -> int:
    """
    Return the total number of translation records stored.
    """
    sql = "SELECT COUNT(*) FROM translations"
    try:
        with get_connection() as conn:
            row = conn.execute(sql).fetchone()
        return row[0]
    except sqlite3.Error as exc:
        logger.error("Failed to count translations: %s", exc)
        return 0
