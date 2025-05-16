import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia'
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    
    if (!body.accountId) {
      return NextResponse.json(
        { error: 'accountId is required in the request body' },
        { status: 400 }
      );
    }

    const accountSession = await stripe.accountSessions.create({
      account: body.accountId,
      components: {
        account_onboarding: {
          enabled: true},
      },
    });

    return NextResponse.json({
      client_secret: accountSession.client_secret,
    });
  } catch (error) {
    console.error('An error occurred when calling the Stripe API to create an account session:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}