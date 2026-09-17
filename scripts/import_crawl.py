from __future__ import annotations

import argparse
import json
from pathlib import Path

from vocab_db import connect, import_crawl_payload, init_db, load_json_tolerant


def main() -> None:
    p = argparse.ArgumentParser(description="Import crawler JSON into Kanji Learn SQLite DB")
    p.add_argument("json_files", nargs="+")
    p.add_argument("--db", default="data/kanji_vocab.sqlite")
    p.add_argument("--promote-detected", action="store_true", help="Only promote new vocab when exactly one correct answer is explicitly detected")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--report")
    a = p.parse_args()

    db = Path(a.db)
    if not db.exists():
        raise SystemExit(f"Database not found: {db}. Run: python scripts/vocab_db.py")

    conn = connect(db); reports = []
    try:
        init_db(conn); conn.execute("BEGIN")
        for file in a.json_files:
            payload, raw = load_json_tolerant(file)
            report = import_crawl_payload(conn, payload, raw_json=raw, promote_detected=a.promote_detected)
            report["file"] = str(file); reports.append(report)
        conn.rollback() if a.dry_run else conn.commit()
    except Exception:
        conn.rollback(); raise
    finally:
        conn.close()

    result = {
        "database": str(db), "dry_run": a.dry_run, "promote_detected": a.promote_detected, "imports": reports,
        "totals": {k: sum(int(r.get(k, 0)) for r in reports) for k in ("existing","pending","ambiguous","promoted","questions_inserted","questions_already_seen")},
    }
    rendered = json.dumps(result, ensure_ascii=False, indent=2); print(rendered)
    if a.report: Path(a.report).write_text(rendered + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
