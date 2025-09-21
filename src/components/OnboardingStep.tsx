"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Instagram, Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface OnboardingStepProps {
  onComplete?: (storeId: string) => void;
}

export default function OnboardingStep({ onComplete }: OnboardingStepProps) {
  const [instagramUrl, setInstagramUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const router = useRouter();

  const validateInstagramUrl = (url: string): boolean => {
    // Support both full URLs and handles
    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
    const handleRegex = /^[a-zA-Z0-9._]+$/;
    
    return instagramRegex.test(url) || handleRegex.test(url);
  };

  const normalizeUrl = (input: string): string => {
    // If it's just a handle, convert to full URL
    if (!input.includes("instagram.com")) {
      return `https://www.instagram.com/${input.replace("@", "")}`;
    }
    
    // If it's already a full URL, ensure it has protocol
    if (!input.startsWith("http")) {
      return `https://${input}`;
    }
    
    return input;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!instagramUrl.trim()) {
        throw new Error("Please enter an Instagram profile URL or handle");
      }

      if (!validateInstagramUrl(instagramUrl)) {
        throw new Error("Please enter a valid Instagram profile URL or handle");
      }

      const normalizedUrl = normalizeUrl(instagramUrl);
      
      const response = await fetch(`/api/onboard/auto?url=${encodeURIComponent(normalizedUrl)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create store");
      }

      const result = await response.json();
      
      if (result.success) {
        setStoreId(result.storeId);
        setSuccess(true);
        onComplete?.(result.storeId);
        
        // Redirect to the store after a short delay
        setTimeout(() => {
          router.push(`/store/id/${result.storeId}`);
        }, 2000);
      } else {
        throw new Error("Failed to create store");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success && storeId) {
    return (
      <div className="max-w-md mx-auto">
        <div className="rounded-xl border bg-card p-8 text-center space-y-4">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Store Created Successfully!</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Your store is being set up and products are being imported. You'll be redirected shortly...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-xl border bg-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex size-12 items-center justify-center rounded-lg border">
            <Instagram className="size-6" />
          </div>
          <h2 className="text-xl font-semibold">Import from Instagram</h2>
          <p className="text-sm text-muted-foreground">
            Enter your Instagram profile URL or handle to automatically create your store and import products.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="instagram-url" className="block text-sm font-medium mb-2">
              Instagram Profile
            </label>
            <input
              type="text"
              id="instagram-url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="@username or https://instagram.com/username"
              className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              You can enter either a full URL or just the username
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !instagramUrl.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating Store...
              </>
            ) : (
              <>
                Create Store
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            This will create a new store and import products from your Instagram profile.
          </p>
        </div>
      </div>
    </div>
  );
}
