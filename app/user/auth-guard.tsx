"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (!token) {
      router.push("/login");
      return;
    }

    // If userData exists, check if it's a regular user (not admin)
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // If the user is an admin, redirect them to admin login
        if (user.role === "admin") {
          router.push("/login");
        }
      } catch (error) {
        // If parsing fails, clear invalid data and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        router.push("/login");
      }
    }
  }, [router]);

  return <>{children}</>;
}
