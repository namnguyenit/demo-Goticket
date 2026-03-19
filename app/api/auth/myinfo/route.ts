import { NextResponse } from "next/server";
import { apiError, apiSuccess, getUserByToken, updateUserByToken } from "@/lib/fake-api-db";

export async function GET(req: Request) {
  const user = getUserByToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json(apiError("Unauthorized", 401), { status: 401 });
  }

  return NextResponse.json(
    apiSuccess(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        phone_number: user.phone,
        role: user.role,
      },
      "OK",
      200,
    ),
  );
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  const user = updateUserByToken(req.headers.get("authorization"), {
    name: body?.name,
    phone: body?.phone_number ?? body?.phone,
    email: body?.email,
  });

  if (!user) {
    return NextResponse.json(apiError("Unauthorized", 401), { status: 401 });
  }

  return NextResponse.json(
    apiSuccess(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        phone_number: user.phone,
        role: user.role,
      },
      "Updated",
      200,
    ),
  );
}
