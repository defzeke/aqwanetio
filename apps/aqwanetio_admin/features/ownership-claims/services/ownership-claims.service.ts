export type OwnerClaimStatus = "pending" | "approved" | "rejected";

export interface OwnerClaim {
  owner_id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  document_url: string;
  status: OwnerClaimStatus;
  created_at: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function parseError(res: Response): Promise<string> {
  const data = await res.json().catch(() => ({}));
  const detail = (data as { detail?: unknown }).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((d) => (typeof d === "object" && d !== null && "msg" in d ? String((d as { msg: unknown }).msg) : JSON.stringify(d)))
      .join("; ");
  return `Request failed (${res.status})`;
}

export async function listOwnerClaims(status?: OwnerClaimStatus | "all"): Promise<OwnerClaim[]> {
  const url =
    status && status !== "all"
      ? `${API_BASE}/owners/claims?status=${status}`
      : `${API_BASE}/owners/claims`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(await parseError(res));
  const data = await res.json();
  return (data.claims ?? []) as OwnerClaim[];
}

export async function reviewOwnerClaim(
  ownerId: number,
  action: "approved" | "rejected"
): Promise<OwnerClaim> {
  const res = await fetch(`${API_BASE}/owners/claims/${ownerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = await res.json();
  return data.owner as OwnerClaim;
}
