"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin/dashboard",
    exact: true,
  },
  {
    icon: BookOpen,
    label: "Quản lý Truyện",
    href: "/admin/stories",
    exact: false,
  },
  {
    icon: Settings,
    label: "Cài Đặt",
    href: "/admin/settings",
    exact: true,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    // For non-exact: match /admin/stories and anything under it
    // but NOT /admin/stories/new etc. treated differently
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={`relative flex flex-col h-full transition-all duration-300 ease-out border-r border-white/[0.06] bg-[#0a0d12] ${
        collapsed ? "w-14" : "w-52"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-2.5 h-12 border-b border-white/[0.06] px-3 shrink-0 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="w-6 h-6 rounded-md bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
          <BookOpen size={13} className="text-accent" />
        </div>
        {!collapsed && (
          <span className="font-heading text-[0.875rem] font-bold text-text-heading whitespace-nowrap overflow-hidden">
            Novel<span className="text-accent">Verse</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2.5 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`relative flex items-center gap-3 rounded-lg transition-all duration-200 group overflow-hidden ${
                collapsed ? "px-0 justify-center h-9" : "px-2.5 h-9"
              } ${
                active
                  ? "bg-accent/10 text-accent"
                  : "text-text-muted hover:text-text-heading hover:bg-white/[0.035]"
              }`}
            >
              {/* Active left bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-accent rounded-r-full" />
              )}

              <item.icon
                size={15}
                className={`shrink-0 transition-colors duration-200 ${
                  active
                    ? "text-accent"
                    : "text-text-muted group-hover:text-text-secondary"
                }`}
              />

              {!collapsed && (
                <span className="text-[0.8125rem] font-medium truncate">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: View Site + Logout */}
      <div className="px-2 py-2.5 border-t border-white/[0.06] shrink-0 space-y-0.5">
        {/* View website */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? "Xem Website" : undefined}
          className={`w-full flex items-center gap-3 rounded-lg text-[0.8125rem] font-medium text-text-muted hover:text-accent hover:bg-accent/[0.06] transition-all duration-200 group ${
            collapsed ? "px-0 justify-center h-9" : "px-2.5 h-9"
          }`}
        >
          <ExternalLink
            size={15}
            className="shrink-0 text-text-muted group-hover:text-accent transition-colors duration-200"
          />
          {!collapsed && <span>Xem Website</span>}
        </a>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={collapsed ? "Đăng xuất" : undefined}
          className={`w-full flex items-center gap-3 rounded-lg text-[0.8125rem] font-medium text-text-muted hover:text-danger hover:bg-danger/[0.06] transition-all duration-200 group ${
            collapsed ? "px-0 justify-center h-9" : "px-2.5 h-9"
          }`}
        >
          <LogOut
            size={15}
            className="shrink-0 text-text-muted group-hover:text-danger transition-colors duration-200"
          />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-12 mt-4 w-5 h-5 rounded-full bg-bg-card border border-border-light flex items-center justify-center text-text-muted hover:text-text-heading hover:border-border-accent transition-all duration-200 z-10 shadow-sm"
      >
        {collapsed ? (
          <ChevronRight size={11} />
        ) : (
          <ChevronLeft size={11} />
        )}
      </button>
    </aside>
  );
}
