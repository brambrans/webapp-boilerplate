"use client";

import ConnectOnboarding from "@/components/stripe/connect/onboarding";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useOnboarding } from "../../context/onboarding-context";

type LoadingState = null | "creating_account" | "creating_session";

export default function OnboardingPage() {
  const { user } = useOnboarding();
  const [loadingState, setLoadingState] = useState<LoadingState>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeStripeAccount() {
      try {
        if (user.stripeAccountId) {
          setAccountId(user.stripeAccountId);
          setShowOnboarding(true);
        } else {
          // Automatically create Stripe account if user doesn't have one
          try {
            setFakeLoading();
            const stripeResponse = await fetch(`/api/stripe/account`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                authId: user.authId,
              }),
            });

            if (!stripeResponse.ok) {
              const data = await stripeResponse.json();
              throw new Error(data.error || "Failed to create Stripe account");
            }
            const data = await stripeResponse.json();
            setAccountId(data.id);
            setLoadingState(null);
            setShowOnboarding(true);
            console.log("Account ID:", data.id);
          } catch (err) {
            console.error("Error creating Stripe account:", err);
            setError("Error creating Stripe account");
            setLoadingState(null);
          }
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Error initializing Stripe account");
      }
    }

    initializeStripeAccount();
  }, [user]);

  function setFakeLoading() {
    setLoadingState("creating_account");
    setTimeout(() => {
      setLoadingState("creating_session");
    }, 2000);
  }

  const getLoadingMessage = () => {
    switch (loadingState) {
      case "creating_account":
        return "Creating Stripe account...";
      case "creating_session":
        return "Setting up account session...";
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Onboarding</h1>
        <p className="text-lg text-gray-600 mb-4">
          Voor dat je aan de slag kunt hebben we nog wat aanvullende info nodig!
        </p>
        <p className="text-xs text-red-500">
          * Boilerplate maakt gebruik van Stripe voor de bescherming van
          bankgegevens en transacties
        </p>
      </div>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {loadingState !== null && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{getLoadingMessage()}</span>
            </div>
          )}
          {showOnboarding && accountId && (
            <div className="w-full h-full rounded-lg p-4 bg-white border border-shadow">
              <ConnectOnboarding accountId={accountId} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
