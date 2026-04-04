import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, type UserRole } from "../context/AuthContext";

type ChildrenProps = { children: ReactNode };

export function RequireAuth({ children }: ChildrenProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

type RequireRoleProps = ChildrenProps & { role: Exclude<UserRole, null> };

export function RequireRole({ role, children }: RequireRoleProps) {
  const { user, userData } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (
    !userData ||
    (userData.role !== "student" && userData.role !== "teacher")
  ) {
    return <Navigate to="/" replace />;
  }
  if (userData.role !== role) {
    const fallback =
      userData.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student";
    return <Navigate to={fallback} replace />;
  }
  return <>{children}</>;
}

export function RequireOnboarding({ children }: ChildrenProps) {
  const { user, userData } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (
    !userData ||
    (userData.role !== "student" && userData.role !== "teacher")
  ) {
    return <Navigate to="/" replace />;
  }
  if (userData.hasCompletedOnboarding !== true) {
    const path =
      userData.role === "teacher"
        ? "/onboarding/teacher"
        : "/onboarding/student";
    return <Navigate to={path} replace />;
  }
  return <>{children}</>;
}

/** Use on /auth: signed-in users go to onboarding or their dashboard. */
export function GuestOnly({ children }: ChildrenProps) {
  const { user, userData } = useAuth();

  if (!user) {
    return <>{children}</>;
  }
  if (!userData) {
    return <>{children}</>;
  }
  if (userData.role !== "student" && userData.role !== "teacher") {
    return <>{children}</>;
  }
  if (userData.hasCompletedOnboarding !== true) {
    const path =
      userData.role === "teacher"
        ? "/onboarding/teacher"
        : "/onboarding/student";
    return <Navigate to={path} replace />;
  }
  return (
    <Navigate
      to={
        userData.role === "teacher"
          ? "/dashboard/teacher"
          : "/dashboard/student"
      }
      replace
    />
  );
}
