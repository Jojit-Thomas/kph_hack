import ProtectedRoute from "@/components/ProtectedRoute";
import OnboardingStep from "@/components/OnboardingStep";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OnboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b sticky top-0 z-40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="size-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Create Your Store
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Import your products from Instagram and launch your store in minutes.
            </p>
          </div>

          <OnboardingStep />
        </main>
      </div>
    </ProtectedRoute>
  );
}
