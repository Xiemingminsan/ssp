"use client"; // Required for using hooks and client-side logic

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingScreen from "./components/LoadingScreen";

export default function Protection({ children }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for session status to be determined

    if (!session) {
      // Redirect to login page if no session
      router.push("/");
    } else {
      setLoading(false); // Session exists, proceed
    }
  }, [session, status, router]);

  if (loading || status === "loading") {
    return <LoadingScreen />; // Display the cool loading screen while checking session
  }

  return <>{children}</>; // Render children if session exists
}
