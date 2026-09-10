from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, constr
from typing import Optional
import os
import psycopg

from routers.auth import get_token

router = APIRouter()


class OwnerClaimPayload(BaseModel):
    first_name: constr(strip_whitespace=True, min_length=1, max_length=50)  # type: ignore
    last_name: constr(strip_whitespace=True, min_length=1, max_length=50)  # type: ignore
    email: EmailStr
    phone_number: constr(strip_whitespace=True, min_length=1, max_length=50)  # type: ignore
    document_url: constr(strip_whitespace=True, min_length=1, max_length=2000)  # type: ignore
    station_id: Optional[int] = None


def _get_conn():
    dsn = os.getenv("DATABASE_URL")
    if not dsn:
        raise HTTPException(status_code=500, detail="DATABASE_URL not set on server")
    return psycopg.connect(dsn)


def _validate_doc_url(url: str) -> str:
    url = url.strip()
    if not (url.startswith("https://drive.google.com/") or url.startswith("http://drive.google.com/")):
        raise HTTPException(status_code=400, detail="document_url must be a Google Drive link (https://drive.google.com/...)")
    return url


CLAIM_SELECT = (
    "SELECT owner_id, user_id, first_name, last_name, email, phone_number, "
    "document_url, status, created_at FROM tbl_owner"
)

# ponytail: single station via LIMIT 1 – YAGNI, avoid array until multi-pen needed
# tbl_station.owner_id -> tbl_owner.user_id (TEXT), shows station name not tbl_stations id
CLAIM_SELECT_JOIN = (
    "SELECT o.owner_id, o.user_id, o.first_name, o.last_name, o.email, o.phone_number, "
    "o.document_url, o.status, o.created_at, "
    "s.station_id, s.location AS station_location, s.municipality AS station_municipality, s.province AS station_province "
    "FROM tbl_owner o LEFT JOIN LATERAL (SELECT station_id, location, municipality, province FROM tbl_station WHERE owner_id = o.user_id LIMIT 1) s ON true"
)


def _row_to_owner(row, cols):
    owner = dict(zip(cols, row))
    created = owner.get("created_at")
    if created is not None and not isinstance(created, str):
        try:
            owner["created_at"] = created.isoformat()
        except Exception:
            owner["created_at"] = str(created)
    return owner


def _fetch_claims(cur, status_filter: Optional[str]):
    try:
        if status_filter:
            cur.execute(f"{CLAIM_SELECT_JOIN} WHERE o.status = %s ORDER BY o.created_at DESC", (status_filter,))
        else:
            cur.execute(f"{CLAIM_SELECT_JOIN} ORDER BY o.created_at DESC")
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description] if cur.description else []
        return [_row_to_owner(r, cols) for r in rows]
    except psycopg.errors.UndefinedColumn:
        cur.connection.rollback()
        if status_filter:
            cur.execute(f"{CLAIM_SELECT} WHERE status = %s ORDER BY created_at DESC", (status_filter,))
        else:
            cur.execute(f"{CLAIM_SELECT} ORDER BY created_at DESC")
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description] if cur.description else []
        return [_row_to_owner(r, cols) for r in rows]
    except psycopg.errors.UndefinedTable:
        cur.connection.rollback()
        if status_filter:
            cur.execute(f"{CLAIM_SELECT} WHERE status = %s ORDER BY created_at DESC", (status_filter,))
        else:
            cur.execute(f"{CLAIM_SELECT} ORDER BY created_at DESC")
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description] if cur.description else []
        return [_row_to_owner(r, cols) for r in rows]


