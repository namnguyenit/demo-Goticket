import { NextResponse } from "next/server";
import { apiSuccess, listLocations } from "@/lib/fake-api-db";

export async function GET() {
  return NextResponse.json(apiSuccess(listLocations(), "OK", 200));
}
