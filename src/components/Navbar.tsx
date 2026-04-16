"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, BookOpen } from "lucide-react";

const navLinks = [
  { label: "Trang Chủ", href: "/" },
  { label: "Thể Loại", href: "/truyen" },
  { label: "Mới Cập Nhật", href: "/truyen?sort=latest" },
  { label: "Phổ Biến", href: "/truyen?sort=popular" },
  { label: "Hoàn Thành", href: "/truyen?status=completed" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-strong py-2.5" : "bg-transparent py-3.5"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-5 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 rounded-md bg-accent/12 border border-accent/25 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-200">
              <BookOpen size={14} className="text-accent" />
            </div>
            <span className="font-heading text-[0.9375rem] font-bold tracking-tight text-text-heading group-hover:text-accent transition-colors duration-200">
              Novel<span className="text-accent">Verse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-[0.8125rem] font-medium text-text-secondary hover:text-text-heading transition-colors duration-200 rounded-md hover:bg-white/[0.035] group"
              >
                {link.label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-accent rounded-full transition-all duration-250 group-hover:w-4" />
              </Link>
            ))}
          </nav>

          {/* Right Side — search + mobile toggle only, no admin link */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-md text-text-muted hover:text-text-heading hover:bg-white/[0.04] transition-all duration-200"
              aria-label="Tìm kiếm"
            >
              <Search size={17} />
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md text-text-muted hover:text-text-heading hover:bg-white/[0.04] transition-all duration-200"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* Expandable Search */}
        <div
          className={`max-w-[1280px] mx-auto px-5 overflow-hidden transition-all duration-250 ${
            searchOpen ? "max-h-16 pt-2.5 pb-1 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Tìm truyện..."
              autoFocus={searchOpen}
              className="w-full pl-9 pr-4 py-2 bg-bg-input border border-border-subtle rounded-md text-[0.8125rem] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/35 focus:ring-1 focus:ring-accent/15 transition-all duration-200"
            />
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 w-64 h-full bg-bg-secondary border-l border-border-subtle pt-16 px-4 pb-6 transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <nav className="flex flex-col gap-0.5 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-heading hover:bg-white/[0.04] rounded-md transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
