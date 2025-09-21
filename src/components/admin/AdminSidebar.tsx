"use client";
import { cn } from "@/lib/utils";
import {
    BarChart3,
    LayoutDashboard,
    Package,
    ReceiptText,
    Settings,
    Sparkles,
    Store,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const items: Item[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="size-4" /> },
  { label: "Stores", href: "/admin/stores", icon: <Store className="size-4" /> },
  { label: "Products", href: "/admin/products", icon: <Package className="size-4" /> },
  { label: "Orders", href: "/admin/orders", icon: <ReceiptText className="size-4" /> },
  { label: "Customers", href: "/admin/customers", icon: <Users className="size-4" /> },
  { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="size-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="size-4" /> },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-14 h-[calc(100dvh-56px)] w-64 shrink-0 overflow-y-auto border-r bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav aria-label="Admin navigation" className="mx-auto flex h-full max-w-7xl flex-col gap-2 px-3 py-4">
        <div className="px-2 pb-1 pt-0.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/70">Navigation</p>
        </div>
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              data-active={isActive}
              className={cn(
                "group relative inline-flex h-10 items-center gap-3 rounded-xl px-3 pl-4 text-sm outline-none transition-colors",
                "ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "hover:bg-muted/60 hover:text-foreground",
                isActive
                  ? "border border-border bg-muted/70 text-foreground"
                  : "border border-transparent text-muted-foreground"
              )}
            >
              {/* Active indicator bar */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-foreground transition-opacity",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                )}
              />
              <span className={cn("inline-flex size-6 items-center justify-center text-foreground", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>{item.icon}</span>
              <span className="font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
        <div className="mt-auto px-2 py-2">
          <div className="rounded-xl border bg-muted/40 p-3">
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground/90">
                <Sparkles className="size-4" />
              </span>
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground/90">Manage your store with clarity</p>
                <p className="text-xs text-muted-foreground">Keep products fresh and orders flowing smoothly.</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;