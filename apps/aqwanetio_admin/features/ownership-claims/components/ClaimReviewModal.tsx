"use client";

import { useEffect, useMemo, useState } from "react";
import type { OwnerClaim } from "../services/ownership-claims.service";
import { reviewOwnerClaim } from "../services/ownership-claims.service";
import { fetchStations, type AdminStation } from "../services/stations.service";

function StatusPill({ status }: { status: OwnerClaim["status"] }) {
  const cls =
    status === "approved"
      ? "bg-admin-green-bg text-admin-green-text"
      : status === "rejected"
        ? "bg-admin-red-bg text-admin-red-text"
        : "bg-admin-gray-100 text-admin-text-secondary";
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-[0.55px] ${cls}`}>
      {status.toUpperCase()}
    </span>
  );
}

export default function ClaimReviewModal({
  claim,
  onClose,
  onReviewed,
}: {
  claim: OwnerClaim;
  onClose: () => void;
  onReviewed: (updated: OwnerClaim) => void;
}) {
  const [busy, setBusy] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState<string | null>(null);
  // ponytail: auto-preselect requested pin, searchable picker, OWNED badge not hidden
  const [selectedId, setSelectedId] = useState<number | null>(claim.station_id ?? null);
  const [stations, setStations] = useState<AdminStation[]>([]);
  const [stationsError, setStationsError] = useState<string | null>(null);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    setSelectedId(claim.station_id ?? null);
  }, [claim.station_id]);

  useEffect(() => {
    let cancelled = false;
    setStationsLoading(true);
    fetchStations()
      .then((rows) => {
        if (!cancelled) setStations(rows);
      })
      .catch((e) => {
        if (!cancelled) setStationsError(e instanceof Error ? e.message : "Failed to load stations");
      })
      .finally(() => {
        if (!cancelled) setStationsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return stations.slice(0, 80);
    return stations
      .filter(
        (s) =>
          s.location.toLowerCase().includes(needle) ||
          s.municipality.toLowerCase().includes(needle) ||
          (s.province ?? "").toLowerCase().includes(needle) ||
          String(s.stationId).includes(needle)
      )
      .slice(0, 80);
  }, [stations, q]);

  const selectedStation = useMemo(
    () => (selectedId != null ? stations.find((s) => s.stationId === selectedId) ?? null : null),
    [stations, selectedId]
  );

  async function handleReview(action: "approved" | "rejected") {
    setBusy(action);
    setError(null);
    try {
      const effective = selectedId ?? claim.station_id ?? null;
      if (action === "approved" && effective == null) {
        setError("Select a station to approve — pick from the list.");
        setBusy(null);
        return;
      }
      const updated = await reviewOwnerClaim(claim.owner_id, action, effective ?? undefined);
      onReviewed(updated);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Review failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1004] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-admin-surface border border-admin-border rounded-sm shadow-sm max-h-[90vh] w-full max-w-lg overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Review claim ${claim.owner_id}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-semibold text-admin-gray-400">
              {claim.first_name} {claim.last_name}
            </h2>
            <p className="text-[13px] text-admin-text-secondary">
              Claim #{claim.owner_id} • {claim.created_at ? new Date(claim.created_at).toLocaleString() : "—"}
            </p>
          </div>
          <StatusPill status={claim.status} />
        </div>

        <dl className="mt-4 flex flex-col gap-2 text-[14px]">
          <div className="flex flex-col gap-2">
            <dt className="text-[11px] font-bold tracking-[0.55px] text-admin-text-secondary">STATION</dt>
            <dd className="text-admin-gray-400">
              {claim.station_location ? (
                <p className="text-[13px]">
                  Requested: {claim.station_location}
                  {claim.station_municipality ? ` — ${claim.station_municipality}` : ""}
                  {claim.station_province ? `, ${claim.station_province}` : ""} #{claim.station_id}
                </p>
              ) : claim.station_id ? (
                <p className="text-[13px] font-mono">Requested: #{claim.station_id}</p>
              ) : (
                <p className="text-[13px] text-admin-text-muted">No pin requested — pick a station</p>
              )}

              <div className="mt-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search station name, municipality, province or ID…"
                  className="w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-[13px] text-admin-gray-400 placeholder:text-admin-text-muted"
                />
                {stationsLoading ? (
                  <p className="mt-2 text-[12px] text-admin-text-secondary">Loading stations…</p>
                ) : stationsError ? (
                  <p className="mt-2 text-[12px] text-admin-red-text">{stationsError}</p>
                ) : (
                  <div className="mt-2 max-h-[220px] overflow-auto rounded border border-admin-border">
                    {filtered.length === 0 ? (
                      <p className="px-3 py-6 text-[12px] text-admin-text-secondary">No stations match.</p>
                    ) : (
                      filtered.map((s) => {
                        const owned = !!s.ownerId;
                        const active = s.stationId === selectedId;
                        return (
                          <button
                            key={s.stationId}
                            type="button"
                            onClick={() => setSelectedId(s.stationId)}
                            className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13px] hover:bg-admin-sidebar ${active ? "bg-admin-green-bg" : ""}`}
                          >
                            <span className="text-admin-gray-400">
                              {s.location} — {s.municipality}
                              {s.province ? `, ${s.province}` : ""} <span className="font-mono text-[11px]">#{s.stationId}</span>
                            </span>
                            {owned ? (
                              <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">OWNED</span>
                            ) : (
                              <span className="shrink-0 rounded bg-admin-green-bg px-1.5 py-0.5 text-[10px] font-bold text-admin-green-text">FREE</span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
                {selectedStation && (
                  <p className="mt-2 text-[12px] text-admin-text-secondary">
                    Selected: {selectedStation.location} — {selectedStation.municipality} #{selectedStation.stationId}
                    {selectedStation.ownerId ? " (already owned)" : ""}
                  </p>
                )}
              </div>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-[11px] font-bold tracking-[0.55px] text-admin-text-secondary pt-0.5">EMAIL</dt>
            <dd className="text-admin-gray-400 break-all">{claim.email}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-[11px] font-bold tracking-[0.55px] text-admin-text-secondary pt-0.5">PHONE</dt>
            <dd className="text-admin-gray-400 font-mono text-[13px]">{claim.phone_number}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-[11px] font-bold tracking-[0.55px] text-admin-text-secondary pt-0.5">USER ID</dt>
            <dd className="text-admin-gray-400 font-mono text-[13px] break-all">{claim.user_id}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-[11px] font-bold tracking-[0.55px] text-admin-text-secondary pt-0.5">PROOF</dt>
            <dd>
              <a
                href={claim.document_url}
                target="_blank"
                rel="noreferrer"
                className="text-admin-blue underline break-all"
              >
                {claim.document_url}
              </a>
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-[13px] text-admin-text-secondary">
          Auto-preselected from the pin the user claimed. Keep it or search & pick another — owned stations show OWNED badge but remain selectable.
        </p>

        {error && <p className="mt-2 text-[13px] text-admin-red-text">{error}</p>}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded border border-admin-border px-4 py-2.5 text-[11px] font-bold tracking-[0.55px] text-admin-text-secondary hover:bg-admin-sidebar"
          >
            CLOSE
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => handleReview("rejected")}
            className="flex-1 rounded bg-admin-red px-4 py-2.5 text-[11px] font-bold tracking-[0.55px] text-white hover:opacity-90 disabled:opacity-50"
          >
            {busy === "rejected" ? "…" : "REJECT"}
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => handleReview("approved")}
            className="flex-1 rounded bg-admin-green px-4 py-2.5 text-[11px] font-bold tracking-[0.55px] text-white hover:opacity-90 disabled:opacity-50"
          >
            {busy === "approved" ? "…" : "CONFIRM OWNER"}
          </button>
        </div>
      </div>
    </div>
  );
}
