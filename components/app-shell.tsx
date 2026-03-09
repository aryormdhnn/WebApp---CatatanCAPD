"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/record", label: "Catatan" },
  { href: "/history", label: "Riwayat" },
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
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-4 pb-12 pt-6">
      <header className="animate-fade-up rounded-[2rem] border border-white/80 bg-white/70 p-5 shadow-notebook backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">CAPD Daily Record</p>
            <h1 className="font-serif text-3xl leading-tight text-foreground">{title}</h1>
            <p className="max-w-[26rem] text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>

        <nav className="mt-5 grid grid-cols-3 gap-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({
                  variant: isActive(pathname, item.href) ? "default" : "outline",
                  size: "sm",
                }),
                "w-full",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex flex-1 flex-col gap-4">{children}</main>
    </div>
  );
}
