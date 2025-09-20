"use client";

import { ModeToggle } from "@/components/ThemeToggler";
import { Button } from "@/components/ui/button";
import axios from "@/config/axios";
import { Eye, EyeOff, Loader2, Rocket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post("/auth/login", { email, password });
      router.push("/admin");
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err && "response" in err && (err as any).response?.data?.message
          ? (err as any).response.data.message
          : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh">
      {/* Header - mirrors landing page */}
      <header className="border-b sticky top-0 z-40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-md border">
              <Rocket className="size-4" />
            </span>
            <span className="text-sm font-medium tracking-tight">Instant Store</span>
          </Link>

          <nav className="flex items-center gap-3 md:gap-4">
            <Link href="/" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md">
              Back to home
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      {/* Auth card */}
      <section className="mt-20">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-24">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-xl border bg-card text-card-foreground p-6 sm:p-8 md:p-10">
              <div className="text-center">
                <h1 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
                  Sign in to <span className="hue-gradient-text">Instant Store</span>
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">Continue to your store.</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-[3px] focus:ring-ring/50"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1 block w-full rounded-md border border-input bg-background pr-10 px-3 py-2 text-sm focus:outline-none focus:ring-[3px] focus:ring-ring/50"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-2 inline-flex items-center justify-center px-1.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive px-3 py-2 text-sm">
                    {error}
                  </div>
                ) : null}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>New to Instant Store?</span>
                <Link href="/store/demo" className="underline underline-offset-4 hover:text-foreground">
                  Explore demo
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
