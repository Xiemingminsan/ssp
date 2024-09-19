import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const url = new URL(request.url);
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Extract user role from token (if user is logged in)
  const userRole = token?.role;

  // Default redirect pages for each role
  const roleRedirects = {
    admin: "/homepage",
    LetterHead: "/letter",
    SchoolHead: "/students",
    InventoryHead: "/items",
    ConductHead: "/conduct",
  };

  // Protected routes with allowed roles
  const protectedRoutes = {
    "/management": ["admin"],
    "/homepage": ["admin"],
    "/students": ["admin", "SchoolHead"],
    "/batches": ["admin", "SchoolHead"],
    "/attendance": ["SchoolHead"],
    "/courses": ["admin", "SchoolHead"],
    "/items": ["admin", "InventoryHead"],
    "/conduct": ["admin", "ConductHead"],
    "/letter": ["admin", "LetterHead"],
    "/api/inventory": ["admin"],
    "/api/student": ["admin", "SchoolHead"],
    "/api/conduct": ["admin", "ConductHead"],
    "/api/event": ["admin"],
    "/api/session": ["admin"],
    "/api/letters": ["admin", "LetterHead"],
    "/api/hierarchy": ["admin"],
    "/api/users": ["admin"],
  };

  // Redirect based on role if user is authenticated and accessing the root path
  if (url.pathname === "/") {
    if (userRole) {
      const redirectPath = roleRedirects[userRole] || "/homepage";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    } else {
      // Allow unauthenticated users to see the root page
      return NextResponse.next();
    }
  }

  // Check if the route is protected and enforce role-based access
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (url.pathname.startsWith(route)) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        if (url.pathname.startsWith("/api")) {
          // For APIs, return an unauthorized error response
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        } else {
          // For regular routes, redirect to appropriate role-based page or login
          const redirectPath = roleRedirects[userRole] || "/login";
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
};
