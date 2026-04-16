/**
 * Convert plain text (with newlines) → HTML paragraphs.
 * If content already contains HTML tags (<p>, <br>, etc.), return as-is.
 */
export function plainTextToHtml(content: string): string {
  if (!content?.trim()) return '';

  // If it already looks like HTML, return as-is
  if (/<(p|br|div|h[1-6]|span|b|i|strong|em)[^>]*>/i.test(content)) {
    return content;
  }

  // Split by double newlines (paragraph breaks) or single newlines
  const paragraphs = content
    .split(/\n{2,}/) // split on blank lines first
    .flatMap((block) =>
      // Within each block, keep single newlines as <br> if there are multiple lines
      block.trim()
        ? [`<p>${block.replace(/\n/g, '<br />')}</p>`]
        : []
    );

  return paragraphs.join('\n');
}
