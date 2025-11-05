// app/archive/[year]/[month]/page.tsx

import { client } from '../../../../libs/client';
import type { Blog } from '../../../../types/blog';
import { notFound } from 'next/navigation';
import LayoutWithSidebar from '../../../../components/LayoutWithSidebar';
import PostList from '../../../../components/PostList';
import { jstMonthBoundariesAsUtcIso, JST_OFFSET_MS } from '../../../../libs/dateHelpers';
import styles from '../../styles/TwoColumnLayout.module.css';

type ParamsPromise = Promise<{ year: string; month: string }>;

export default async function ArchivePage({ params }: { params: ParamsPromise }) {
  const { year, month } = await params;

  if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month)) {
    console.error('⚠️ 無効なアーカイブURL形式:', { year, month });
    notFound();
  }

  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  if (m < 1 || m > 12) {
    console.error('⚠️ 無効な月:', m);
    notFound();
  }

  // JST月境界をUTC ISOに変換（例: JST 2025-10-01T00:00 -> UTC ISO）
  const { gteUtcIso, ltUtcIso } = jstMonthBoundariesAsUtcIso(y, m);
  console.log('📅 JST->UTC filter', { gteUtcIso, ltUtcIso });

  // 1) まずは microCMS filters で問い合わせ（効率的）
  let data;
  try {
    data = await client.get({
      endpoint: 'blogs',
      queries: {
        filters: `publishedAt[greater_than_equal]${gteUtcIso}[and]publishedAt[less_than]${ltUtcIso}`,
        limit: 100,
        orders: '-publishedAt',
        depth: 2,
      },
    });
  } catch (e) {
    console.error('❌ microCMS filter request failed:', e);
    data = null;
  }

  let posts: any[] = data?.contents ?? [];

  // 2) filtersが0件ならフォールバックで全件取得してサーバー側で JST 判定
  if (!posts || posts.length === 0) {
    console.log('🔁 filters returned 0 — fallback to full fetch + server-side JST filtering');

    const limit = 100;
    let offset = 0;
    let all: any[] = [];

    while (true) {
      try {
        const res = await client.get({
          endpoint: 'blogs',
          queries: {
            limit,
            offset,
            fields: 'id,title,publishedAt,createdAt,eyecatch,category',
            orders: '-publishedAt',
            depth: 2,
          },
        });

        if (!res || !res.contents) break;
        all = all.concat(res.contents);
        if (res.contents.length < limit) break;
        offset += limit;
      } catch (e) {
        console.error('❌ full fetch failed at offset', offset, e);
        break;
      }
    }

    console.log('🔎 fetched total (raw):', all.length);

    // サーバー側で JST 判定（publishedAt を JST にシフトして年/月を判定）
    posts = all.filter((p) => {
      if (!p.publishedAt) return false;
      const d = new Date(p.publishedAt);
      if (isNaN(d.getTime())) return false;
      const jst = new Date(d.getTime() + JST_OFFSET_MS);
      return jst.getFullYear() === y && jst.getMonth() + 1 === m;
    });

    // 安全に新着順ソート
    posts.sort((a, b) => {
      const da = new Date(a.publishedAt || a.createdAt).getTime();
      const db = new Date(b.publishedAt || b.createdAt).getTime();
      return db - da;
    });
  }

  // 3) 最終判定 — 404にする（要求どおり）
  if (!posts || posts.length === 0) {
    console.warn(`⚠️ ${y}-${String(m).padStart(2, '0')} の記事は存在しません -> returning 404`);
    notFound();
  }

  // 4) レンダリング
  const pageTitle = `${y}年${m}月 の記事一覧`;
  return (
    <LayoutWithSidebar>
      <h1>{pageTitle}</h1>
      <PostList posts={posts as Blog[]} hideTitle={true} hideSort={true} />
    </LayoutWithSidebar>
  );
}

// generateStaticParams: ページネーションで全件取得して month list を作る（JST基準）
export async function generateStaticParams() {
  try {
    const limit = 100;
    let offset = 0;
    let all: any[] = [];

    while (true) {
      const res = await client.get({
        endpoint: 'blogs',
        queries: { limit, offset, fields: 'publishedAt' },
      });
      if (!res || !res.contents) break;
      all = all.concat(res.contents);
      if (res.contents.length < limit) break;
      offset += limit;
    }

    const months = new Set<string>();
    all.forEach((p) => {
      if (!p.publishedAt) return;
      const d = new Date(p.publishedAt);
      if (isNaN(d.getTime())) return;
      // JSTで年/月を計算
      const jst = new Date(d.getTime() + JST_OFFSET_MS);
      const ym = `${jst.getFullYear()}-${String(jst.getMonth() + 1).padStart(2, '0')}`;
      months.add(ym);
    });

    const params = Array.from(months).map((ym) => {
      const [y, m] = ym.split('-');
      return { year: y, month: m };
    });

    console.log('✅ [generateStaticParams] 全件から生成:', params);
    return params;
  } catch (e) {
    console.error('❌ generateStaticParams (archive) 失敗:', e);
    return [];
  }
}

export const revalidate = 60;