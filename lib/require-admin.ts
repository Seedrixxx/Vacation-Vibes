import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function requireAdminSession(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token || (token.role as string) !== "admin") {
    return null;
  }
  return token;
}

/** Use in API route handlers (App Router) where request is Web Request. */
export async function requireAdminSessionFromHeaders(): Promise<{ error?: NextResponse }> {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return {};
}

export async function requireAdminApi(request: NextRequest): Promise<{ error?: NextResponse }> {
  const token = await requireAdminSession(request);
  if (!token) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return {};
}
