"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  logoutUser,
  type AuthResponse,
} from "./api";

/* ─── Types ─── */

interface UserData {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  isEmailVerified?: boolean;
}

interface AuthContextValue {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: NonNullable<AuthResponse["data"]>) => void;
  logout: () => Promise<void>;
}

/* ─── Context ─── */

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: async () => {},
});

/* ─── Provider ─── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = getAccessToken();
    const stored = getStoredUser();
    if (token && stored?.user) {
      setUser(stored.user);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((authData: NonNullable<AuthResponse["data"]>) => {
    setAccessToken(authData.session.accessToken);
    setStoredUser(authData);
    setUser(authData.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // still clear local state even if API fails
    }
    clearAccessToken();
    clearStoredUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ─── Hook ─── */

export function useAuth() {
  return useContext(AuthContext);
}
