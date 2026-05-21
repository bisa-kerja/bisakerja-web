import { NextResponse } from "next/server";

const UPSTREAM = "https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json";

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, { next: { revalidate: 86400 } }); // cache 24 h
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch provinces from upstream" },
        { status: res.status },
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
