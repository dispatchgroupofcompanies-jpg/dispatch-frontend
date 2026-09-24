// Load dates are calendar dates, even when the API returns a UTC timestamp.
// Keep the saved date portion instead of shifting it into the browser timezone.
export const toLoadDateInput = (value?: string | null): string =>
  value?.match(/^\d{4}-\d{2}-\d{2}(?=T|$)/)?.[0] ?? "";

export function formatLoadDate(value?: string | null, short = false): string {
  const date = toLoadDateInput(value);
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00Z`);
  if (short) {
    const month = parsed.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
    return `${parsed.getUTCDate()} ${month}`;
  }
  return parsed.toLocaleDateString(undefined, { timeZone: "UTC" });
}
