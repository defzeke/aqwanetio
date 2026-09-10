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

    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
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
                return {"ok": True, "owner": dict(zip(cols, row))}
    except HTTPException:
        raise
    except psycopg.errors.UndefinedTable:
        raise HTTPException(status_code=500, detail="tbl_owner table not found in Neon. Run migration.")
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")


class OwnerReviewPayload(BaseModel):
    action: constr(strip_whitespace=True, min_length=1, max_length=20)  # type: ignore


CLAIM_SELECT = (
    "SELECT owner_id, user_id, first_name, last_name, email, phone_number, "
    "document_url, status, created_at FROM tbl_owner"
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


@router.get("/owners/claims")
def list_owner_claims(status: Optional[str] = None):
    # ponytail: open like /stations — admin app has no login flow yet; lock down once admin auth lands
    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                if status and status.strip().lower() in ("pending", "approved", "rejected"):
                    cur.execute(
                        f"{CLAIM_SELECT} WHERE status = %s ORDER BY created_at DESC",
                        (status.strip().lower(),),
                    )
                else:
                    cur.execute(f"{CLAIM_SELECT} ORDER BY created_at DESC")
                rows = cur.fetchall()
                cols = [d[0] for d in cur.description] if cur.description else []
                return {"ok": True, "claims": [_row_to_owner(r, cols) for r in rows]}
    except psycopg.errors.UndefinedTable:
        raise HTTPException(status_code=500, detail="tbl_owner table not found in Neon. Run migration.")
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")


@router.patch("/owners/claims/{owner_id}")
def review_owner_claim(owner_id: int, payload: OwnerReviewPayload):
    action = payload.action.strip().lower()
    if action in ("approve", "approved"):
        new_status = "approved"
    elif action in ("reject", "rejected"):
        new_status = "rejected"
    else:
        raise HTTPException(status_code=400, detail="action must be 'approved' or 'rejected'")
    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    f"{CLAIM_SELECT} WHERE owner_id = %s",
                    (owner_id,),
                )
                row = cur.fetchone()
                if not row:
                    raise HTTPException(status_code=404, detail="Owner claim not found")
                cols = [d[0] for d in cur.description] if cur.description else []
                cur.execute(
                    "UPDATE tbl_owner SET status = %s WHERE owner_id = %s "
                    "RETURNING owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at",
                    (new_status, owner_id),
                )
                updated = cur.fetchone()
                ucols = [d[0] for d in cur.description] if cur.description else []
                conn.commit()
                return {"ok": True, "owner": _row_to_owner(updated, ucols)}
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
                cur.execute(
                    "SELECT owner_id, user_id, first_name, last_name, email, phone_number, document_url, status, created_at FROM tbl_owner WHERE user_id = %s",
                    (uid,),
                )
                row = cur.fetchone()
                if not row:
                    raise HTTPException(status_code=404, detail="No owner claim found")
                cols = [d[0] for d in cur.description] if cur.description else []
                return {"ok": True, "owner": dict(zip(cols, row))}
    except HTTPException:
        raise
    except psycopg.errors.UndefinedTable:
        raise HTTPException(status_code=500, detail="tbl_owner table not found in Neon. Run migration.")
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")
