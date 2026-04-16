import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "Xem tất cả",
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6 gap-4">
      <div>
        <h2 className="font-heading text-base md:text-lg font-bold text-text-heading tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group flex items-center gap-1 text-xs font-medium text-text-muted hover:text-accent transition-colors duration-200 shrink-0"
        >
          {viewAllLabel}
          <ChevronRight
            size={13}
            className="group-hover:translate-x-0.5 transition-transform duration-200"
          />
        </Link>
      )}
    </div>
  );
}
