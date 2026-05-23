"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

/**
 * Clerk requires a /sso-callback route to complete OAuth flows.
 * This page handles the redirect from the OAuth provider back to our app.
 */
export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-navy)">
      <div className="text-center space-y-4">
        <span className="font-(--font-display) text-2xl tracking-wider">
          <span className="text-[#C9A84C]">Rapid</span>
          <span className="text-white">Luxe</span>
        </span>
        <p className="text-sm text-(--color-text-secondary)">
          Completing sign in…
        </p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
