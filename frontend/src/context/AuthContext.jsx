import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContextObject";
import { login as apiLogin } from "../api/client";

const STORAGE_KEY = "au-helpdesk-user";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keep the persisted copy in sync so a refresh preserves the session.
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const loginAs = useCallback(async ({ role, email }) => {
    setLoading(true);
    setError("");
    try {
      const { user: signedIn } = await apiLogin({ role, email });
      setUser(signedIn);
      return signedIn;
    } catch (err) {
      setError(err.message || "Sign in failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError("");
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, loginAs, logout }),
    [user, loading, error, loginAs, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
