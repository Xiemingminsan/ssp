"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// app/not-allowed/page.js

export default function NotAllowed() {
  const router = useRouter();

  useEffect(() => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth > 1024;

    if (isDesktop) {
      router.push("/"); // Redirect to the homepage or another page
    }
  }, [router]);

  return (
    <div>
      <h1>Access Denied</h1>
      <p>This website is only accessible from a desktop device.</p>
      <p
        style={{
          marginTop: "20px",
          fontWeight: "bold",
          fontStyle: "italic",
        }}
      >
        For my thoughts are not your thoughts, neither are your ways my ways,
        declares the Lord. - Isaiah 55:8-9
      </p>
    </div>
  );
}
