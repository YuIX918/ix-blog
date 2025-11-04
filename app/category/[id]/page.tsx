// app/category/[id]/page.tsx
import Link from 'next/link';
import { client } from '../../../libs/client';
import type { Blog } from '../../../types/blog'; 
import type { Metadata } from 'next';
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'; // 新しいレイアウトをインポート
// ★ PostList コンポーネントをインポート (一覧表示に使う)
import PostList from '../../../components/PostList'; 

// Props, Category, generateStaticParams, revalidate
type Props = {
  params: Promise<{ id: string }>;
};
type Category = {
  id: string;
  name: string;
};
export async function generateStaticParams() { 
  const data = await client.get({ endpoint: 'categories' });
  return data.contents.map((content: Category) => ({
    id: content.id,
  }));
 }
export const revalidate = 60;

export default async function CategoryIdPage({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  // カテゴリ名を取得
  const categoryData = await client.get<Category>({
    endpoint: 'categories',
    contentId: id,
  });
  // そのカテゴリの記事を "すべて" 取得 (PostList がページネーションを担当)
  const blogData = await client.get({
    endpoint: 'blogs',
    queries: {
      filters: `category[equals]${id}`,
      limit: 100, // 多めに取得 (microCMSの無料プラン上限)
      depth: 2, // アイキャッチ取得
    },
  });
  const posts = blogData.contents;

  return (
    // サイドバー付きレイアウト
    <LayoutWithSidebar>
      {/* ★ PostList を使って記事一覧を表示 */}
      {/* （PostList 側でタイトル表示とソートを行うので h1 は不要） */}
      <PostList posts={posts} /> 
      
      {/* // 以前のシンプルなリスト表示
      <h1>カテゴリ: {categoryData.name} の記事一覧</h1>
      <ul>
        {posts.map((blog: Blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
      */}
    </LayoutWithSidebar>
  );
}