import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-4">
      <h1>verhuurder</h1>
    </div>
  );
}
