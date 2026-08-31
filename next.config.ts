import type { NextConfig } from "next";

// Content-Security-Policy. Kept as a STATIC header (no nonce) on purpose: the
// pages are statically prerendered, and a nonce-based CSP would force every page
// into dynamic rendering. 'unsafe-inline' is required for the inline bootstrap
// script/JSON and the pervasive inline style attributes Next/React emit during
// SSR; everything else is locked to same-origin. The app has no XSS sinks
// (no dangerouslySetInnerHTML/eval), so this is defense-in-depth: it blocks
// external/object/frame injection and clickjacking even though inline is allowed.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Security headers applied to every route. HSTS is already set by Vercel.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // The /api/chat keyword fallback reads the knowledge corpus from disk at
  // runtime. Vercel's function tracing won't pick up a path built from
  // process.cwd(), so include it explicitly or the fallback 500s in production.
  outputFileTracingIncludes: {
    "/api/chat": ["./data/knowledge/**/*"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
