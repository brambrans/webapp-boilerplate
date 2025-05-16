import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authId = searchParams.get("authId");

  if (!authId) {
    return NextResponse.json({ error: "authId is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        authId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { authId, onboardingStatus } = await request.json();

    if (!authId) {
      return NextResponse.json({ error: "authId is required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        authId,
      },
      data: {
        onboardingStatus,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 