import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export function useAdminGuard() {
  const auth = useStore((s) => s.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth) navigate({ to: "/admin/login" });
  }, [auth, navigate]);
  return auth;
}
