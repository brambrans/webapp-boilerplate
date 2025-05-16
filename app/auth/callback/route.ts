import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  console.log("Starting auth callback with code:", code);

  if (code) {
    const supabase = await createClient();
    const session = await supabase.auth.exchangeCodeForSession(code);

    console.log("Code exchanged for session:", session.data);
  
    if (session.data.session) {
      const dbUser = await prisma.user.findUnique({
        where: {
          authId: session.data.session.user.id,
        },  
      });
      console.log("db user:", dbUser ? dbUser : "not found");

      if (!dbUser) {
       const newUser = await prisma.user.create({
          data: {
            authId: session.data.session.user.id!,
            email: session.data.session.user.email!,
          },
        });

        console.log("Created user:", newUser);
      }
      }
    if (!session) {
      return NextResponse.redirect(`${origin}/error`);
    }
  }

  if (redirectTo) {
    console.log("Redirecting to:", `${origin}${redirectTo}`);

    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/redirect`);
}
