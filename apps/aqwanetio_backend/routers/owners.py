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


CLAIM_SELECT_JOIN = (
    "SELECT c.claim_id AS owner_id, o.user_id, o.first_name, o.last_name, o.email, o.phone_number, "
    "c.document_url, c.status, c.created_at, "
    "s.station_id, s.location AS station_location, s.municipality AS station_municipality, s.province AS station_province "
    "FROM tbl_claim c JOIN tbl_owner o ON o.user_id = c.user_id "
    "JOIN tbl_station s ON s.station_id = c.station_id"
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
    # ponytail: 1 owner profile + N claims in tbl_claim, N ponds in tbl_station.owner_id
    try:
        if status_filter:
            cur.execute(f"{CLAIM_SELECT_JOIN} WHERE c.status = %s ORDER BY c.created_at DESC", (status_filter,))
        else:
            cur.execute(f"{CLAIM_SELECT_JOIN} ORDER BY c.created_at DESC")
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description] if cur.description else []
        return [_row_to_owner(r, cols) for r in rows]
    except psycopg.errors.UndefinedTable:
        cur.connection.rollback()
        # fallback to old tbl_owner-as-claims (pre-migration)
        legacy = (
            "SELECT o.owner_id, o.user_id, o.first_name, o.last_name, o.email, o.phone_number, "
            "o.document_url, o.status, o.created_at, "
            "COALESCE(s_req.station_id, s_own.station_id) AS station_id, "
            "COALESCE(s_req.location, s_own.location) AS station_location, "
            "COALESCE(s_req.municipality, s_own.municipality) AS station_municipality, "
            "COALESCE(s_req.province, s_own.province) AS station_province "
            "FROM tbl_owner o "
            "LEFT JOIN tbl_station s_req ON s_req.station_id = o.requested_station_id "
            "LEFT JOIN LATERAL (SELECT station_id, location, municipality, province FROM tbl_station WHERE owner_id = o.user_id LIMIT 1) s_own ON o.status='approved'"
        )
        try:
            if status_filter:
                cur.execute(f"{legacy} WHERE o.status = %s ORDER BY o.created_at DESC", (status_filter,))
            else:
                cur.execute(f"{legacy} ORDER BY o.created_at DESC")
            rows = cur.fetchall()
            cols = [d[0] for d in cur.description] if cur.description else []
            return [_row_to_owner(r, cols) for r in rows]
        except Exception:
            cur.connection.rollback()
            cur.execute("SELECT owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at FROM tbl_owner ORDER BY created_at DESC" if not status_filter else "SELECT owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at FROM tbl_owner WHERE status=%s ORDER BY created_at DESC", (status_filter,) if status_filter else None)
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
    if station_id is None:
        raise HTTPException(status_code=400, detail="station_id is required – claim a pond by tapping its pin")

    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1 FROM tbl_station WHERE station_id = %s", (station_id,))
                if not cur.fetchone():
                    raise HTTPException(status_code=404, detail="Station not found")
                cur.execute("SELECT owner_id FROM tbl_station WHERE station_id = %s", (station_id,))
                s_own = cur.fetchone()
                if s_own and s_own[0] == uid:
                    raise HTTPException(status_code=409, detail="You already own this pond")

                # upsert profile – one row per user_id
                cur.execute(
                    """
                    INSERT INTO tbl_owner (user_id, first_name, last_name, email, phone_number, document_url, status)
                    VALUES (%s, %s, %s, %s, %s, %s, 'pending')
                    ON CONFLICT (user_id) DO UPDATE SET
                        first_name = EXCLUDED.first_name,
                        last_name = EXCLUDED.last_name,
                        email = EXCLUDED.email,
                        phone_number = EXCLUDED.phone_number,
                        document_url = EXCLUDED.document_url
                    RETURNING owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at
                    """,
                    (uid, payload.first_name.strip()[:50], payload.last_name.strip()[:50], email_trim, payload.phone_number.strip(), doc_url),
                )
                # ensure profile exists before claim (for FK)
                conn.commit()

                try:
                    cur.execute(
                        """
                        INSERT INTO tbl_claim (user_id, station_id, status, document_url)
                        VALUES (%s, %s, 'pending', %s)
                        RETURNING claim_id, user_id, station_id, status, document_url, created_at
                        """,
                        (uid, station_id, doc_url),
                    )
                    row = cur.fetchone()
                    cols = [d[0] for d in cur.description] if cur.description else []
                    claim = dict(zip(cols, row))
                    conn.commit()
                except psycopg.errors.UniqueViolation:
                    conn.rollback()
                    raise HTTPException(status_code=409, detail="Already claimed this pond – pending review")
                except psycopg.errors.UndefinedTable:
                    conn.rollback()
                    # fallback to old single-table mode (requested_station_id)
                    cur.execute(
                        """
                        INSERT INTO tbl_owner (user_id, first_name, last_name, email, phone_number, document_url, status, requested_station_id)
                        VALUES (%s, %s, %s, %s, %s, %s, 'pending', %s)
                        RETURNING owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at, requested_station_id
                        """,
                        (uid, payload.first_name.strip()[:50], payload.last_name.strip()[:50], email_trim, payload.phone_number.strip(), doc_url, station_id),
                    )
                    row = cur.fetchone()
                    cols = [d[0] for d in cur.description] if cur.description else []
                    conn.commit()
                    claim = _row_to_owner(row, cols)
                    if claim.get("requested_station_id") is not None:
                        claim["station_id"] = claim.pop("requested_station_id")
                    return {"ok": True, "owner": claim}

                # enrich with station + profile for response
                cur.execute("SELECT first_name, last_name, email, phone_number FROM tbl_owner WHERE user_id = %s", (uid,))
                prof = cur.fetchone()
                cur.execute("SELECT location, municipality, province FROM tbl_station WHERE station_id = %s", (station_id,))
                srow = cur.fetchone()
                return {
                    "ok": True,
                    "owner": {
                        "owner_id": claim["claim_id"],
                        "user_id": uid,
                        "first_name": prof[0] if prof else payload.first_name,
                        "last_name": prof[1] if prof else payload.last_name,
                        "email": email_trim,
                        "phone_number": payload.phone_number,
                        "document_url": doc_url,
                        "status": "pending",
                        "created_at": claim["created_at"].isoformat() if hasattr(claim["created_at"], "isoformat") else str(claim["created_at"]),
                        "station_id": station_id,
                        "station_location": srow[0] if srow else None,
                        "station_municipality": srow[1] if srow else None,
                        "station_province": srow[2] if srow else None,
                    },
                }
    except HTTPException:
        raise
    except psycopg.errors.UndefinedTable as e:
        raise HTTPException(status_code=500, detail=f"tbl_claim/tbl_owner table not found. Run migration: {e}")
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")


