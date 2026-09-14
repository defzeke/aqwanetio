"use client";

import { useState } from "react";
import type { OwnerClaim } from "../services/ownership-claims.service";
import { deleteOwnerClaim, reviewOwnerClaim } from "../services/ownership-claims.service";

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
  onRemoved,
}: {
  claim: OwnerClaim;
  onClose: () => void;
  onReviewed: (updated: OwnerClaim) => void;
  onRemoved?: (ownerId: number) => void;
}) {
  const [busy, setBusy] = useState<"approved" | "rejected" | "remove" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReview(action: "approved" | "rejected") {
    setBusy(action);
    setError(null);
    try {
      const updated = await reviewOwnerClaim(claim.owner_id, action);
      onReviewed(updated);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Review failed");
    } finally {
      setBusy(null);
    }
  }

  async function handleRemove() {
    if (!confirm(`Remove ownership of ${claim.station_location ?? `#${claim.station_id ?? "?"}`} ? This deletes the claim and frees the pond.`)) return;
    setBusy("remove");
    setError(null);
    try {
      await deleteOwnerClaim(claim.owner_id);
      onRemoved?.(claim.owner_id);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Remove failed");
    } finally {
      setBusy(null);
    }
  }

  const canConfirm = claim.status === "pending" && claim.station_id != null;

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
          <div className="flex flex-col gap-1">
            <dt className="text-[11px] font-bold tracking-[0.55px] text-admin-text-secondary">STATION</dt>
            <dd className="text-admin-gray-400">
              {claim.station_location ? (
                <p className="text-[14px] font-semibold">
                  {claim.station_location}
                  {claim.station_municipality ? ` — ${claim.station_municipality}` : ""}
                  {claim.station_province ? `, ${claim.station_province}` : ""}
                  <span className="ml-2 font-mono text-[12px] font-normal">#{claim.station_id}</span>
                </p>
              ) : claim.station_id ? (
                <p className="text-[13px] font-mono">#{claim.station_id}</p>
              ) : (
                <p className="text-[13px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                  No pin requested — ask user to re-submit claim from map pin
                </p>
              )}
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

        {error && <p className="mt-2 text-[13px] text-admin-red-text">{error}</p>}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy !== null}
            className="flex-1 rounded border border-admin-border px-4 py-2.5 text-[11px] font-bold tracking-[0.55px] text-admin-text-secondary hover:bg-admin-sidebar disabled:opacity-50"
          >
            CLOSE
          </button>
          {claim.status === "approved" ? (
            <button
              type="button"
              disabled={busy !== null}
              onClick={handleRemove}
              className="flex-1 rounded bg-amber-600 px-4 py-2.5 text-[11px] font-bold tracking-[0.55px] text-white hover:opacity-90 disabled:opacity-50"
            >
              {busy === "remove" ? "…" : "REMOVE OWNERSHIP"}
            </button>
          ) : (
            <button
              type="button"
              disabled={busy !== null || claim.status !== "pending"}
              onClick={() => handleReview("rejected")}
              className="flex-1 rounded bg-admin-red px-4 py-2.5 text-[11px] font-bold tracking-[0.55px] text-white hover:opacity-90 disabled:opacity-50"
            >
              {busy === "rejected" ? "…" : "REJECT"}
            </button>
          )}
          {claim.status === "pending" && (
            <button
              type="button"
              disabled={busy !== null || !canConfirm}
              title={!canConfirm ? "No requested station – cannot confirm" : undefined}
              onClick={() => handleReview("approved")}
              className="flex-1 rounded bg-admin-green px-4 py-2.5 text-[11px] font-bold tracking-[0.55px] text-white hover:opacity-90 disabled:opacity-50"
            >
              {busy === "approved" ? "…" : "CONFIRM OWNER"}
            </button>
          )}
          {claim.status !== "pending" && claim.status !== "approved" && (
            <button
              type="button"
              disabled={busy !== null}
              onClick={handleRemove}
              className="flex-1 rounded bg-admin-red px-4 py-2.5 text-[11px] font-bold tracking-[0.55px] text-white hover:opacity-90 disabled:opacity-50"
            >
              {busy === "remove" ? "…" : "DELETE CLAIM"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
