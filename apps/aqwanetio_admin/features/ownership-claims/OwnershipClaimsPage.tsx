"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ClaimReviewModal from "./components/ClaimReviewModal";
import type { OwnerClaim, OwnerClaimStatus } from "./services/ownership-claims.service";
import { listOwnerClaims } from "./services/ownership-claims.service";

type Filter = "all" | OwnerClaimStatus;

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: "all", label: "ALL" },
  { key: "pending", label: "PENDING" },
  { key: "approved", label: "APPROVED" },
  { key: "rejected", label: "REJECTED" },
];

export default function OwnershipClaimsPage() {
  const [claims, setClaims] = useState<OwnerClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<OwnerClaim | null>(null);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listOwnerClaims();
      setClaims(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load claims");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: claims.length, pending: 0, approved: 0, rejected: 0 };
    for (const r of claims) c[r.status] += 1;
    return c;
  }, [claims]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return claims.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      const name = `${r.first_name} ${r.last_name}`.toLowerCase();
      const station = `${r.station_location ?? ""} ${r.station_municipality ?? ""}`.toLowerCase();
      return (
        name.includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone_number.toLowerCase().includes(q) ||
        station.includes(q) ||
        String(r.owner_id).includes(q) ||
        String(r.station_id ?? "").includes(q)
      );
    });
  }, [claims, filter, query]);

  function handleReviewed(updated: OwnerClaim) {
    setClaims((prev) => prev.map((r) => (r.owner_id === updated.owner_id ? updated : r)));
    setSelected((cur) => (cur && cur.owner_id === updated.owner_id ? updated : cur));
  }

  function handleRemoved(ownerId: number) {
    setClaims((prev) => prev.filter((r) => r.owner_id !== ownerId));
    setSelected(null);
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-12 pt-24 px-6 max-w-[1440px] mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-bold text-admin-text tracking-tight">Ownership Claims</h1>
        <p className="text-[14px] text-admin-text-secondary">
          Review pond ownership claims and confirm whether the claimant is the pond owner.
        </p>
      </div>

      <div className="bg-admin-surface border border-admin-border rounded-sm shadow-sm w-full overflow-clip">
        <div className="flex flex-col gap-3 px-6 pt-4 pb-4 border-b border-admin-border sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded px-3 py-1.5 text-[11px] font-bold tracking-[0.55px] ${
                  filter === f.key
                    ? "bg-admin-text text-white"
                    : "text-admin-text-secondary hover:bg-admin-sidebar"
                }`}
              >
                {f.label} ({counts[f.key]})
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, station…"
              className="h-10 w-full sm:w-64 rounded border border-admin-border bg-admin-surface px-3 text-[14px] text-admin-gray-400 placeholder:text-admin-text-muted"
            />
            <button
              onClick={fetchClaims}
              disabled={loading}
              className="h-10 rounded border border-admin-border bg-admin-surface px-4 text-[11px] font-bold tracking-[0.55px] text-admin-text hover:bg-admin-sidebar disabled:opacity-50"
            >
              {loading ? "…" : "REFRESH"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="px-6 py-10 text-[14px] text-admin-text-secondary">Loading claims…</p>
          ) : error ? (
            <p className="px-6 py-10 text-[14px] text-admin-red-text">{error}</p>
          ) : visible.length === 0 ? (
            <p className="px-6 py-10 text-[14px] text-admin-text-secondary">
              No {filter === "all" ? "" : `${filter} `}claims found.
            </p>
          ) : (
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="bg-admin-sidebar border-b border-admin-border">
                  {["CLAIM", "OWNER", "STATION", "EMAIL", "PHONE", "SUBMITTED", "STATUS", "ACTION"].map((h) => (
                    <th
                      key={h}
                      className="text-[11px] font-bold text-admin-text-secondary tracking-[0.55px] px-4 py-3 text-left"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((r, i) => (
                  <tr key={r.owner_id} className={i > 0 ? "border-t border-admin-border" : ""}>
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-mono font-medium text-admin-gray-400">#{r.owner_id}</span>
                    </td>
                    <td className="px-4 py-3 text-[14px] font-semibold text-admin-gray-400">
                      {r.first_name} {r.last_name}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-admin-gray-400">
                      {r.station_location ? (
                        <span>
                          {r.station_location}
                          {r.station_municipality ? ` — ${r.station_municipality}` : ""}
                        </span>
                      ) : r.station_id ? (
                        <span className="font-mono text-[12px]">#{r.station_id}</span>
                      ) : (
                        <span className="text-admin-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-admin-gray-400 break-all">{r.email}</td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-mono font-medium text-admin-gray-400">{r.phone_number}</span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-admin-text-secondary">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === "approved"
                            ? "bg-admin-green-bg text-admin-green-text"
                            : r.status === "rejected"
                              ? "bg-admin-red-bg text-admin-red-text"
                              : "bg-admin-gray-100 text-admin-text-secondary"
                        }`}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(r)}
                        className="rounded border border-admin-border px-3 py-1.5 text-[11px] font-bold tracking-[0.55px] text-admin-text hover:bg-admin-sidebar"
                      >
                        REVIEW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && (
        <ClaimReviewModal
          claim={selected}
          onClose={() => setSelected(null)}
          onReviewed={handleReviewed}
          onRemoved={handleRemoved}
        />
      )}
    </div>
  );
}
