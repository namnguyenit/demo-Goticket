import { NextResponse } from "next/server";
import { apiError, apiSuccess, registerUser } from "@/lib/fake-api-db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const phone = String(body?.phone ?? "").trim();
  const password = String(body?.password ?? "").trim();
  const confirmation = String(body?.password_confirmation ?? "").trim();

  if (!name || !email || !phone || !password) {
    return NextResponse.json(apiError("Missing required fields", 422), { status: 422 });
  }

  if (password !== confirmation) {
    return NextResponse.json(apiError("Password confirmation mismatch", 422), { status: 422 });
  }

  const result = registerUser({ name, email, phone, password });
  if (result.error || !result.user) {
    return NextResponse.json(apiError(result.error ?? "Register failed", 409), { status: 409 });
  }

  const user = result.user;

  return NextResponse.json(
    apiSuccess(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      "Created",
      201,
    ),
    { status: 201 },
  );
}