class OwnerReviewPayload(BaseModel):
    action: constr(strip_whitespace=True, min_length=1, max_length=20)  # type: ignore
    station_id: Optional[int] = None


@router.get("/owners/claims")
def list_owner_claims(status: Optional[str] = None):
    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                sf = status.strip().lower() if status and status.strip().lower() in ("pending", "approved", "rejected") else None
                claims = _fetch_claims(cur, sf)
                return {"ok": True, "claims": claims}
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")


@router.patch("/owners/claims/{owner_id}")
def review_owner_claim(owner_id: int, payload: OwnerReviewPayload):
    # owner_id is claim_id in new model (aliased as owner_id for frontend compat)
    action = payload.action.strip().lower()
    if payload.station_id is not None:
        raise HTTPException(status_code=400, detail="station_id cannot be set by admin – claim is fixed to requested pin")
    if action in ("approve", "approved"):
        new_status = "approved"
    elif action in ("reject", "rejected"):
        new_status = "rejected"
    else:
        raise HTTPException(status_code=400, detail="action must be 'approved' or 'rejected'")
    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                # try new tbl_claim first
                try:
                    cur.execute("SELECT user_id, station_id, status FROM tbl_claim WHERE claim_id = %s", (owner_id,))
                    row = cur.fetchone()
                    if not row:
                        raise HTTPException(status_code=404, detail="Claim not found")
                    user_id, station_id, cur_status = row
                    if cur_status != "pending":
                        raise HTTPException(status_code=400, detail=f"Claim already {cur_status}")
                    cur.execute("UPDATE tbl_claim SET status = %s WHERE claim_id = %s RETURNING claim_id, user_id, station_id, status, document_url, created_at", (new_status, owner_id))
                    updated = cur.fetchone()
                    if new_status == "approved":
                        cur.execute("SELECT owner_id FROM tbl_station WHERE station_id = %s", (station_id,))
                        srow = cur.fetchone()
                        if not srow:
                            raise HTTPException(status_code=404, detail="Station not found")
                        cur.execute("UPDATE tbl_station SET owner_id = %s WHERE station_id = %s", (user_id, station_id))
                        cur.execute("UPDATE tbl_owner SET status = 'approved' WHERE user_id = %s", (user_id,))
                    else:
                        cur.execute("UPDATE tbl_claim SET status = 'rejected' WHERE claim_id = %s", (owner_id,))
                    conn.commit()
                    # enrich response like list
                    cur.execute("SELECT first_name, last_name, email, phone_number FROM tbl_owner WHERE user_id = %s", (user_id,))
                    prof = cur.fetchone()
                    cur.execute("SELECT location, municipality, province FROM tbl_station WHERE station_id = %s", (station_id,))
                    srow = cur.fetchone()
                    return {
                        "ok": True,
                        "owner": {
                            "owner_id": owner_id,
                            "user_id": user_id,
                            "first_name": prof[0] if prof else "",
                            "last_name": prof[1] if prof else "",
                            "email": prof[2] if prof else "",
                            "phone_number": prof[3] if prof else "",
                            "document_url": updated[4] if updated else "",
                            "status": new_status,
                            "created_at": updated[5].isoformat() if hasattr(updated[5], "isoformat") else str(updated[5]) if updated else "",
                            "station_id": station_id,
                            "station_location": srow[0] if srow else None,
                            "station_municipality": srow[1] if srow else None,
                            "station_province": srow[2] if srow else None,
                        },
                    }
                except psycopg.errors.UndefinedTable:
                    cur.connection.rollback()
                    # fallback to old tbl_owner-as-claim
                    cur.execute("SELECT user_id, requested_station_id FROM tbl_owner WHERE owner_id = %s", (owner_id,))
                    row = cur.fetchone()
                    if not row:
                        raise HTTPException(status_code=404, detail="Owner claim not found")
                    user_id, station_id = row
                    if new_status == "approved" and station_id is None:
                        raise HTTPException(status_code=400, detail="claim has no requested station")
                    cur.execute("UPDATE tbl_owner SET status = %s WHERE owner_id = %s RETURNING owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at", (new_status, owner_id))
                    updated = cur.fetchone()
                    ucols = [d[0] for d in cur.description] if cur.description else []
                    if new_status == "approved":
                        cur.execute("UPDATE tbl_station SET owner_id = %s WHERE station_id = %s", (user_id, station_id))
                    conn.commit()
                    owner = dict(zip(ucols, updated)) if updated else {}
                    owner["station_id"] = station_id
                    return {"ok": True, "owner": owner}
    except HTTPException:
        raise
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")


