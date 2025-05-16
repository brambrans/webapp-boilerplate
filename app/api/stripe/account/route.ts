import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, authId } = await request.json();

    const response = await fetch("https://api.stripe.com/v2/core/accounts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Stripe-Version": "2025-04-30.preview",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact_email: email,
        dashboard: "express",
        metadata: {
          authId: authId
        },
        identity: {
          country: "nl",
        },
        configuration: {
          customer: {
            capabilities: {
              automatic_indirect_tax: {
                requested: true
              }
            }
          },
          merchant: {
            capabilities: {
              card_payments: {
                requested: true
              }
            }
          }
        },
        defaults: {
          currency: "eur",
          responsibilities: {
            fees_collector: "application",
            losses_collector: "application"
          },
          locales: ["nl-NL"]
        },
        include: [
          "configuration.customer",
          "configuration.merchant",
          "identity",
          "requirements"
        ]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Failed to create account" },
        { status: response.status }
      );
    }

    // Update the user's stripeAccountId in the database
    await prisma.user.update({
      where: { authId },
      data: {
        stripeAccountId: data.id
      }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe account" },
      { status: 500 }
    );
  }
} 