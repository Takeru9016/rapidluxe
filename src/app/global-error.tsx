"use client";

import * as Sentry from "@sentry/nextjs";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          backgroundColor: "#1B2A41",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <AlertTriangle
            size={48}
            color="#E07A5F"
            style={{ marginBottom: 24 }}
          />
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 300,
              color: "#ffffff",
              margin: "0 0 12px",
            }}
          >
            Something went wrong
          </h1>
          <p style={{ color: "#D1CBC0", maxWidth: 400, margin: "0 0 32px" }}>
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                backgroundColor: "#E07A5F",
                color: "#1B2A41",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                border: "1px solid #1F2937",
                color: "#D1CBC0",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