@router.delete("/owners/claims/{owner_id}")
def delete_owner_claim(owner_id: int):
    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute("SELECT user_id, station_id, status FROM tbl_claim WHERE claim_id = %s", (owner_id,))
                    row = cur.fetchone()
                    if not row:
                        raise HTTPException(status_code=404, detail="Claim not found")
                    user_id, station_id, status = row
                    if status == "approved":
                        cur.execute("UPDATE tbl_station SET owner_id = NULL WHERE station_id = %s AND owner_id = %s", (station_id, user_id))
                    cur.execute("DELETE FROM tbl_claim WHERE claim_id = %s", (owner_id,))
                    conn.commit()
                    return {"ok": True}
                except psycopg.errors.UndefinedTable:
                    cur.connection.rollback()
                    cur.execute("SELECT user_id, requested_station_id, status FROM tbl_owner WHERE owner_id = %s", (owner_id,))
                    row = cur.fetchone()
                    if not row:
                        raise HTTPException(status_code=404, detail="Owner claim not found")
                    user_id, req_sid, status = row
                    if status == "approved" and req_sid is not None:
                        cur.execute("UPDATE tbl_station SET owner_id = NULL WHERE station_id = %s", (req_sid,))
                    cur.execute("DELETE FROM tbl_owner WHERE owner_id = %s", (owner_id,))
                    conn.commit()
                    return {"ok": True}
    except HTTPException:
        raise
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
                        "SELECT c.claim_id AS owner_id, o.user_id, o.first_name, o.last_name, o.email, o.phone_number, c.document_url, c.status, c.created_at, "
                        "s.station_id, s.location AS station_location, s.municipality AS station_municipality "
                        "FROM tbl_claim c JOIN tbl_owner o ON o.user_id = c.user_id JOIN tbl_station s ON s.station_id = c.station_id "
                        "WHERE c.user_id = %s ORDER BY c.created_at DESC LIMIT 1",
                        (uid,),
                    )
                    row = cur.fetchone()
                    if not row:
                        raise HTTPException(status_code=404, detail="No owner claim found")
                    cols = [d[0] for d in cur.description] if cur.description else []
                    return {"ok": True, "owner": _row_to_owner(row, cols)}
                except psycopg.errors.UndefinedTable:
                    cur.connection.rollback()
                    cur.execute("SELECT owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at FROM tbl_owner WHERE user_id = %s ORDER BY created_at DESC LIMIT 1", (uid,))
                    row = cur.fetchone()
                    if not row:
                        raise HTTPException(status_code=404, detail="No owner claim found")
                    cols = [d[0] for d in cur.description] if cur.description else []
                    return {"ok": True, "owner": _row_to_owner(row, cols)}
    except HTTPException:
        raise
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")
