import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { OnboardingProvider } from "../../context/onboarding-context";

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default async function OnboardingLayout({
  children,
}: OnboardingLayoutProps) {
  // Step 1: Authentication check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Step 2: Database user check (only runs if auth check passes)
  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
  });

  if (!dbUser) {
    redirect("/sign-in");
  }

  // Step 3: Access validation (only runs if both previous checks pass)
  if (dbUser.onboardingStatus !== "IN_PROGRESS") {
    redirect("/");
  }

  if (dbUser.role !== "VERHUURDER") {
    redirect("/");
  }

  return <OnboardingProvider user={dbUser}>{children}</OnboardingProvider>;
}
