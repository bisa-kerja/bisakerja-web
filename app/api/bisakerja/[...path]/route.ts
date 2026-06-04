/**
 * Catch-all reverse proxy for the Bisakerja backend.
 *
 * Every request to  /api/bisakerja/<segments...>?<query>
 * is forwarded to   https://bisakerja-api.salmanabdurrahman.my.id/api/v1/<segments...>?<query>
 *
 * This avoids CORS errors in the browser because the request stays
 * on the same origin (the Next.js dev/prod server).  The Next.js
 * server then makes a plain server-to-server fetch — no CORS involved.
 */

import { type NextRequest, NextResponse } from "next/server";

const BACKEND_ORIGIN = "http://localhost:3000/api/v1";

/** Headers we copy from the incoming browser request to the backend. */
const FORWARD_REQUEST_HEADERS = [
  "authorization",
  "content-type",
  "cookie",
  "accept",
  "accept-language",
  "x-request-id",
];

/** Headers we copy from the backend response to the browser. */
const FORWARD_RESPONSE_HEADERS = [
  "content-type",
  "cache-control",
  "x-request-id",
];

async function proxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await params;

  /* ── Build upstream URL (preserve query string) ── */
  const upstreamUrl = new URL(`${BACKEND_ORIGIN}/${path.join("/")}`);
  const incoming = new URL(req.url);
  incoming.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.set(key, value);
  });

  /* ── Forward safe request headers ── */
  const upstreamHeaders = new Headers();
  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = req.headers.get(name);
    if (value) upstreamHeaders.set(name, value);
  }

  /* ── Read body (ignore for GET / HEAD) ── */
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  /* ── Call the backend ── */
  let upstreamRes: globalThis.Response;
  try {
    upstreamRes = await fetch(upstreamUrl.toString(), {
      method: req.method,
      headers: upstreamHeaders,
      body: hasBody && body && body.byteLength > 0 ? body : undefined,
      // Disable Next.js fetch cache for mutable routes
      cache: "no-store",
    });
  } catch (err) {
    console.error("[bisakerja-proxy] upstream fetch failed:", err);
    return NextResponse.json(
      { success: false, message: "Proxy upstream error", data: null },
      { status: 502 },
    );
  }

  /* ── Stream response body back ── */
  const responseBody = await upstreamRes.arrayBuffer();

  /* ── Forward safe response headers ── */
  const responseHeaders = new Headers();
  for (const name of FORWARD_RESPONSE_HEADERS) {
    const value = upstreamRes.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  /* ── Forward Set-Cookie (refresh-token cookie rotation, etc.) ── */
  // getSetCookie() is available on undici / Node 18+ fetch
  const setCookies: string[] =
    typeof upstreamRes.headers.getSetCookie === "function"
      ? upstreamRes.headers.getSetCookie()
      : [];
  for (const cookie of setCookies) {
    responseHeaders.append("set-cookie", cookie);
  }

  return new Response(responseBody, {
    status: upstreamRes.status,
    headers: responseHeaders,
  });
}

/* Export a handler for every HTTP verb the backend uses */
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