@router.post("/owners/claims")
def submit_owner_claim(payload: OwnerClaimPayload, decoded=Depends(get_token)):
    uid = decoded.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Token has no uid")

    doc_url = _validate_doc_url(payload.document_url)
    email_trim = payload.email.strip().lower()
    token_email = (decoded.get("email") or "").lower().strip()
    if token_email and token_email != email_trim:
        raise HTTPException(status_code=400, detail="Email mismatch with token")

    station_id = payload.station_id

    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                if station_id is not None:
                    try:
                        cur.execute("SELECT 1 FROM tbl_station WHERE station_id = %s", (station_id,))
                        if not cur.fetchone():
                            raise HTTPException(status_code=404, detail="Station not found")
                    except psycopg.errors.UndefinedTable:
                        pass
                    except HTTPException:
                        raise

                # ponytail: tbl_owner is profile-only – never store station_id here (see tbl_station.owner_id)
                cur.execute(
                    """
                    INSERT INTO tbl_owner (user_id, first_name, last_name, email, phone_number, document_url, status)
                    VALUES (%s, %s, %s, %s, %s, %s, 'pending')
                    ON CONFLICT (user_id) DO UPDATE SET
                        first_name = EXCLUDED.first_name,
                        last_name = EXCLUDED.last_name,
                        email = EXCLUDED.email,
                        phone_number = EXCLUDED.phone_number,
                        document_url = EXCLUDED.document_url,
                        status = 'pending'
                    RETURNING owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at
                    """,
                    (
                        uid,
                        payload.first_name.strip()[:50],
                        payload.last_name.strip()[:50],
                        email_trim,
                        payload.phone_number.strip(),
                        doc_url,
                    ),
                )
                row = cur.fetchone()
                cols = [d[0] for d in cur.description] if cur.description else []
                conn.commit()
                owner = _row_to_owner(row, cols)
                # echo requested station for admin UI (not persisted in tbl_owner)
                if station_id is not None:
                    owner["station_id"] = station_id
                    try:
                        with conn.cursor() as cur2:
                            cur2.execute("SELECT location, municipality, province FROM tbl_station WHERE station_id = %s", (station_id,))
                            srow = cur2.fetchone()
                            if srow:
                                owner["station_location"] = srow[0]
                                owner["station_municipality"] = srow[1]
                                owner["station_province"] = srow[2]
                    except Exception:
                        pass
                return {"ok": True, "owner": owner}
    except HTTPException:
        raise
    except psycopg.errors.UndefinedTable:
        raise HTTPException(status_code=500, detail="tbl_owner table not found in Neon. Run migration.")
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")


class OwnerReviewPayload(BaseModel):
    action: constr(strip_whitespace=True, min_length=1, max_length=20)  # type: ignore
    station_id: Optional[int] = None


@router.get("/owners/claims")
def list_owner_claims(status: Optional[str] = None):
    # ponytail: open like /stations — admin app has no login flow yet; lock down once admin auth lands
    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                sf = status.strip().lower() if status and status.strip().lower() in ("pending", "approved", "rejected") else None
                claims = _fetch_claims(cur, sf)
                return {"ok": True, "claims": claims}
    except psycopg.errors.UndefinedTable:
        raise HTTPException(status_code=500, detail="tbl_owner table not found in Neon. Run migration.")
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")


