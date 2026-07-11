import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth",
  "/verify-email",
  "/reset-password",
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes without auth check
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for refreshToken cookie (set by the backend on login)
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    // No refresh token → user is not authenticated → redirect to login
    const loginUrl = new URL("/auth/login", request.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User has a refreshToken cookie → allow the request
  return NextResponse.next();
}

// Only run proxy on app routes, skip static assets and API routes
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$).*)",
  ],
};
