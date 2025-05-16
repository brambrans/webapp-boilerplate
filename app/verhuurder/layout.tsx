import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

interface VerhuurderLayoutProps {
  children: ReactNode;
}

export default async function VerhuurderLayout({
  children,
}: VerhuurderLayoutProps) {
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
  if (dbUser.onboardingStatus !== "COMPLETED") {
    redirect("/onboarding");
  }

  if (dbUser.role !== "VERHUURDER") {
    redirect("/");
  }

  return <>{children}</>;
}
