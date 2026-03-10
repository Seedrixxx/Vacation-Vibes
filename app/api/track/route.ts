import { NextResponse } from "next/server";
import { getOrderByTrackingToken } from "@/lib/services/trip-order.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.json(
      { error: "Tracking token is required" },
      { status: 400 }
    );
  }

  try {
    const order = await getOrderByTrackingToken(token);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (err) {
    console.error("Track API error:", err);
    return NextResponse.json(
      { error: "Failed to load trip" },
      { status: 500 }
    );
  }
}
