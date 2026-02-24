import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Admin credentials
    const adminEmail = "admin@gmail.com";
    const adminPassword = "adminmudassir";

    if (email === adminEmail && password === adminPassword) {
      return NextResponse.json(
        {
          message: "Admin login successful",
          token: "admin-token-123",
          user: {
            id: "admin-id",
            email: adminEmail,
            name: "Admin",
            role: "admin",
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}