import { NextResponse } from "next/server";
import { apiSuccess, listBlogs } from "@/lib/fake-api-db";

export async function GET() {
  return NextResponse.json(apiSuccess(listBlogs(), "OK", 200));
}
