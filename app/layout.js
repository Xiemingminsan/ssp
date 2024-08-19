"use client";

import { SessionProvider } from "next-auth/react";
import Sidebar from "./components/Sidebar";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";

  return (
    <html lang="en">
      <body className="flex">
        <SessionProvider>
          {!isLoginPage && <Sidebar />}{" "}
          {/* Show Sidebar if not on login page */}
          <main className={isLoginPage ? "" : "content"}>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
