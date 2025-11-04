// libs/formatDate.ts

export function formatDateToJST(iso: string | undefined | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  try {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Tokyo',
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
}

// 既存の formatDate の互換を保つ簡易関数（YYYY/MM/DD）
export function formatDate(iso: string | undefined | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

export default formatDate;