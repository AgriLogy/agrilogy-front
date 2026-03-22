/** Stable sort by ISO timestamp string (use before building a slider timeline). */
export function sortByTimestamp<T extends { timestamp: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

/** Sorted unique timestamps from one or more series */
export function unionSortedTimestamps(
  ...series: Array<Array<{ timestamp: string }>>
): string[] {
  const set = new Set<string>();
  for (const list of series) {
    for (const row of list) {
      if (row?.timestamp) set.add(row.timestamp);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Filter rows whose timestamp falls within the inclusive index window on `timestamps` */
export function filterByTimestampWindow<T extends { timestamp: string }>(
  rows: T[],
  timestamps: string[],
  startIdx: number,
  endIdx: number
): T[] {
  if (timestamps.length === 0 || rows.length === 0) return rows;
  const lo = timestamps[startIdx];
  const hi = timestamps[endIdx];
  if (lo == null || hi == null) return rows;
  return rows.filter((r) => r.timestamp >= lo && r.timestamp <= hi);
}

/** Join speed + direction rows on matching timestamps (for wind rose / paired series). */
export function alignWindSeriesByTimestamp<T extends { timestamp: string }>(
  speedData: T[],
  directionData: T[]
): { timeline: string[]; speed: T[]; direction: T[] } {
  const dirByTs = new Map(directionData.map((d) => [d.timestamp, d]));
  const pairs: { ts: string; speed: T; direction: T }[] = [];
  for (const s of speedData) {
    const d = dirByTs.get(s.timestamp);
    if (d) pairs.push({ ts: s.timestamp, speed: s, direction: d });
  }
  pairs.sort((a, b) => a.ts.localeCompare(b.ts));
  return {
    timeline: pairs.map((p) => p.ts),
    speed: pairs.map((p) => p.speed),
    direction: pairs.map((p) => p.direction),
  };
}
