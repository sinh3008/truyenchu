"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Scissors,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Upload,
  Sparkles,
} from "lucide-react";

interface Part {
  id: number;
  title: string;
  part_number: number;
}

interface ParsedChapter {
  title: string;
  content: string;
  expanded: boolean;
  editing: boolean;
}

interface Props {
  storyId: number;
  parts: Part[];
  nextChapterNumber: number;
}

// ──────────────────────────────────────────
// Parse raw text into chapters
// ──────────────────────────────────────────
function parseChapters(
  rawText: string,
  separator: string,
  useRegex: boolean
): ParsedChapter[] {
  if (!rawText.trim()) return [];

  let segments: string[] = [];

  if (useRegex) {
    try {
      const re = new RegExp(separator, "gi");
      segments = rawText.split(re).filter((s) => s.trim());
      // The regex split removes the delimiter, so we need titles from matches
      const matches = Array.from(rawText.matchAll(new RegExp(separator, "gi")));
      return matches.map((match, i) => {
        const title = match[0].trim();
        const contentStart = (match.index ?? 0) + match[0].length;
        const contentEnd =
          matches[i + 1]?.index ?? rawText.length;
        const content = rawText.slice(contentStart, contentEnd).trim();
        return { title, content, expanded: false, editing: false };
      });
    } catch {
      // Fallback to simple split
    }
  }

  // Simple line-by-line split on separator
  const lines = rawText.split("\n");
  const chapters: ParsedChapter[] = [];
  let currentTitle = "";
  let currentContent: string[] = [];

  const sepLower = separator.toLowerCase().trim();

  for (const line of lines) {
    const trimmed = line.trim();
    const isHeader =
      sepLower &&
      (trimmed.toLowerCase().startsWith(sepLower) ||
        trimmed.toLowerCase().includes(sepLower));

    if (isHeader && trimmed.length < 200) {
      // Save previous chapter
      if (currentTitle || currentContent.length > 0) {
        chapters.push({
          title:
            currentTitle ||
            `Chương ${chapters.length + 1}`,
          content: currentContent.join("\n").trim(),
          expanded: false,
          editing: false,
        });
      }
      currentTitle = trimmed;
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Push last chapter
  if (currentTitle || currentContent.length > 0) {
    chapters.push({
      title: currentTitle || `Chương ${chapters.length + 1}`,
      content: currentContent.join("\n").trim(),
      expanded: false,
      editing: false,
    });
  }

  // If no chapters found (no separator match), treat whole text as one chapter
  if (chapters.length === 0 && rawText.trim()) {
    chapters.push({
      title: "Chương 1",
      content: rawText.trim(),
      expanded: false,
      editing: false,
    });
  }

  return chapters;
}

// ──────────────────────────────────────────
// Format content: wrap plain paragraphs in <p>
// ──────────────────────────────────────────
function formatContent(raw: string): string {
  const paragraphs = raw
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);
  return paragraphs.map((p) => `<p>${p}</p>`).join("\n");
}

export default function BulkChapterEditor({
  storyId,
  parts,
  nextChapterNumber,
}: Props) {
  const router = useRouter();

  // Step: "paste" | "preview"
  const [step, setStep] = useState<"paste" | "preview">("paste");

  // Paste step
  const [rawText, setRawText] = useState("");
  const [separator, setSeparator] = useState("Chương");
  const [useRegex, setUseRegex] = useState(false);
  const [autoFormat, setAutoFormat] = useState(true);

  // Settings
  const [partId, setPartId] = useState(parts[0]?.id?.toString() ?? "");
  const [startNumber, setStartNumber] = useState(nextChapterNumber);
  const [isPublished, setIsPublished] = useState(true);

  // Preview step
  const [chapters, setChapters] = useState<ParsedChapter[]>([]);

  // Submit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Step 1: Parse ──
  const handleParse = () => {
    if (!rawText.trim()) {
      setError("Vui lòng dán nội dung truyện");
      return;
    }
    setError("");
    const parsed = parseChapters(rawText, separator, useRegex);
    if (parsed.length === 0) {
      setError("Không tách được chương nào. Kiểm tra lại separator.");
      return;
    }
    setChapters(parsed);
    setStep("preview");
  };

  // ── Chapter editing ──
  const updateChapter = (
    idx: number,
    field: keyof ParsedChapter,
    value: string | boolean
  ) => {
    setChapters((prev) =>
      prev.map((ch, i) => (i === idx ? { ...ch, [field]: value } : ch))
    );
  };

  const removeChapter = (idx: number) => {
    setChapters((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleExpand = (idx: number) => {
    setChapters((prev) =>
      prev.map((ch, i) =>
        i === idx ? { ...ch, expanded: !ch.expanded } : ch
      )
    );
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (chapters.length === 0) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = chapters.map((ch) => ({
        title: ch.title,
        content: autoFormat ? formatContent(ch.content) : ch.content,
      }));

      const res = await fetch(
        `/api/admin/stories/${storyId}/chapters/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chapters: payload,
            part_id: partId,
            start_number: startNumber,
            is_published: isPublished,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra");
        return;
      }

      setSuccess(`✓ Đã tạo thành công ${data.count} chương!`);
      setTimeout(() => {
        router.push(`/admin/stories/${storyId}/chapters`);
      }, 1500);
    } catch {
      setError("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Feedback */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg">
          <AlertCircle size={14} className="text-danger shrink-0" />
          <span className="text-xs text-danger">{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
          <span className="text-xs text-emerald-400">{success}</span>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-3">
        <StepBadge num={1} label="Dán nội dung" active={step === "paste"} done={step === "preview"} />
        <div className="flex-1 h-px bg-border-subtle" />
        <StepBadge num={2} label="Xem trước & lưu" active={step === "preview"} done={false} />
      </div>

      {/* ── STEP 1: PASTE ── */}
      {step === "paste" && (
        <div className="space-y-4">
          {/* Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-bg-card border border-border-subtle rounded-xl">
            {/* Part */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Thêm vào Phần <span className="text-danger">*</span>
              </label>
              <select
                value={partId}
                onChange={(e) => setPartId(e.target.value)}
                className="w-full px-3 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent/40 transition-all"
              >
                {parts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Start number */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Bắt đầu từ chương số
              </label>
              <input
                type="number"
                min={1}
                value={startNumber}
                onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent/40 transition-all"
              />
            </div>

            {/* Publish */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Trạng thái
              </label>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                  isPublished
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-bg-input text-text-muted border-border-subtle"
                }`}
              >
                {isPublished ? <Eye size={13} /> : <EyeOff size={13} />}
                {isPublished ? "Hiển thị" : "Ẩn"}
              </button>
            </div>
          </div>

          {/* Separator config */}
          <div className="p-4 bg-bg-card border border-border-subtle rounded-xl space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Scissors size={14} className="text-accent" />
              <span className="text-xs font-semibold text-text-heading">
                Cấu hình tách chương
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-text-muted mb-1">
                  Từ khóa phân cách chương
                </label>
                <input
                  type="text"
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  placeholder="VD: Chương, Chapter, ---"
                  className="w-full px-3 py-2 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2 justify-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-7 h-3.5 rounded-full relative transition-colors ${useRegex ? "bg-accent" : "bg-bg-elevated border border-border-light"}`}
                    onClick={() => setUseRegex(!useRegex)}
                  >
                    <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full shadow transition-transform ${useRegex ? "translate-x-3.5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-[11px] text-text-muted">Dùng Regex</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-7 h-3.5 rounded-full relative transition-colors ${autoFormat ? "bg-accent" : "bg-bg-elevated border border-border-light"}`}
                    onClick={() => setAutoFormat(!autoFormat)}
                  >
                    <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full shadow transition-transform ${autoFormat ? "translate-x-3.5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-[11px] text-text-muted">Tự động wrap &lt;p&gt;</span>
                </label>
              </div>
            </div>

            {/* Quick presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-text-muted self-center">Presets:</span>
              {["Chương", "Chapter", "CHƯƠNG", "---", "***"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSeparator(preset)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-all ${
                    separator === preset
                      ? "bg-accent/10 text-accent border-accent/25"
                      : "bg-bg-input text-text-muted border-border-subtle hover:border-border-light"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Text area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-text-secondary">
                Dán nội dung truyện
              </label>
              {rawText && (
                <span className="text-[11px] text-text-muted">
                  {rawText.length.toLocaleString()} ký tự
                </span>
              )}
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={18}
              placeholder={`Dán toàn bộ nội dung chương vào đây...\n\nVí dụ:\nChương 1: Khởi Đầu\nNội dung chương 1...\n\nChương 2: Bước Ngoặt\nNội dung chương 2...`}
              className="w-full px-4 py-4 bg-bg-input border border-border-subtle rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all resize-none font-mono leading-relaxed"
            />
          </div>

          {/* Parse button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleParse}
              disabled={!rawText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles size={14} />
              Tách Chương & Xem Trước
            </button>
            <span className="text-xs text-text-muted">
              Hệ thống sẽ tự tách theo từ khóa "{separator}"
            </span>
          </div>
        </div>
      )}

      {/* ── STEP 2: PREVIEW ── */}
      {step === "preview" && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="flex items-center justify-between p-4 bg-bg-card border border-border-subtle rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <CheckCircle2 size={15} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-heading">
                  Đã tách {chapters.length} chương
                </p>
                <p className="text-[11px] text-text-muted">
                  Sẽ được đánh số từ chương {startNumber} đến{" "}
                  {startNumber + chapters.length - 1}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep("paste")}
              className="text-xs text-text-muted hover:text-accent transition-colors px-3 py-1.5 border border-border-subtle rounded-lg hover:border-accent/25"
            >
              ← Quay lại
            </button>
          </div>

          {/* Chapter list */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {chapters.map((ch, idx) => (
              <div
                key={idx}
                className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden transition-all"
              >
                {/* Chapter header */}
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Number */}
                  <div className="w-8 h-8 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-text-muted">
                      {startNumber + idx}
                    </span>
                  </div>

                  {/* Title (editable) */}
                  {ch.editing ? (
                    <input
                      autoFocus
                      value={ch.title}
                      onChange={(e) =>
                        updateChapter(idx, "title", e.target.value)
                      }
                      onBlur={() => updateChapter(idx, "editing", false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          updateChapter(idx, "editing", false);
                      }}
                      className="flex-1 px-2 py-1 bg-bg-input border border-accent/40 rounded-md text-sm text-text-primary focus:outline-none"
                    />
                  ) : (
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onDoubleClick={() =>
                        updateChapter(idx, "editing", true)
                      }
                    >
                      <p className="text-sm font-medium text-text-heading truncate">
                        {ch.title}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {ch.content.length} ký tự · Double-click để sửa tiêu đề
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateChapter(idx, "editing", true)}
                      className="p-1.5 rounded-md text-text-muted hover:text-accent hover:bg-accent/[0.06] transition-all"
                      title="Sửa tiêu đề"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpand(idx)}
                      className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-white/[0.04] transition-all"
                      title={ch.expanded ? "Thu gọn" : "Mở rộng nội dung"}
                    >
                      {ch.expanded ? (
                        <ChevronUp size={13} />
                      ) : (
                        <ChevronDown size={13} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeChapter(idx)}
                      className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger/[0.06] transition-all"
                      title="Xóa chương này"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Expanded content preview */}
                {ch.expanded && (
                  <div className="border-t border-border-subtle px-4 py-3">
                    <textarea
                      value={ch.content}
                      onChange={(e) =>
                        updateChapter(idx, "content", e.target.value)
                      }
                      rows={8}
                      className="w-full px-3 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-xs text-text-secondary font-mono leading-relaxed focus:outline-none focus:border-accent/40 transition-all resize-none"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2 border-t border-border-subtle">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || chapters.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_16px_var(--accent-glow)]"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              {loading
                ? "Đang tạo..."
                : `Tạo ${chapters.length} Chương`}
            </button>
            <span className="text-xs text-text-muted">
              Sẽ thêm {chapters.length} chương vào phần đã chọn
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helper ──
function StepBadge({
  num,
  label,
  active,
  done,
}: {
  num: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
          done
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : active
            ? "bg-accent text-accent-foreground"
            : "bg-bg-card text-text-muted border border-border-subtle"
        }`}
      >
        {done ? "✓" : num}
      </div>
      <span
        className={`text-xs font-medium transition-colors ${
          active ? "text-text-heading" : "text-text-muted"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
