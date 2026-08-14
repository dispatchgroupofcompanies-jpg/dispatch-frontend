"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Send users to the 3P dispatch page — user-side create/appointment pages were removed.
    router.push("/user/loadboard");
  }, [router]);

  return null;
}
