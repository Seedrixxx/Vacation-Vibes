import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || (token.role as string) !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/destinations/:path*",
    "/admin/experiences/:path*",
    "/admin/packages/:path*",
    "/admin/tours/:path*",
    "/admin/testimonials/:path*",
    "/admin/trip-requests/:path*",
    "/admin/itineraries/:path*",
    "/admin/blog/:path*",
    "/admin/inquiries/:path*",
    "/admin/payments/:path*",
  ],
};
