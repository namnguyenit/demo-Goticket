import { NextResponse } from "next/server";
import { apiSuccess, searchTrips } from "@/lib/fake-api-db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = searchTrips(searchParams);
  return NextResponse.json(apiSuccess(data, "OK", 200));
}
