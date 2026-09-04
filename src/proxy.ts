import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/studio(.*)"]);

const isUserRoute = createRouteMatcher([
  "/profile(.*)",
  "/bookings(.*)",
  "/wishlist(.*)",
  "/book(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      const url = new URL("/sign-in", req.url);
      url.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(url);
    }
    if (sessionClaims?.metadata?.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }
  if (isUserRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
