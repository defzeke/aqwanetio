from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, EmailStr, constr
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth as admin_auth, firestore
import os

router = APIRouter()


def _init_firebase():
    if not firebase_admin._apps:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        key_path = os.path.join(base_dir, "serviceAccountKey.json")
        if not os.path.exists(key_path):
            key_path = "serviceAccountKey.json"
        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred)


try:
    _init_firebase()
    _db = firestore.client()
except Exception:
    _db = None


def _get_db():
    global _db
    if _db is None:
        _init_firebase()
        return firestore.client()
    return _db


class RegisterPayload(BaseModel):
    firstName: constr(strip_whitespace=True, min_length=1, max_length=50)  # type: ignore
    lastName: constr(strip_whitespace=True, min_length=1, max_length=50)  # type: ignore
    email: EmailStr
    phone: str
    password: Optional[constr(min_length=8, max_length=128)] = None  # type: ignore


def get_optional_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        return None
    try:
        decoded = admin_auth.verify_id_token(token)
        return decoded
    except Exception:
        return None


def get_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Empty token")
    try:
        decoded = admin_auth.verify_id_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
    return decoded


@router.post("/register")
async def register_extra_infos(
    payload: RegisterPayload, decoded: Optional[dict] = Depends(get_optional_token)
):
    email_trim = payload.email.strip().lower()
    phone_trim = payload.phone.strip()
    if not phone_trim:
        raise HTTPException(status_code=400, detail="Phone is required")

    # Protected path: Bearer token present -> use token uid
    if decoded is not None:
        uid = decoded.get("uid")
        if not uid:
            raise HTTPException(status_code=401, detail="Token has no uid")
        token_email = decoded.get("email")
        if token_email and token_email.lower().strip() != email_trim:
            raise HTTPException(status_code=400, detail="Email mismatch with token")
    else:
        if not payload.password:
            raise HTTPException(
                status_code=400,
                detail="Password required when no Bearer token (public test).",
            )
        try:
            user = admin_auth.create_user(
                email=email_trim, password=payload.password, email_verified=False
            )
            uid = user.uid
        except Exception as e:
            err = str(e).lower()
            if "already exists" in err or "email-already-exists" in err or "duplicate" in err:
                try:
                    existing = admin_auth.get_user_by_email(email_trim)
                    uid = existing.uid
                except Exception as ex:
                    raise HTTPException(
                        status_code=400, detail=f"Email already exists but fetch failed: {ex}"
                    )
            else:
                try:
                    if getattr(e, "code", "") == "email-already-exists":
                        existing = admin_auth.get_user_by_email(email_trim)
                        uid = existing.uid
                    else:
                        raise
                except HTTPException:
                    raise
                except Exception:
                    raise HTTPException(status_code=400, detail=f"Auth create failed: {e}")

    doc = {
        "uid": uid,
        "firstName": payload.firstName.strip()[:50],
        "lastName": payload.lastName.strip()[:50],
        "email": email_trim,
        "phone": phone_trim,
        "role": "unverified",
        "createdAt": firestore.SERVER_TIMESTAMP,
        "updatedAt": firestore.SERVER_TIMESTAMP,
    }

    try:
        db = _get_db()
        db.collection("users").document(uid).set(doc, merge=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Firestore write failed: {e}")

    return {"ok": True, "uid": uid}


@router.get("/me")
async def auth_me(decoded=Depends(get_token)):
    return {"uid": decoded.get("uid"), "email": decoded.get("email")}
