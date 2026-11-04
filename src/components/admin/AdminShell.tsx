"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  Tag,
  Layers,
  Users,
  FileText,
  Briefcase,
  FileCode,
  Search,
  Menu,
  X,
  MonitorPlay,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/offers", label: "Offres", icon: Package },
  { href: "/admin/travel-types", label: "Types de voyage", icon: Layers },
  { href: "/admin/travel-themes", label: "Thèmes", icon: Tag },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/partners", label: "Partenaires", icon: Users },
  { href: "/admin/professionals", label: "Professionnels", icon: Briefcase },
  { href: "/admin/brochure-requests", label: "Demandes brochure", icon: FileText },
  { href: "/admin/metadata", label: "Métadonnées SEO", icon: Search },
  { href: "/admin/homepage-popup", label: "Bannière accueil", icon: MonitorPlay },
  { href: "/admin/html-files", label: "Signatures", icon: FileCode },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-neutral-900 text-white shadow-sm"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
      }`}
    >
      <span
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          active
            ? "bg-white/15 text-white"
            : "bg-neutral-100 text-neutral-700 group-hover:bg-white"
        }`}
      >
        <Icon size={16} strokeWidth={2} />
      </span>
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
  onClose,
}: {
  pathname: string | null;
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-neutral-200 px-4 py-4">
        <Link href="/admin" onClick={onNavigate} className="block min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
            Nuance du Monde
          </p>
          <p className="mt-1 text-base font-semibold text-neutral-900">Backoffice</p>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-neutral-100 md:hidden"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActivePath(pathname, item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      <div className="border-t border-neutral-200 px-4 py-3 text-xs text-neutral-400">
        Administration v1.0.0
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname?.startsWith("/admin/login");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (isLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-6">
        {children}
      </div>
    );
  }

  const current =
    NAV.find((item) => isActivePath(pathname, item.href))?.label || "Administration";

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Sidebar desktop fixe */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-neutral-200 bg-white md:flex md:flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col bg-white shadow-2xl">
            <SidebarContent
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900 sm:text-base">
                {current}
              </p>
              <p className="hidden truncate text-xs text-neutral-500 sm:block">
                Nuance du Monde – Administration
              </p>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
