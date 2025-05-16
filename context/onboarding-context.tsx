"use client";

import { User } from "@/lib/generated/prisma";
import { createContext, useContext, ReactNode } from "react";

interface OnboardingContextType {
  user: User;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: User;
}) {
  return (
    <OnboardingContext.Provider value={{ user }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
