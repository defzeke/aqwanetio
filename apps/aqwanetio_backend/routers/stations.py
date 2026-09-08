from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, constr, confloat
from typing import Optional
import os
import psycopg

router = APIRouter()

class StationCreate(BaseModel):
    location: constr(strip_whitespace=True, min_length=1, max_length=120)  # type: ignore
    municipality: constr(strip_whitespace=True, min_length=1, max_length=120)  # type: ignore
    province: Optional[constr(strip_whitespace=True, max_length=120)] = None  # type: ignore
    region: constr(strip_whitespace=True, min_length=1, max_length=120)  # type: ignore
    latitude: confloat(ge=4.0, le=21.5)  # type: ignore
    longitude: confloat(ge=116.0, le=127.5)  # type: ignore

def _get_conn():
    dsn = os.getenv("DATABASE_URL")
    if not dsn:
        raise HTTPException(status_code=500, detail="DATABASE_URL not set on server")
    return psycopg.connect(dsn)

@router.get("/stations")
def list_stations():
    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT station_id, location, municipality, province, region, latitude, longitude FROM tbl_station ORDER BY station_id"
                )
                rows = cur.fetchall()
                cols = [d[0] for d in cur.description] if cur.description else []
                result = []
                for r in rows:
                    d = dict(zip(cols, r))
                    result.append(
                        {
                            "stationId": d["station_id"],
                            "location": d["location"],
                            "municipality": d["municipality"],
                            "province": d["province"],
                            "region": d["region"],
                            "latitude": float(d["latitude"]),
                            "longitude": float(d["longitude"]),
                        }
                    )
                return result
    except psycopg.errors.UndefinedTable:
        raise HTTPException(status_code=500, detail="tbl_station table not found in Neon. Run migration.")
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stations/{station_id}")
def get_station(station_id: int):
    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT station_id, location, municipality, province, region, latitude, longitude FROM tbl_station WHERE station_id = %s",
                    (station_id,),
                )
                row = cur.fetchone()
                if not row:
                    raise HTTPException(status_code=404, detail="Station not found")
                cols = [d[0] for d in cur.description]
                d = dict(zip(cols, row))
                return {
                    "stationId": d["station_id"],
                    "location": d["location"],
                    "municipality": d["municipality"],
                    "province": d["province"],
                    "region": d["region"],
                    "latitude": float(d["latitude"]),
                    "longitude": float(d["longitude"]),
                }
    except HTTPException:
        raise
    except psycopg.errors.UndefinedTable:
        raise HTTPException(status_code=500, detail="tbl_station table not found in Neon. Run migration.")
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")


@router.post("/stations")
def create_station(payload: StationCreate):
    province_val = payload.province.strip() if isinstance(payload.province, str) and payload.province.strip() else None
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
                    (new_id, payload.location, payload.municipality, province_val, payload.region, payload.latitude, payload.longitude),
                )
                conn.commit()
    except psycopg.errors.UndefinedTable:
        raise HTTPException(status_code=500, detail="tbl_station table not found in Neon. Run migration.")
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"ok": True, "id": new_id}
