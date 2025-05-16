import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
export default async function redirectPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      authId: user.id,
    },
  });

  if (!dbUser) {
    return redirect("/auth/callback?redirect_to=/onboarding");
  }

  if (dbUser.onboardingStatus === "COMPLETED") {
    return redirect("/verhuurder");
  } else {
    return redirect("/onboarding");
  }
}
