"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useSettings } from "@/lib/settings-context";
import { useTranslation } from "@/lib/translations";

export default function ProfilePage() {
  const { user, loading: authLoading, setUserFromBackend } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const { theme, toggleTheme, language, setLanguage, notifications, toggleNotifications } = useSettings();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }
    const fetchProfile = async () => {
      const token = localStorage.getItem("aqw-idToken") || sessionStorage.getItem("aqw-idToken");
      if (!token) {
        setFirstName(user.name.split(" ")[0] || "");
        setLastName(user.name.split(" ").slice(1).join(" ") || "");
        setEmail(user.email);
        setPhone("");
        setRole(user.role);
        setLoading(false);
        return;
      }
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${apiUrl}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to load profile");
        const p = data.profile;
        setFirstName(p?.firstName || user.name.split(" ")[0] || "");
        setLastName(p?.lastName || user.name.split(" ").slice(1).join(" ") || "");
        setEmail(p?.email || user.email);
        setPhone(p?.phone || "");
        setRole(p?.role || user.role);
      } catch (e: any) {
        setError(e.message);
        // fallback to auth context
        setFirstName(user.name.split(" ")[0] || "");
        setLastName(user.name.split(" ").slice(1).join(" ") || "");
        setEmail(user.email);
        setRole(user.role);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, authLoading, router]);

  const firstTrim = firstName.trim();
  const lastTrim = lastName.trim();
  const isValid =
    firstTrim.length > 0 &&
    firstTrim.length <= 50 &&
    lastTrim.length > 0 &&
    lastTrim.length <= 50;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || saving) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("aqw-idToken") || sessionStorage.getItem("aqw-idToken");
      if (!token) throw new Error("Not authenticated");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ firstName: firstTrim, lastName: lastTrim, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to save");
      const p = data.profile;
      setSuccess(t("auth.saved"));
      // update context
      if (p) {
        const name = `${p.firstName} ${p.lastName}`.trim();
        setUserFromBackend({ id: p.uid || user!.id, email: p.email || email, name, role: (p.role as any) || role });
      }
    } catch (err: any) {
      setError(err.message || t("auth.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return <div className="mx-auto max-w-3xl p-6 text-muted">Loading...</div>;
  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">{t("auth.profileTitle")}</h1>
        <p className="mt-1 text-sm text-muted">{t("auth.profileSubtitle")}</p>
      </div>

      <div className="neu-card p-6">
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan/15">
            <UserCircle className="h-10 w-10 text-cyan" />
          </span>
          <div>
            <p className="text-lg font-semibold text-ink">{firstName} {lastName}</p>
            <p className="text-sm text-muted">{email}</p>
            <span className="mt-1 inline-block rounded-full bg-raised px-2 py-0.5 text-xs font-medium text-muted">{role}</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <h3 className="text-sm font-semibold text-ink">{t("auth.personalInfo")}</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink" htmlFor="firstName">{t("auth.firstName")}</label>
              <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={50} required className="neu-input h-12 w-full rounded-xl px-4 text-base" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink" htmlFor="lastName">{t("auth.lastName")}</label>
              <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={50} required className="neu-input h-12 w-full rounded-xl px-4 text-base" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink" htmlFor="email">{t("auth.email")}</label>
            <input id="email" value={email} disabled className="neu-input h-12 w-full rounded-xl px-4 text-base opacity-60" />
            <p className="text-xs text-muted">Email cannot be changed</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink" htmlFor="phone">{t("auth.phoneNumber")}</label>
            <input id="phone" value={phone} disabled className="neu-input h-12 w-full rounded-xl px-4 text-base opacity-60" />
            <p className="text-xs text-muted">Phone number cannot be changed</p>
          </div>

          {error && <p className="rounded-lg bg-alert/10 px-3 py-2 text-sm text-alert">{error}</p>}
          {success && <p className="rounded-lg bg-safe/10 px-3 py-2 text-sm text-safe">{success}</p>}

          <button type="submit" disabled={!isValid || saving} className="btn btn-cyan btn-shine h-12 w-full rounded-xl text-base font-bold disabled:opacity-50">
            {saving ? "Saving..." : t("auth.save")}
          </button>
        </form>

        <div className="mt-8 border-t border-line pt-6">
          <h3 className="mb-3 text-sm font-semibold text-ink">{t("auth.preferences")}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">{t("settings.darkMode")}</span>
              <button onClick={toggleTheme} className={`relative inline-flex h-5 w-9 rounded-full ${theme==="dark" ? "bg-cyan":"bg-line"}`}><span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${theme==="dark" ? "translate-x-4":"translate-x-0"}`} /></button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">{t("settings.language")}</span>
              <button onClick={() => setLanguage(language==="en"?"fil":"en")} className="btn btn-ghost px-3 py-1 text-sm">{language==="en"?"EN":"FIL"}</button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">{t("settings.notifications")}</span>
              <button onClick={toggleNotifications} className={`relative inline-flex h-5 w-9 rounded-full ${notifications?"bg-cyan":"bg-line"}`}><span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${notifications?"translate-x-4":"translate-x-0"}`} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
