import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
      {/* Background Layers */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Top center glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[560px] h-[360px] bg-accent/[0.07] rounded-full blur-[100px]" />
        {/* Bottom left accent */}
        <div className="absolute bottom-0 left-1/3 w-[280px] h-[180px] bg-accent/[0.04] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-5">
        <div className="max-w-xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft border border-accent/15 mb-5">
            <Sparkles size={11} className="text-accent" />
            <span className="text-[10px] font-semibold text-accent uppercase tracking-widest">
              Nền tảng đọc truyện
            </span>
          </div>

          {/* Title — Manrope, clean bold */}
          <h1 className="font-heading text-[1.875rem] md:text-[2.5rem] font-bold text-text-heading leading-[1.18] tracking-tight mb-4">
            Đọc truyện hay,{" "}
            <span className="text-accent">mọi lúc</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[0.9375rem] text-text-secondary leading-relaxed max-w-md mx-auto mb-8">
            Thư viện truyện chữ chất lượng cao với giao diện đọc tối ưu — sạch,
            mượt và không phân tâm.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/truyen"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 shadow-[0_0_18px_var(--accent-glow)] hover:shadow-[0_0_28px_var(--accent-glow)]"
            >
              Bắt đầu đọc
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </Link>
            <Link
              href="/truyen"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-text-secondary border border-border-light rounded-lg hover:border-border-accent hover:text-text-heading hover:bg-white/[0.025] transition-all duration-200"
            >
              Khám phá thư viện
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
