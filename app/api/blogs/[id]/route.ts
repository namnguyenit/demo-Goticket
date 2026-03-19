import { NextResponse } from "next/server";
import { apiError, apiSuccess, getBlogById } from "@/lib/fake-api-db";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const blog = getBlogById(Number(id));

  if (!blog) {
    return NextResponse.json(apiError("Blog not found", 404), { status: 404 });
  }

  return NextResponse.json(apiSuccess(blog, "OK", 200));
}