@router.patch("/owners/claims/{owner_id}")
def review_owner_claim(owner_id: int, payload: OwnerReviewPayload):
    action = payload.action.strip().lower()
    station_id = payload.station_id
    if action in ("approve", "approved"):
        new_status = "approved"
        if station_id is None:
            raise HTTPException(status_code=400, detail="station_id is required when approving")
    elif action in ("reject", "rejected"):
        new_status = "rejected"
    else:
        raise HTTPException(status_code=400, detail="action must be 'approved' or 'rejected'")
    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT user_id FROM tbl_owner WHERE owner_id = %s", (owner_id,))
                owner_row = cur.fetchone()
                if not owner_row:
                    raise HTTPException(status_code=404, detail="Owner claim not found")
                user_id = owner_row[0]

                cur.execute(
                    "UPDATE tbl_owner SET status = %s WHERE owner_id = %s "
                    "RETURNING owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at",
                    (new_status, owner_id),
                )
                updated = cur.fetchone()
                ucols = [d[0] for d in cur.description] if cur.description else []

                if new_status == "approved":
                    # link station -> owner
                    try:
                        cur.execute("SELECT owner_id FROM tbl_station WHERE station_id = %s", (station_id,))
                        srow = cur.fetchone()
                        if not srow:
                            raise HTTPException(status_code=404, detail="Station not found")
                        # ponytail: overwrite allowed – add 409 check if strict ownership needed
                        cur.execute("UPDATE tbl_station SET owner_id = %s WHERE station_id = %s", (user_id, station_id))
                    except psycopg.errors.UndefinedColumn:
                        raise HTTPException(status_code=500, detail="tbl_station.owner_id column not found. Run migration.")
                    except psycopg.errors.UndefinedTable:
                        raise HTTPException(status_code=500, detail="tbl_station table not found in Neon. Run migration.")

                conn.commit()
                owner = _row_to_owner(updated, ucols)
                if station_id is not None:
                    owner["station_id"] = station_id
                    try:
                        with conn.cursor() as cur2:
                            cur2.execute("SELECT location, municipality, province FROM tbl_station WHERE station_id = %s", (station_id,))
                            srow = cur2.fetchone()
                            if srow:
                                owner["station_location"] = srow[0]
                                owner["station_municipality"] = srow[1]
                                owner["station_province"] = srow[2]
                    except Exception:
                        pass
                else:
                    # for rejected, still show currently owned station via join (if any)
                    try:
                        with conn.cursor() as cur2:
                            cur2.execute("SELECT station_id, location, municipality, province FROM tbl_station WHERE owner_id = %s LIMIT 1", (user_id,))
                            srow = cur2.fetchone()
                            if srow:
                                owner["station_id"] = srow[0]
                                owner["station_location"] = srow[1]
                                owner["station_municipality"] = srow[2]
                                owner["station_province"] = srow[3]
                    except Exception:
                        pass
                return {"ok": True, "owner": owner}
    except HTTPException:
        raise
    except psycopg.errors.UndefinedTable:
        raise HTTPException(status_code=500, detail="tbl_owner table not found in Neon. Run migration.")
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")


@router.get("/owners/me")
def get_my_owner_claim(decoded=Depends(get_token)):
    uid = decoded.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Token has no uid")
    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute(
                        "SELECT o.owner_id, o.user_id, o.first_name, o.last_name, o.email, o.phone_number, o.document_url, o.status, o.created_at, "
                        "s.station_id, s.location AS station_location, s.municipality AS station_municipality FROM tbl_owner o "
                        "LEFT JOIN LATERAL (SELECT station_id, location, municipality FROM tbl_station WHERE owner_id = o.user_id LIMIT 1) s ON true "
                        "WHERE o.user_id = %s",
                        (uid,),
                    )
                    row = cur.fetchone()
                    if not row:
                        raise HTTPException(status_code=404, detail="No owner claim found")
                    cols = [d[0] for d in cur.description] if cur.description else []
                    return {"ok": True, "owner": _row_to_owner(row, cols)}
                except psycopg.errors.UndefinedColumn:
                    cur.connection.rollback()
                    cur.execute(
                        "SELECT owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at FROM tbl_owner WHERE user_id = %s",
                        (uid,),
                    )
                    row = cur.fetchone()
                    if not row:
                        raise HTTPException(status_code=404, detail="No owner claim found")
                    cols = [d[0] for d in cur.description] if cur.description else []
                    return {"ok": True, "owner": _row_to_owner(row, cols)}
                except psycopg.errors.UndefinedTable:
                    cur.connection.rollback()
                    cur.execute(
                        "SELECT owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at FROM tbl_owner WHERE user_id = %s",
                        (uid,),
                    )
                    row = cur.fetchone()
                    if not row:
                        raise HTTPException(status_code=404, detail="No owner claim found")
                    cols = [d[0] for d in cur.description] if cur.description else []
                    return {"ok": True, "owner": _row_to_owner(row, cols)}
    except HTTPException:
        raise
    except psycopg.errors.UndefinedTable:
        raise HTTPException(status_code=500, detail="tbl_owner table not found in Neon. Run migration.")
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")
