import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContextObject";
import {
  login as apiLogin,
  loginWithMicrosoft as apiMicrosoftLogin,
  getUser,
  updateUserProfile as apiUpdateUserProfile,
} from "../api/client";
import { signInWithMicrosoft } from "../auth/microsoft";

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

  // Refresh persisted login data so the UI always reflects the database profile.
  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;
    getUser(user.id)
      .then((freshUser) => {
        if (!cancelled) setUser(freshUser);
      })
      .catch(() => {
        // Keep the cached user when the backend is temporarily unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const passwordLogin = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError("");
    try {
      const { user: signedIn } = await apiLogin({ email, password });
      setUser(signedIn);
      return signedIn;
    } catch (err) {
      setError(err.message || "Sign in failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const microsoftLogin = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const idToken = await signInWithMicrosoft();
      const { user: signedIn } = await apiMicrosoftLogin(idToken);
      setUser(signedIn);
      return signedIn;
    } catch (err) {
      const message =
        err?.errorCode === "user_cancelled"
          ? "Microsoft sign-in was cancelled."
          : err.message || "Microsoft sign-in failed.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError("");
  }, []);

  const updateProfile = useCallback(async ({ name, department }) => {
    setLoading(true);
    setError("");
    try {
      const { user: updatedUser } = await apiUpdateUserProfile(user.id, {
        name,
        department,
      });
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || "Profile update failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      passwordLogin,
      microsoftLogin,
      logout,
      updateProfile,
    }),
    [user, loading, error, passwordLogin, microsoftLogin, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
