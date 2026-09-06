from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, constr, confloat
import os
import psycopg

router = APIRouter()

class StationCreate(BaseModel):
    location: constr(strip_whitespace=True, min_length=1, max_length=120)  # type: ignore
    municipality: constr(strip_whitespace=True, min_length=1, max_length=120)  # type: ignore
    province: constr(strip_whitespace=True, min_length=1, max_length=120)  # type: ignore
    region: constr(strip_whitespace=True, min_length=1, max_length=120)  # type: ignore
    latitude: confloat(ge=4.0, le=21.5)  # type: ignore
    longitude: confloat(ge=116.0, le=127.5)  # type: ignore

def _get_conn():
    dsn = os.getenv("DATABASE_URL")
    if not dsn:
        raise HTTPException(status_code=500, detail="DATABASE_URL not set on server")
    return psycopg.connect(dsn)

@router.post("/stations")
def create_station(payload: StationCreate):
    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT COALESCE(MAX(station_id), 0) + 1 FROM tbl_station")
                new_id = cur.fetchone()[0]
                cur.execute(
                    """
                    INSERT INTO tbl_station (station_id, location, municipality, province, region, latitude, longitude)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """,
                    (new_id, payload.location, payload.municipality, payload.province, payload.region, payload.latitude, payload.longitude),
                )
                conn.commit()
    except psycopg.errors.UndefinedTable:
        raise HTTPException(status_code=500, detail="tbl_station table not found in Neon. Run migration.")
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"ok": True, "id": new_id}
