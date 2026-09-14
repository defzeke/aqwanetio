from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.auth import router as auth_router
from routers.stations import router as stations_router
from routers.owners import router as owners_router

app = FastAPI()

# Allow website and Flutter clients to talk to FastAPI
# allow Render static site + localhost; explicit list needed when allow_credentials=True (firefox blocks * with creds)
import os
import re

_raw = os.getenv("ALLOWED_ORIGINS", "")
# strip markdown paste like [url](url) that broke localhost:3000 preflight — extract https:// url
_frontend_origins = []
for _o in _raw.split(","):
    _o = _o.strip()
    if not _o:
        continue
    m = re.search(r'https?://[^\s\]\)]+', _o)
    if m:
        _o = m.group(0)
    _o = _o.strip(" []()")
    if _o:
        _frontend_origins.append(_o)
_default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "https://aqwanetio-km0b.onrender.com",
    "https://aqwanetio.onrender.com",
    "https://aqwanetio-1.onrender.com",
]
# merge defaults + env so markdown/paste can't shadow localhost
origins = list(dict.fromkeys(_default_origins + _frontend_origins))

# keep * fallback if no explicit origins; Use explicit list so Authorization header works with credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(stations_router, tags=["stations"])
app.include_router(owners_router, tags=["owners"])

@app.get("/")
def read_root():
    return {"message": "Backend is live!"}