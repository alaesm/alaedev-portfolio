/** Parse textarea / newline-separated list into trimmed non-empty strings. */
export function parseMultilineList(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Serialize string array back to newline-separated textarea text (no trailing newline churn). */
export function formatMultilineList(items: string[] | undefined): string {
  return items?.length ? items.join('\n') : '';
}
