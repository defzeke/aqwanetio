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

CLAIM_SELECT_JOIN = (
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
        # fallback: try old station_id column or plain
        try:
            alt = CLAIM_SELECT_JOIN.replace("o.requested_station_id", "o.station_id")
            if status_filter:
                cur.execute(f"{alt} WHERE o.status = %s ORDER BY o.created_at DESC", (status_filter,))
            else:
                cur.execute(f"{alt} ORDER BY o.created_at DESC")
            rows = cur.fetchall()
            cols = [d[0] for d in cur.description] if cur.description else []
            return [_row_to_owner(r, cols) for r in rows]
        except Exception:
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

                # try with requested_station_id, fallback to plain
                try:
                    cur.execute(
                        """
                        INSERT INTO tbl_owner (user_id, first_name, last_name, email, phone_number, document_url, status, requested_station_id)
                        VALUES (%s, %s, %s, %s, %s, %s, 'pending', %s)
                        ON CONFLICT (user_id) DO UPDATE SET
                            first_name = EXCLUDED.first_name,
                            last_name = EXCLUDED.last_name,
                            email = EXCLUDED.email,
                            phone_number = EXCLUDED.phone_number,
                            document_url = EXCLUDED.document_url,
                            requested_station_id = EXCLUDED.requested_station_id,
                            status = 'pending'
                        RETURNING owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at, requested_station_id
                        """,
                        (
                            uid,
                            payload.first_name.strip()[:50],
                            payload.last_name.strip()[:50],
                            email_trim,
                            payload.phone_number.strip(),
                            doc_url,
                            station_id,
                        ),
                    )
                    row = cur.fetchone()
                    cols = [d[0] for d in cur.description] if cur.description else []
                    conn.commit()
                    owner = _row_to_owner(row, cols)
                    # normalize to station_id for frontend
                    if owner.get("requested_station_id") is not None:
                        owner["station_id"] = owner.pop("requested_station_id")
                    if station_id is not None:
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
                except psycopg.errors.UndefinedColumn:
                    conn.rollback()
                    # fallback to old station_id column or no column
                    try:
                        cur.execute(
                            """
                            INSERT INTO tbl_owner (user_id, first_name, last_name, email, phone_number, document_url, status, station_id)
                            VALUES (%s, %s, %s, %s, %s, %s, 'pending', %s)
                            ON CONFLICT (user_id) DO UPDATE SET
                                first_name = EXCLUDED.first_name,
                                last_name = EXCLUDED.last_name,
                                email = EXCLUDED.email,
                                phone_number = EXCLUDED.phone_number,
                                document_url = EXCLUDED.document_url,
                                station_id = EXCLUDED.station_id,
                                status = 'pending'
                            RETURNING owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at, station_id
                            """,
                            (uid, payload.first_name.strip()[:50], payload.last_name.strip()[:50], email_trim, payload.phone_number.strip(), doc_url, station_id),
                        )
                        row = cur.fetchone()
                        cols = [d[0] for d in cur.description] if cur.description else []
                        conn.commit()
                        return {"ok": True, "owner": _row_to_owner(row, cols)}
                    except psycopg.errors.UndefinedColumn:
                        conn.rollback()
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
                            (uid, payload.first_name.strip()[:50], payload.last_name.strip()[:50], email_trim, payload.phone_number.strip(), doc_url),
                        )
                        row = cur.fetchone()
                        cols = [d[0] for d in cur.description] if cur.description else []
                        conn.commit()
                        owner = _row_to_owner(row, cols)
                        if station_id is not None:
                            owner["station_id"] = station_id
                        return {"ok": True, "owner": owner}
    except HTTPException:
        raise
    except psycopg.errors.UndefinedTable:
        raise HTTPException(status_code=500, detail="tbl_owner table not found in Neon. Run migration.")
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")


class OwnerReviewPayload(BaseModel):
    action: constr(strip_whitespace=True, min_length=1, max_length=20)  # type: ignore
    # ponytail: ignored – admin cannot pick station, fixed to requested_station_id
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
    # ponytail: admin cannot pick station – fixed to what user requested
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
                try:
                    cur.execute("SELECT user_id, requested_station_id FROM tbl_owner WHERE owner_id = %s", (owner_id,))
                    owner_row = cur.fetchone()
                    if not owner_row:
                        raise HTTPException(status_code=404, detail="Owner claim not found")
                    user_id, station_id = owner_row[0], owner_row[1] if len(owner_row) > 1 else None
                except psycopg.errors.UndefinedColumn:
                    cur.connection.rollback()
                    cur.execute("SELECT user_id, station_id FROM tbl_owner WHERE owner_id = %s", (owner_id,))
                    r = cur.fetchone()
                    if not r:
                        raise HTTPException(status_code=404, detail="Owner claim not found")
                    user_id, station_id = r[0], r[1] if len(r) > 1 else None
                except psycopg.errors.UndefinedTable:
                    raise
                if action in ("approve", "approved") and station_id is None:
                    raise HTTPException(status_code=400, detail="claim has no requested station – cannot approve")

                cur.execute(
                    "UPDATE tbl_owner SET status = %s WHERE owner_id = %s "
                    "RETURNING owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at",
                    (new_status, owner_id),
                )
                updated = cur.fetchone()
                ucols = [d[0] for d in cur.description] if cur.description else []

                if new_status == "approved":
                    try:
                        cur.execute("SELECT owner_id FROM tbl_station WHERE station_id = %s", (station_id,))
                        srow = cur.fetchone()
                        if not srow:
                            raise HTTPException(status_code=404, detail="Station not found")
                        cur.execute("UPDATE tbl_station SET owner_id = %s WHERE station_id = %s", (user_id, station_id))
                        # clear requested pin after grant
                        try:
                            cur.execute("UPDATE tbl_owner SET requested_station_id = NULL WHERE owner_id = %s", (owner_id,))
                        except psycopg.errors.UndefinedColumn:
                            cur.connection.rollback()
                            # keep transaction – re-apply station link after rollback
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
                        "COALESCE(s_req.station_id, s_own.station_id) AS station_id, "
                        "COALESCE(s_req.location, s_own.location) AS station_location, "
                        "COALESCE(s_req.municipality, s_own.municipality) AS station_municipality FROM tbl_owner o "
                        "LEFT JOIN tbl_station s_req ON s_req.station_id = o.requested_station_id "
                        "LEFT JOIN LATERAL (SELECT station_id, location, municipality FROM tbl_station WHERE owner_id = o.user_id LIMIT 1) s_own ON o.status='approved' "
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
                    # fallback to old join
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
                    except Exception:
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
