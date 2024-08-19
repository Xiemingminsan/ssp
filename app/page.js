"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for session status to be determined

    if (!session) {
      // Redirect to login page if no session
      router.push("/login");
    } else {
      // Redirect to a different page if the user is already logged in
      router.push("/homepage"); // Adjust the path as needed
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // Optional: Display a loading state while checking the session
  }

  return <div>Redirecting...</div>; // Optional: Display a message or spinner while redirecting
}
