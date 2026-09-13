import { NextResponse, type NextRequest } from "next/server";
import { CLIENT_COOKIE, isClientKey } from "@/lib/gcp";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const existing = request.cookies.get(CLIENT_COOKIE)?.value;
  if (!isClientKey(existing)) {
    response.cookies.set(CLIENT_COOKIE, crypto.randomUUID(), {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.svg).*)"],
};
