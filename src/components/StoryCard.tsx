import Link from "next/link";
import { BookOpen, User, Layers } from "lucide-react";

interface StoryCardProps {
  slug: string;
  title: string;
  author?: string | null;
  coverImage?: string | null;
  status: string;
  genres?: string | null;
  shortDescription?: string | null;
}

export default function StoryCard({
  slug,
  title,
  author,
  coverImage,
  status,
  genres,
  shortDescription,
}: StoryCardProps) {
  return (
    <Link
      href={`/truyen/${slug}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-bg-card border border-border-subtle hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_0_1px_rgba(201,168,76,0.15)]"
    >
      {/* Cover Image */}
      <div className="relative w-full aspect-[3/4] bg-bg-elevated overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center">
              <BookOpen
                size={28}
                className="text-text-muted mx-auto mb-2 opacity-40"
              />
              <span className="text-xs text-text-muted font-medium line-clamp-2">
                {title}
              </span>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md ${
              status === "COMPLETED"
                ? "bg-success/20 text-success border border-success/20"
                : "bg-accent-soft text-accent border border-accent/20"
            }`}
          >
            {status === "ONGOING" ? "Đang ra" : "Hoàn thành"}
          </span>
        </div>

        {/* Hover Arrow */}
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-accent/90 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent-foreground"
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col gap-1.5 flex-grow">
        <h3 className="text-[0.8125rem] font-semibold text-text-heading line-clamp-2 leading-snug group-hover:text-accent transition-colors duration-200">
          {title}
        </h3>

        {author && (
          <div className="flex items-center gap-1.5">
            <User size={11} className="text-text-muted shrink-0" />
            <span className="text-[11px] text-text-muted truncate">
              {author}
            </span>
          </div>
        )}

        {genres && (
          <div className="flex items-center gap-1.5 mt-auto pt-1">
            <Layers size={11} className="text-text-muted shrink-0" />
            <span className="text-[11px] text-text-muted truncate">
              {genres}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
