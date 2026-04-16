"use client";

import { usePathname } from "next/navigation";
import { Bell, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/stories": "Quản lý Truyện",
  "/admin/settings": "Cài Đặt",
};

function getTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.includes("/chapters/new")) return "Thêm Chương";
  if (pathname.includes("/chapters")) return "Danh Sách Chương";
  if (pathname.includes("/parts")) return "Quản lý Phần";
  if (pathname.includes("/stories/new")) return "Thêm Truyện";
  if (pathname.includes("/edit")) return "Chỉnh Sửa";
  return "Admin";
}

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="h-12 px-5 border-b border-white/[0.06] flex items-center justify-between gap-4 bg-[#0b0e14]/80 backdrop-blur-sm shrink-0">
      {/* Page Title */}
      <h1 className="font-heading text-sm font-bold text-text-heading">
        {title}
      </h1>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* View site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-medium text-text-muted border border-border-subtle rounded-md hover:text-accent hover:border-accent/25 hover:bg-accent/[0.04] transition-all duration-200"
        >
          <ExternalLink size={12} />
          Xem Website
        </a>

        <Link
          href="/admin/stories/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-accent-foreground text-[0.75rem] font-semibold rounded-md hover:bg-accent-hover transition-all duration-200"
        >
          <Plus size={13} />
          Thêm Truyện
        </Link>

        <button className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-text-heading hover:bg-white/[0.04] transition-all duration-200">
          <Bell size={15} />
        </button>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
          <span className="text-[0.65rem] font-bold text-accent">A</span>
        </div>
      </div>
    </header>
  );
}
