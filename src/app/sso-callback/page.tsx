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
          <span className="text-[#F9A826]">Rapid</span>
          <span className="text-white">Luxe</span>
        </span>
        <p className="text-sm text-(--color-text-secondary)">
          Completing sign in…
        </p>
      </div>
      {/* signIn/signUpFallbackRedirectUrl only apply if the initiating
          authenticateWithRedirect() call didn't set a forceRedirectUrl
          (redirectUrlComplete) — SignInForm/SignUpForm always do, so this
          is a defensive fallback, not the primary redirect mechanism. */}
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
      />
    </div>
  );
}
