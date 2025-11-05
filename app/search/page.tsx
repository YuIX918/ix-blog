// app/search/page.tsx
import { notFound } from 'next/navigation';
import LayoutWithSidebar from '../../components/LayoutWithSidebar';
import PostList from '../../components/PostList';
import styles from '../../styles/TwoColumnLayout.module.css';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params?.q?.trim();

  if (!query) {
    return (
      <LayoutWithSidebar>
        <main style={{ padding: '2rem' }}>
          <h1>検索</h1>
          <p>検索ワードを入力してください。</p>
        </main>
      </LayoutWithSidebar>
    );
  }

  const res = await fetch(
    `https://ix-blog.microcms.io/api/v1/blogs?filters=title[contains]${encodeURIComponent(query)}`,
    {
      headers: {
        'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY!,
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    console.error('Fetch error:', res.statusText);
    notFound();
  }

  const data = await res.json();

  return (
    <LayoutWithSidebar>
      <main className={styles.mainContent}>
        <h1 className={styles.mainTitle}>検索結果：「{query}」</h1>

        {data.contents.length === 0 ? (
          <p>該当する記事は見つかりませんでした。</p>
        ) : (
          <PostList posts={data.contents} hideTitle={true} hideSort={true} />
        )}
      </main>
    </LayoutWithSidebar>
  );
}