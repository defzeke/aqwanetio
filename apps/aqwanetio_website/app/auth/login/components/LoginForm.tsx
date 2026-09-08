"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/lib/translations";
import { useAuth } from "@/lib/auth-context";

export default function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setUserFromBackend } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailTrim = email.trim().toLowerCase();
  const isValid = emailTrim.length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailTrim, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const detail = Array.isArray(data.detail)
          ? data.detail.map((d: any) => d.msg).join(", ")
          : data.detail || data.message || "Login failed";
        throw new Error(detail);
      }

      // store tokens if present
      if (data.idToken) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("aqw-idToken", data.idToken);
        if (data.refreshToken) storage.setItem("aqw-refreshToken", data.refreshToken);
        localStorage.setItem("aqw-uid", data.uid);
      }

      // set user in context from profile
      const profile = data.profile;
      const name = profile?.firstName
        ? `${profile.firstName} ${profile.lastName ?? ""}`.trim()
        : emailTrim.split("@")[0];
      const role = (profile?.role as any) || "unverified";
      setUserFromBackend({ id: data.uid, email: emailTrim, name, role });

      router.push("/map");
    } catch (err: any) {
      const msg = err?.message || "Login failed. Please try again.";
      if (msg.includes("User not found") || msg.includes("404")) {
        setError("User not found. Please check your email or register.");
      } else if (msg.includes("INVALID_PASSWORD") || msg.includes("INVALID_LOGIN_CREDENTIALS") || msg.toLowerCase().includes("invalid credentials")) {
        setError("Invalid email or password.");
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink" htmlFor="email">
          {t("auth.email")}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
            <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("auth.emailPlaceholder")}
            className="neu-input h-12 w-full rounded-xl pl-[41px] pr-4 text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-ink" htmlFor="password">
            {t("auth.password")}
          </label>
          <Link href="#" className="text-sm font-medium text-cyan transition-colors hover:text-cyan-light">
            {t("auth.forgotPassword")}
          </Link>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
            <svg className="h-[21px] w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="neu-input h-12 w-full rounded-xl pl-[41px] pr-12 text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-muted hover:text-ink"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg className="h-[15px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="h-[15px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <label className="flex cursor-pointer select-none items-center gap-2.5">
        <input
          id="remember"
          type="checkbox"
          className="peer sr-only"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border border-line bg-input-bg transition-colors duration-150 peer-checked:border-cyan peer-checked:bg-cyan peer-focus-visible:ring-2 peer-focus-visible:ring-cyan/50">
          <svg className="h-3 w-3 text-[#02131c] opacity-0 transition-opacity duration-150 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </span>
        <span className="text-sm font-medium text-muted">
          {t("auth.rememberDevice")}
        </span>
      </label>

      {error && <p className="rounded-lg bg-alert/10 px-3 py-2 text-sm text-alert">{error}</p>}

      <button
        type="submit"
        disabled={!isValid || submitting}
        className="btn btn-cyan btn-shine h-12 w-full rounded-xl text-base font-bold disabled:opacity-50"
      >
        {submitting ? "Signing in..." : t("auth.signIn")}
        {!submitting && (
          <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        )}
      </button>
    </form>
  );
}
