import { NextResponse } from "next/server";
import { apiError, apiSuccess, getTripById } from "@/lib/fake-api-db";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const trip = getTripById(Number(id));

  if (!trip) {
    return NextResponse.json(apiError("Trip not found", 404), { status: 404 });
  }

  return NextResponse.json(
    apiSuccess(
      {
        id: trip.id,
        departure_datetime: trip.departure_datetime,
        arrival_datetime: trip.arrival_datetime,
        vendor_name: trip.vendor_name,
        coaches: trip.coaches.map((coach) => ({
          id: coach.id,
          identifier: coach.identifier,
          coach_type: coach.coach_type,
          total_seats: coach.total_seats,
          seats: coach.seats.map((seat) => ({
            id: seat.id,
            seat_number: seat.seat_number,
            status: seat.status,
            price: String(seat.price),
          })),
        })),
      },
      "OK",
      200,
    ),
  );
}
