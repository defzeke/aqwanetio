"use client";

import { useEffect, useState } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "@/lib/translations";
import type { Station } from "@/features/stations/services/stations.service";
import type { Pond } from "../services";

export default function ClaimPondModal({
  station,
  mock,
  onClose,
}: {
  station: Station;
  mock: Pond;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const parts = user.name.trim().split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      if ((user as any).phone) setPhone((user as any).phone);
      else {
        // fallback fetch phone if not in context yet
        const token = localStorage.getItem("aqw-idToken") || sessionStorage.getItem("aqw-idToken");
        if (token) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
          fetch(`${apiUrl}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((d) => { if (d.profile?.phone) setPhone(d.profile.phone); })
            .catch(() => {});
        }
      }
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [user, onClose]);

  const firstTrim = firstName.trim();
  const lastTrim = lastName.trim();
  const emailTrim = email.trim();
  const phoneTrim = phone.trim();
  const docTrim = documentUrl.trim();

  const phoneValid = phoneTrim.length > 0 && isValidPhoneNumber(phoneTrim, "PH");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim);
  const isDocValid = docTrim.length > 0 && (() => { try { const u = new URL(docTrim); return u.hostname.includes("drive.google.com"); } catch { return false; } })();

  const isValid =
    firstTrim.length > 0 &&
    firstTrim.length <= 50 &&
    lastTrim.length > 0 &&
    lastTrim.length <= 50 &&
    isEmailValid &&
    phoneValid &&
    isDocValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const token = localStorage.getItem("aqw-idToken") || sessionStorage.getItem("aqw-idToken");
      if (!token) {
        setSubmitError("Login required to submit a claim.");
        return;
      }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/owners/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: firstTrim,
          last_name: lastTrim,
          email: emailTrim,
          phone_number: phoneTrim,
          document_url: docTrim,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = typeof data?.detail === "string" ? data.detail : Array.isArray(data?.detail) ? data.detail.map((d: { msg?: string }) => d?.msg || JSON.stringify(d)).join("; ") : "Submit failed";
        setSubmitError(detail);
        return;
      }
      console.log("Claim pond saved", data?.owner);
      setSubmitted(true);
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1004] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="neu-card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t("mapPopup.claimPond")}
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold text-ink">{t("mapPopup.claimPond")}</h2>
          <p className="text-sm text-muted">{t("mapPopup.claimPondDesc", { location: station.location })}</p>
          <p className="mt-1 text-xs text-muted">
            {station.municipality}, {station.province} • {station.region} • NH₃ {mock.ammoniaLevel} ppm
          </p>
        </div>

        {submitted ? (
          <div className="rounded-lg bg-safe/10 px-4 py-3 text-sm text-safe">{t("claim.submitted")}</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink" htmlFor="claimFirstName">First name *</label>
                <input id="claimFirstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={50} required placeholder={t("auth.firstNamePlaceholder")} className="neu-input h-11 w-full rounded-xl px-4 text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink" htmlFor="claimLastName">Last name *</label>
                <input id="claimLastName" value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={50} required placeholder={t("auth.lastNamePlaceholder")} className="neu-input h-11 w-full rounded-xl px-4 text-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink" htmlFor="claimEmail">Email *</label>
              <input id="claimEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={t("auth.emailPlaceholder")} className="neu-input h-11 w-full rounded-xl px-4 text-sm" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink" htmlFor="claimPhone">Phone number *</label>
              <input id="claimPhone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("auth.phonePlaceholder")} required className={`neu-input h-11 w-full rounded-xl px-4 text-sm ${touched && !phoneValid ? "border-alert focus:border-alert" : ""}`} />
              {touched && !phoneValid && <p className="text-xs text-alert">{phoneTrim === "" ? t("auth.phoneRequired") : t("auth.phoneInvalid")}</p>}
            </div>

            <div className="rounded-lg bg-raised p-3 text-xs text-muted">
              <p className="font-semibold text-ink">{t("claim.driveGuideTitle")}</p>
              <ol className="mt-1 list-decimal space-y-1 pl-4">
                <li>{t("claim.driveGuideStep1")}</li>
                <li>{t("claim.driveGuideStep2")}</li>
                <li>{t("claim.driveGuideStep3")}</li>
                <li>{t("claim.driveGuideStep4")}</li>
              </ol>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink" htmlFor="claimDoc">{t("claim.documentUrl")} *</label>
              <input
                id="claimDoc"
                type="url"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                required
                className="neu-input h-11 w-full rounded-xl px-4 text-sm"
              />
              {touched && !isDocValid && docTrim.length > 0 && <p className="text-xs text-alert">Must be a valid Google Drive link (https://drive.google.com/...)</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn btn-ghost flex-1 h-11 rounded-xl text-sm">{t("claim.cancel")}</button>
              <button type="submit" disabled={!isValid || submitting} className="btn btn-cyan btn-shine flex-1 h-11 rounded-xl text-sm font-bold disabled:opacity-50">
                {submitting ? "..." : t("claim.submit")}
              </button>
            </div>
            {submitError && <p className="text-xs text-alert">{submitError}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
