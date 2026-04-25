import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type LinkedInProfile = {
  name: string;
  headline: string;
  domain: string;
  position: string;
  company: string;
  avatarColor: string;
};

type AuthContextType = {
  user: LinkedInProfile | null;
  signIn: (profile: LinkedInProfile) => void;
  signOut: () => void;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = "bingpro_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LinkedInProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Load on mount (client only — avoids SSR hydration mismatches)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setIsReady(true);
  }, []);

  const signIn = (profile: LinkedInProfile) => {
    setUser(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
