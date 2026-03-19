import { NextResponse } from "next/server";
import { apiError, apiSuccess, getUserByToken, initiateBooking } from "@/lib/fake-api-db";

export async function POST(req: Request) {
  const user = getUserByToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json(apiError("Unauthorized", 401), { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const tripId = Number(body?.trip_id);
  const seatIds = Array.isArray(body?.seat_ids) ? body.seat_ids.map(Number) : [];

  if (!tripId || !seatIds.length) {
    return NextResponse.json(apiError("Invalid booking payload", 422), { status: 422 });
  }

  const result = initiateBooking(user, { trip_id: tripId, seat_ids: seatIds });
  if (result.error || !result.data) {
    return NextResponse.json(apiError(result.error ?? "Booking initiate failed", 400), { status: 400 });
  }

  return NextResponse.json(apiSuccess(result.data, "OK", 200));
}
