"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="flex">
        <SessionProvider>
          <main className={"content"}>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
