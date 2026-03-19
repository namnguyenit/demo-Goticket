import { NextResponse } from "next/server";
import { apiError, apiSuccess, login } from "@/lib/fake-api-db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "").trim();

  if (!email || !password) {
    return NextResponse.json(apiError("Email and password are required", 422), { status: 422 });
  }

  const result = login(email, password);
  if (!result) {
    return NextResponse.json(apiError("Invalid credentials", 401), { status: 401 });
  }

  return NextResponse.json(
    apiSuccess(
      {
        authorisation: {
          token: result.token,
          type: "bearer",
        },
      },
      "Login success",
      200,
    ),
  );
}
