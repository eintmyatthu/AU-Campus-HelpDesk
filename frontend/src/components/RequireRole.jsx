import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

/**
 * Route guard. Renders children only when a user is signed in and (optionally)
 * holds one of the allowed roles. Otherwise redirects:
 *   - not signed in         -> "/" (login)
 *   - signed in, wrong role  -> that user's own home
 *
 * @param {string[]} roles  Allowed backend role values, e.g. ["ADMIN"].
 */
const HOME_BY_ROLE = {
  STUDENT: "/student",
  FACULTY: "/student",
  TECHNICIAN: "/technician",
  ADMIN: "/admin",
};

export default function RequireRole({ roles, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role] || "/"} replace />;
  }

  return children;
}
