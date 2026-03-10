"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { EmployerProvider } from "@/lib/employer-context";
import { EmployerSwitcher } from "./employer-switcher";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: DashboardIcon },
  { href: "/jobs", label: "Jobs", icon: JobsIcon },
  { href: "/applications", label: "Applications", icon: ApplicationsIcon },
];

function DashboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  );
}

function JobsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
  );
}

function ApplicationsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <EmployerProvider>
      <div className="flex min-h-screen">
        <aside className="flex w-60 flex-col bg-sidebar text-sidebar-foreground">
          <div className="px-5 py-5 border-b border-sidebar-border">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
                V
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight text-sidebar-foreground">VONQ Screening</h1>
                <p className="text-[11px] text-sidebar-foreground/50">AI Labs Platform</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/40">
              Navigation
            </p>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-5 py-4 border-t border-sidebar-border">
            <p className="text-[11px] text-sidebar-foreground/30">Screening Challenge v1.0</p>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b bg-card px-6">
            <div />
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Employer:</span>
              <EmployerSwitcher />
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-background">{children}</main>
        </div>
      </div>
      <Toaster />
    </EmployerProvider>
  );
}
