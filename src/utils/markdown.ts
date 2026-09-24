  export function stripMarkdown(text: string) {
    return text
      .replace(/```[\s\S]*?```/g, "") // remove code blocks entirely
      .replace(/`([^`]+)`/g, "$1") // inline code
      .replace(/^\#{1,6}\s+/gm, "") // headers
      .replace(/\*\*(.+?)\*\*/g, "$1") // bold
      .replace(/\*(.+?)\*/g, "$1") // italics
      .replace(/__(.+?)__/g, "$1") // bold (underscore)
      .replace(/_(.+?)_/g, "$1") // italics (underscore)
      .replace(/~~(.+?)~~/g, "$1") // strikethrough
      .replace(/\[(.+?)\]\(.+?\)/g, "$1") // links -> keep text only
      .replace(/^\s*[-*+]\s+/gm, "") // bullet list markers
      .replace(/^\s*\d+\.\s+/gm, "") // numbered list markers
      .replace(/\|/g, " ") // table pipes
      .replace(/^-+$/gm, "") // table separator rows
      .replace(/\n{2,}/g, ". ") // collapse blank lines into a pause
      .replace(/\n/g, " ") // remaining newlines -> space
      .trim();
  }