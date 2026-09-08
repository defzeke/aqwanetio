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


class LoginPayload(BaseModel):
    email: EmailStr
    password: constr(min_length=1, max_length=128)  # type: ignore


class UpdateProfilePayload(BaseModel):
    firstName: constr(strip_whitespace=True, min_length=1, max_length=50)  # type: ignore
    lastName: constr(strip_whitespace=True, min_length=1, max_length=50)  # type: ignore
    phone: constr(strip_whitespace=True, min_length=1, max_length=50)  # type: ignore


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


@router.post("/login")
async def login(payload: LoginPayload):
    email_trim = payload.email.strip().lower()

    # 1. check user exists in Auth
    try:
        admin_auth.get_user_by_email(email_trim)
    except admin_auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Auth lookup failed: {e}")

    # 2. verify password via Identity Toolkit REST (strict, no bypass)
    api_key = (
        os.getenv("FIREBASE_WEB_API_KEY")
        or os.getenv("FIREBASE_API_KEY")
        or os.getenv("NEXT_PUBLIC_FIREBASE_API_KEY")
    )
    if not api_key:
        try:
            backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            web_env = os.path.join(os.path.dirname(backend_dir), "aqwanetio_website", ".env")
            if os.path.exists(web_env):
                with open(web_env, "r", encoding="utf-8") as f:
                    for line in f:
                        if line.strip().startswith("NEXT_PUBLIC_FIREBASE_API_KEY="):
                            api_key = line.strip().split("=", 1)[1].strip('"\'')
                            break
        except Exception:
            pass

    if not api_key:
        raise HTTPException(status_code=500, detail="FIREBASE_WEB_API_KEY not set on server")

    import httpx

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post(
            f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}",
            json={
                "email": email_trim,
                "password": payload.password,
                "returnSecureToken": True,
            },
        )
        if resp.status_code != 200:
            try:
                err_json = resp.json()
                err_msg = err_json.get("error", {}).get("message", "") or resp.text or "Invalid credentials"
            except Exception:
                err_msg = resp.text or "Invalid credentials"
            raise HTTPException(status_code=401, detail=err_msg)

        data = resp.json()
        id_token = data.get("idToken")
        refresh_token = data.get("refreshToken")
        local_id = data.get("localId")

        # verify idToken matches
        try:
            decoded = admin_auth.verify_id_token(id_token)
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Token verify failed: {e}")

        # fetch Firestore profile
        try:
            doc = _get_db().collection("users").document(decoded["uid"]).get()
            profile = doc.to_dict() if doc.exists else None
        except Exception:
            profile = None

        return {
            "ok": True,
            "uid": decoded["uid"],
            "localId": local_id,
            "idToken": id_token,
            "refreshToken": refresh_token,
            "profile": profile,
        }


@router.get("/me")
async def auth_me(decoded=Depends(get_token)):
    return {"uid": decoded.get("uid"), "email": decoded.get("email")}


@router.get("/profile")
async def get_profile(decoded=Depends(get_token)):
    uid = decoded.get("uid")
    doc = _get_db().collection("users").document(uid).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"ok": True, "profile": doc.to_dict()}


@router.put("/profile")
async def update_profile(payload: UpdateProfilePayload, decoded=Depends(get_token)):
    uid = decoded.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Token has no uid")
    # server-side phone re-check (PH) – keep simple
    phone_trim = payload.phone.strip()
    if not phone_trim:
        raise HTTPException(status_code=400, detail="Phone is required")
    data = {
        "firstName": payload.firstName.strip()[:50],
        "lastName": payload.lastName.strip()[:50],
        "phone": phone_trim,
        "updatedAt": firestore.SERVER_TIMESTAMP,
    }
    try:
        db = _get_db()
        db.collection("users").document(uid).update(data)
        doc = db.collection("users").document(uid).get()
        profile = doc.to_dict() if doc.exists else data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile update failed: {e}")
    return {"ok": True, "profile": profile}
