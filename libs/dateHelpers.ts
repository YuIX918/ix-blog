// libs/dateHelpers.ts

export const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * 指定した JST の year/month の月初（JST）を UTC ISO に変換して返す
 * 例: (2025,10) -> { gteUtcIso: '2025-09-30T15:00:00.000Z', ltUtcIso: '2025-10-31T15:00:00.000Z' }
 */
export function jstMonthBoundariesAsUtcIso(year: number, month: number) {
  // JST の月初（YYYY-MM-01T00:00 JST）を UTC ミリ秒に変換:
  const startJstMs = Date.UTC(year, month - 1, 1); // this is time at UTC representing the same y/m/day at 00:00 (but not yet offset)
  const startUtcMs = startJstMs - JST_OFFSET_MS;
  const endJstMs = Date.UTC(year, month, 1);
  const endUtcMs = endJstMs - JST_OFFSET_MS;

  return {
    gteUtcIso: new Date(startUtcMs).toISOString(),
    ltUtcIso: new Date(endUtcMs).toISOString(),
  };
}

/**
 * publishedAt ISO を JST に変換して年/月を返す
 */
export function toJstYearMonth(publishedAt: string) {
  const d = new Date(publishedAt);
  const jst = new Date(d.getTime() + JST_OFFSET_MS);
  return { year: jst.getFullYear(), month: jst.getMonth() + 1 };
}