import { NextResponse } from "next/server";
import { apiError, apiSuccess, confirmBooking, getUserByToken } from "@/lib/fake-api-db";

export async function POST(req: Request) {
  const user = getUserByToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json(apiError("Unauthorized", 401), { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const tripId = Number(body?.trip_id);
  const seatIds = Array.isArray(body?.seat_ids) ? body.seat_ids.map(Number) : [];
  const pickupStopId = Number(body?.pickup_stop_id);
  const dropoffStopId = Number(body?.dropoff_stop_id);

  if (!tripId || !seatIds.length || !pickupStopId || !dropoffStopId) {
    return NextResponse.json(apiError("Invalid confirm payload", 422), { status: 422 });
  }

  const result = confirmBooking(user, {
    trip_id: tripId,
    seat_ids: seatIds,
    pickup_stop_id: pickupStopId,
    dropoff_stop_id: dropoffStopId,
  });

  if (result.error || !result.booking) {
    return NextResponse.json(apiError(result.error ?? "Booking confirm failed", 400), { status: 400 });
  }

  const booking = result.booking;

  return NextResponse.json(
    apiSuccess(
      {
        booking_code: booking.booking_code,
        message: "Dat ve thanh cong!",
      },
      "Created",
      201,
    ),
    { status: 201 },
  );
}
