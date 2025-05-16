import React, { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js/pure";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { useRouter } from "next/navigation";

interface ConnectOnboardingProps {
  accountId: string;
}

export default function ConnectOnboarding({
  accountId,
}: ConnectOnboardingProps) {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeStripeConnect = async () => {
      try {
        setLoading(true);
        const fetchClientSecret = async () => {
          const response = await fetch("/api/stripe/account-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accountId }),
          });

          if (!response.ok) {
            const { error } = await response.json();
            console.error("An error occurred: ", error);
            throw new Error(error || "Failed to fetch client secret");
          }

          const { client_secret: clientSecret } = await response.json();
          return clientSecret;
        };

        const instance = await loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
          fetchClientSecret,
          appearance: {
            overlays: "dialog",
            variables: {
              colorPrimary: "#000000",
              actionPrimaryTextDecorationStyle: "solid",
              actionSecondaryTextDecorationLine: "none",
              borderRadius: "6px",
              spacingUnit: "8px",
              fontFamily: "sans-serif",
            },
          },
        });

        setStripeConnectInstance(instance);
        setError(null);
      } catch (err) {
        console.error("Error initializing Stripe Connect:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize Stripe Connect"
        );
      } finally {
        setLoading(false);
      }
    };

    initializeStripeConnect();
  }, [accountId]);

  const handleExit = async () => {
    try {
      // Get the current user's authId from the URL
      const url = new URL(window.location.href);
      const authId = url.searchParams.get("id");

      if (!authId) {
        throw new Error("No authentication ID found");
      }

      // Update the user's onboarding status
      const response = await fetch(`/api/db/user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authId,
          onboardingStatus: "COMPLETED",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update onboarding status");
      }

      // Redirect to home page
      router.push("/");
    } catch (err) {
      console.error("Error handling exit:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to complete onboarding process"
      );
    }
  };

  if (loading) {
    return <div>Loading Stripe Connect...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stripeConnectInstance) {
    return <div>Failed to initialize Stripe Connect</div>;
  }

  return (
    <div>
      <div className="container">
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          <ConnectAccountOnboarding onExit={handleExit} />
        </ConnectComponentsProvider>
      </div>
    </div>
  );
}
