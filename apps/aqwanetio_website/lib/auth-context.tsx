"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type UserRole = "anonymous" | "unverified" | "verified_owner";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  setUserFromBackend: (user: User) => void;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ponytail: login logic lives in FastAPI POST /auth/login, not client Firebase SDK
  const login = useCallback(async (email: string, password: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed");
    const profile = data.profile;
    const name = profile?.firstName ? `${profile.firstName} ${profile.lastName ?? ""}`.trim() : email.split("@")[0];
    const role = (profile?.role as UserRole) || "unverified";
    const phone = (profile?.phone as string) || undefined;
    setUser({ id: data.uid, email, name, role, phone });
    if (data.idToken) sessionStorage.setItem("aqw-idToken", data.idToken);
    if (data.refreshToken) sessionStorage.setItem("aqw-refreshToken", data.refreshToken);
    localStorage.setItem("aqw-uid", data.uid);
    return true;
  }, []);

  const setUserFromBackend = useCallback((u: User) => setUser(u), []);

  const logout = useCallback(() => {
    localStorage.removeItem("aqw-idToken");
    sessionStorage.removeItem("aqw-idToken");
    localStorage.removeItem("aqw-refreshToken");
    sessionStorage.removeItem("aqw-refreshToken");
    localStorage.removeItem("aqw-uid");
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("aqw-idToken") || sessionStorage.getItem("aqw-idToken");
    if (!token) {
      setLoading(false);
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    fetch(`${apiUrl}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Token invalid");
        // fetch profile for name/role
        const pres = await fetch(`${apiUrl}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
        const pdata = await pres.json();
        const p = pdata.profile || data;
        const email = p?.email || data.email;
        const name = p?.firstName ? `${p.firstName} ${p.lastName ?? ""}`.trim() : email.split("@")[0];
        const role = (p?.role as UserRole) || "unverified";
        const phone = (p?.phone as string) || undefined;
        setUser({ id: data.uid || p?.uid, email, name, role, phone });
      })
      .catch(() => {
        localStorage.removeItem("aqw-idToken");
        sessionStorage.removeItem("aqw-idToken");
      })
      .finally(() => setLoading(false));
  }, []);

  // ponytail: register also via FastAPI POST /auth/register (see app/auth/register/page.tsx)
  const register = useCallback(async (email: string, _password: string, name: string) => {
    // kept for backward compat – real flow is page.tsx fetch to /auth/register
    setUser({ id: "1", email, name, role: "unverified" });
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, setUserFromBackend, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
