import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Every request under /admin (except /admin/login) must carry a valid
 * session AND that session must be an ADMIN account. This is the
 * authorization backstop referenced in Section 15/18 — UI hiding a button
 * is not access control, this middleware is.
 *
 * Manager-level (fine-grained permission) checks happen per-route in later
 * phases once the Products/Orders/Customers admin APIs exist; this layer
 * only guarantees "is this an authenticated admin at all".
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && path !== "/admin/login") {
      if (!token || token.accountType !== "ADMIN") {
        const loginUrl = new URL("/admin/login", req.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    if (path.startsWith("/account") && (!token || token.accountType !== "CUSTOMER")) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // We handle the redirect ourselves above so we can send admins and
      // customers to two different login pages; always let the middleware
      // function above run instead of NextAuth's default redirect.
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
