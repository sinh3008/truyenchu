import Link from "next/link";
import { BookOpen } from "lucide-react";

const quickLinks = [
  { label: "Trang Chủ", href: "/" },
  { label: "Thư Viện", href: "/truyen" },
  { label: "Mới Cập Nhật", href: "/truyen?sort=latest" },
  { label: "Phổ Biến", href: "/truyen?sort=popular" },
];

const categories = [
  "Tiên Hiệp", "Huyền Huyễn", "Kiếm Hiệp",
  "Khoa Huyễn", "Ngôn Tình", "Đô Thị",
];

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-secondary/40 mt-auto">
      <div className="max-w-[1280px] mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
              <div className="w-6 h-6 rounded-md bg-accent/12 border border-accent/25 flex items-center justify-center">
                <BookOpen size={12} className="text-accent" />
              </div>
              <span className="font-heading text-sm font-bold text-text-heading group-hover:text-accent transition-colors duration-200">
                Novel<span className="text-accent">Verse</span>
              </span>
            </Link>
            <p className="text-[0.8125rem] text-text-muted leading-relaxed max-w-xs">
              Nền tảng đọc truyện chữ cao cấp với giao diện tối giản, tập trung vào trải nghiệm đọc.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[0.6875rem] font-semibold text-text-muted uppercase tracking-widest mb-3">
              Liên kết
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.8125rem] text-text-muted hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[0.6875rem] font-semibold text-text-muted uppercase tracking-widest mb-3">
              Thể loại
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/truyen?genre=${encodeURIComponent(cat)}`}
                  className="px-2.5 py-1 text-[0.75rem] text-text-muted bg-white/[0.025] border border-border-subtle rounded-md hover:bg-accent/[0.08] hover:text-accent hover:border-accent/20 transition-all duration-200"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-5 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[0.75rem] text-text-muted">
            © {new Date().getFullYear()} NovelVerse. All rights reserved.
          </p>
          <p className="text-[0.75rem] text-text-muted">
            Tối ưu cho trải nghiệm đọc tốt nhất.
          </p>
        </div>
      </div>
    </footer>
  );
}
