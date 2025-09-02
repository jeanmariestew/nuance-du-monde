"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, MapPin, Settings, Tag, Layers, Users } from "lucide-react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname?.startsWith("/admin/login");
  const nav = [
    { href: "/admin", label: "Tableau de bord", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/offers", label: "Offres", icon: <Package size={18} /> },
    { href: "/admin/travel-types", label: "Types de voyage", icon: <Layers size={18} /> },
    { href: "/admin/travel-themes", label: "Thèmes", icon: <Tag size={18} /> },
    { href: "/admin/destinations", label: "Destinations", icon: <MapPin size={18} /> },
    { href: "/admin/partners", label: "Partenaires", icon: <Users size={18} /> },
    { href: "/admin/settings", label: "Paramètres", icon: <Settings size={18} /> },
  ];

  if (isLogin) {
    return <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-neutral-200 bg-white">
          <div className="p-4 border-b border-neutral-200">
            <Link href="/admin" className="text-base font-semibold">Backoffice</Link>
          </div>
          <nav className="p-2">
            {nav.map((n) => {
              const active = pathname === n.href || pathname?.startsWith(n.href + "/");
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-1 " +
                    (active ? "bg-neutral-900 text-white" : "hover:bg-neutral-100")
                  )}
                >
                  {n.icon}
                  <span>{n.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-neutral-200">
            <div className="h-14 px-4 flex items-center justify-between">
              <div className="font-medium">Nuance du Monde – Administration</div>
              <div className="text-sm text-neutral-500">v1.0.0</div>
            </div>
          </header>
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
