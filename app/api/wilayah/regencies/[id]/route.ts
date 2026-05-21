import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Invalid province id" }, { status: 400 });
  }

  const upstream = `https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${id}.json`;

  try {
    const res = await fetch(upstream, { next: { revalidate: 86400 } }); // cache 24 h
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch regencies from upstream" },
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
