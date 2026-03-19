import { NextResponse } from "next/server";
import { apiError, apiSuccess, getTripStops } from "@/lib/fake-api-db";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const stops = getTripStops(Number(id));

  if (!stops) {
    return NextResponse.json(apiError("Trip not found", 404), { status: 404 });
  }

  return NextResponse.json(apiSuccess(stops, "OK", 200));
}
