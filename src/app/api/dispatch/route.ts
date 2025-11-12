import { NextRequest, NextResponse } from "next/server";

import { BACKEND_BASE_URL } from "@/config/backend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const response = await fetch(`${BACKEND_BASE_URL}/selectDispatchList.do`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Backend request failed" },
        { status: response.status }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await response.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid backend response format" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      dispatches: data,
      total: data.length,
    });
  } catch (error) {
    console.error("Dispatch API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
