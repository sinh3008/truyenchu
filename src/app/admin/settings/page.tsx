"use client";

import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Info,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra");
        return;
      }

      setSuccess("Đổi mật khẩu thành công!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setError("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (pw: string): { label: string; color: string; width: string } => {
    if (!pw) return { label: "", color: "", width: "0%" };
    const checks = [
      pw.length >= 8,
      /[A-Z]/.test(pw),
      /[0-9]/.test(pw),
      /[^a-zA-Z0-9]/.test(pw),
    ].filter(Boolean).length;
    if (checks <= 1) return { label: "Yếu", color: "bg-danger", width: "25%" };
    if (checks === 2) return { label: "Trung bình", color: "bg-warning", width: "50%" };
    if (checks === 3) return { label: "Khá mạnh", color: "bg-blue-400", width: "75%" };
    return { label: "Mạnh", color: "bg-emerald-500", width: "100%" };
  };

  const strength = passwordStrength(form.newPassword);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="font-heading text-lg font-bold text-text-heading">
          Cài Đặt
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Quản lý bảo mật và cấu hình tài khoản admin
        </p>
      </div>

      {/* ── Security Section ── */}
      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
        {/* Section Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border-subtle">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <ShieldCheck size={15} className="text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-heading">
              Đổi Mật Khẩu
            </h3>
            <p className="text-[11px] text-text-muted">
              Cập nhật mật khẩu để bảo vệ tài khoản admin
            </p>
          </div>
        </div>

        <div className="p-5">
          {/* Feedback */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg mb-4">
              <AlertCircle size={14} className="text-danger shrink-0" />
              <span className="text-xs text-danger">{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-4">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span className="text-xs text-emerald-400">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Mật Khẩu Hiện Tại
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={show.current ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, currentPassword: e.target.value }))
                  }
                  required
                  placeholder="Nhập mật khẩu hiện tại"
                  className="w-full pl-9 pr-10 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShow((p) => ({ ...p, current: !p.current }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {show.current ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Mật Khẩu Mới
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={show.new ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  required
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  className="w-full pl-9 pr-10 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => ({ ...p, new: !p.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {show.new ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Strength meter */}
              {form.newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="h-1 rounded-full bg-bg-elevated overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-[11px] text-text-muted">
                    Độ mạnh:{" "}
                    <span
                      className={
                        strength.label === "Mạnh"
                          ? "text-emerald-400"
                          : strength.label === "Khá mạnh"
                          ? "text-blue-400"
                          : strength.label === "Trung bình"
                          ? "text-warning"
                          : "text-danger"
                      }
                    >
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Xác Nhận Mật Khẩu Mới
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={show.confirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, confirmPassword: e.target.value }))
                  }
                  required
                  placeholder="Nhập lại mật khẩu mới"
                  className={`w-full pl-9 pr-10 py-2.5 bg-bg-input border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 transition-all ${
                    form.confirmPassword && form.newPassword !== form.confirmPassword
                      ? "border-danger/40 focus:border-danger/60 focus:ring-danger/15"
                      : form.confirmPassword && form.newPassword === form.confirmPassword
                      ? "border-emerald-500/40 focus:border-emerald-500/60 focus:ring-emerald-500/15"
                      : "border-border-subtle focus:border-accent/40 focus:ring-accent/15"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShow((p) => ({ ...p, confirm: !p.confirm }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {show.confirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                {/* Match indicator */}
                {form.confirmPassword && (
                  <div className="absolute right-9 top-1/2 -translate-y-1/2">
                    {form.newPassword === form.confirmPassword ? (
                      <CheckCircle2 size={13} className="text-emerald-400" />
                    ) : (
                      <AlertCircle size={13} className="text-danger" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="flex items-start gap-2 p-3 bg-bg-elevated rounded-lg border border-border-subtle">
              <Info size={13} className="text-text-muted shrink-0 mt-0.5" />
              <p className="text-[11px] text-text-muted leading-relaxed">
                Mật khẩu mạnh nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                thường, số và ký tự đặc biệt (VD: <code className="text-accent text-[10px]">Abc@1234</code>).
              </p>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Đổi Mật Khẩu
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Info Section ── */}
      <div className="bg-bg-card border border-border-subtle rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text-heading mb-3">
          Thông Tin Hệ Thống
        </h3>
        <div className="space-y-2">
          {[
            { label: "Nền tảng", value: "NovelVerse" },
            { label: "Framework", value: "Next.js 16 + Prisma" },
            { label: "Storage", value: "Cloudinary" },
            { label: "Database", value: "SQLite / LibSQL" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0"
            >
              <span className="text-xs text-text-muted">{item.label}</span>
              <span className="text-xs font-medium text-text-secondary">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
