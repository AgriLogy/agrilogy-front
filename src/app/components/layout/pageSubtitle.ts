import dayjs from 'dayjs';

const FORMAT = 'D MMMM YYYY';

/**
 * Compose the muted line under a PageInfoBar title. Returns a single
 * sentence in French, e.g. "Zone Maraîchage 1 · du 14 au 21 mai 2026".
 * Either argument can be missing while data loads; the function never
 * throws and silently omits the missing half.
 */
export function pageSubtitle(args: {
  zoneName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}): string | undefined {
  const { zoneName, startDate, endDate } = args;
  const parts: string[] = [];
  if (zoneName) parts.push(zoneName);
  if (startDate && endDate) {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    if (start.isValid() && end.isValid()) {
      parts.push(`du ${start.format(FORMAT)} au ${end.format(FORMAT)}`);
    }
  }
  return parts.length ? parts.join(' · ') : undefined;
}
