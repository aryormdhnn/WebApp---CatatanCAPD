"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const navigation = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    activeIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/record",
    label: "Catatan",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
    activeIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "Riwayat",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    activeIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/history") {
    return pathname === "/history" || pathname.startsWith("/records/");
  }

  return pathname.startsWith(href);
}

interface AppShellProps {
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function AppShell({ title, description, children, actions }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-4 pb-24 pt-6">
      {/* App Bar Header */}
      <header className="animate-fade-up rounded-[12px] border border-white/80 bg-white/70 p-5 shadow-notebook backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">CAPD Daily Record</p>
            <h1 className="text-3xl font-bold leading-tight text-foreground">{title}</h1>
            <p className="max-w-[26rem] text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4">{children}</main>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-md grid-cols-3">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 pb-2 pt-3 text-[11px] font-medium transition-colors duration-200",
                  active
                    ? "text-primary"
                    : "text-muted-foreground active:text-foreground",
                )}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-b-full bg-primary" />
                )}
                <span className="transition-transform duration-150">
                  {active ? item.activeIcon : item.icon}
                </span>
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
        {/* Safe area spacer for notched devices */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}

