"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type UserRole = "anonymous" | "unverified" | "verified_owner";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => { void password;
    setUser({ id: "1", email, name: email.split("@")[0], role: "unverified" });
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const register = useCallback(async (email: string, _password: string, name: string) => {
    setUser({ id: "1", email, name, role: "unverified" });
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
