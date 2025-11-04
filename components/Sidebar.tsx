// components/Sidebar.tsx
import Link from 'next/link';
import { client } from '../libs/client';
import type { Blog } from '../types/blog';
import styles from '../styles/TwoColumnLayout.module.css';
import ArchiveDropdown from './ArchiveDropdown.client';

// Archive の型
type Archive = {
  yearMonth: string; // "YYYY-MM"
  label: string;     // "YYYY年MM月"
  count: number;
};

// 新着記事を取得する関数（最新5件）
async function getRecentPosts(): Promise<Pick<Blog, 'id' | 'title' | 'publishedAt'>[]> {
  try {
    const data = await client.get({
      endpoint: 'blogs',
      queries: {
        limit: 5,
        orders: '-publishedAt',
        fields: 'id,title,publishedAt',
      },
    });
    return (data.contents || []) as Pick<Blog, 'id' | 'title' | 'publishedAt'>[];
  } catch (error) {
    console.error('新着記事の取得に失敗:', error);
    return [];
  }
}

// アーカイブ（全件ページネーション）で集計する
async function getArchives(): Promise<Archive[]> {
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

    const counts: Record<string, number> = {};
    const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
    all.forEach((p) => {
      if (!p.publishedAt) return;
      const d = new Date(p.publishedAt);
      if (isNaN(d.getTime())) return;
      const jst = new Date(d.getTime() + JST_OFFSET_MS);
      const ym = `${jst.getFullYear()}-${String(jst.getMonth() + 1).padStart(2, '0')}`;
      counts[ym] = (counts[ym] || 0) + 1;
    });

    const archives = Object.entries(counts)
      .map(([yearMonth, count]) => {
        const [y, m] = yearMonth.split('-');
        return { yearMonth, label: `${y}年${Number(m)}月`, count };
      })
      .sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));

    return archives;
  } catch (error) {
    console.error('アーカイブ情報の取得に失敗:', error);
    return [];
  }
}

export default async function Sidebar() {
  const recentPosts = await getRecentPosts();
  const archives = await getArchives();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarSection}>
        <h2>プロフィール</h2>
        <p style={{ marginBottom: '10px' }}>[icon]</p>
        <p>あなたの簡単な自己紹介やブログの紹介が入ります。</p>
      </div>

      <div className={styles.sidebarSection}>
        <h2>検索</h2>
        <form action="/search" method="GET">
          <input type="text" name="q" placeholder="キーワードを入力..." className={styles.sidebarSearchInput} />
        </form>
      </div>

      <div className={styles.sidebarSection}>
        <h2>新着記事</h2>
        {recentPosts.length > 0 ? (
          <ul>
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.id}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>新着記事はありません。</p>
        )}
      </div>

      <div className={styles.sidebarSection}>
        <h2>アーカイブ</h2>
        {archives.length > 0 ? (
          <ArchiveDropdown archives={archives} />
        ) : (
          <p>アーカイブはありません。</p>
        )}
      </div>
    </aside>
  );
}