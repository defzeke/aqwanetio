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

_frontend_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
_default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "https://aqwanetio-km0b.onrender.com",
    "https://aqwanetio-1.onrender.com",
]
origins = _frontend_origins if _frontend_origins else _default_origins

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