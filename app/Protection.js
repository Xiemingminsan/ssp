"use client"; // Required for using hooks and client-side logic

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Protection({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return; // Wait for session status to be determined

    if (!session) {
      // Redirect to login page if no session
      router.push("/");
    } else {
      setIsLoading(false); // Session exists, proceed
    }
  }, [session, status, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading state while checking session
  }

  return <>{children}</>; // Render children if session exists
}
