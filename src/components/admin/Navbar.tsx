"use client";
import { ModeToggle } from "@/components/ThemeToggler";
import { Button } from "@/components/ui/button";
import { Rocket, ShoppingBag } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        {/* Brand */}
        <Link href="/admin" className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-md border">
            <Rocket className="size-4" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight">Instant Store Admin</span>
        </Link>

        {/* spacer */}
        <div className="ml-auto" />

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link href="/store/demo">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              <ShoppingBag className="mr-2 size-4" />
              View store
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;