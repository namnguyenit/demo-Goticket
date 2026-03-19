import { NextResponse } from "next/server";
import { apiSuccess, listBlogs } from "@/lib/fake-api-db";

// Alias endpoint for clients calling singular `/api/blog`.
export async function GET() {
  return NextResponse.json(apiSuccess(listBlogs(), "OK", 200));
}
