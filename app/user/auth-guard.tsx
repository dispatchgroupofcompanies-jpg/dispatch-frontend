"use client";

import SessionLoader from "@/src/components/auth/SessionLoader";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "../../src/services/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    getSession().then((user) => {
      if (!active) return;
      if (!user) router.replace("/login");
      else if (user.role === "admin") router.replace("/admin/dashboard");
      else setAuthorized(true);
    });
    return () => { active = false; };
  }, [router]);

  return authorized ? <>{children}</> : <SessionLoader />;
}
