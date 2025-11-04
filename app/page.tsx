// app/page.tsx
import Image from 'next/image';
import styles from '../styles/Home.module.css'; 
import LayoutWithSidebar from '../components/LayoutWithSidebar'; // 新しいレイアウトをインポート
import RandomPostsCarousel from '../components/RandomPostsCarousel';
import PostList from '../components/PostList';
import Footer from '../components/Footer'; // フッターをインポート
import { client } from '../libs/client';
import type { Blog } from '../types/blog';

export const revalidate = 60;

function shuffleArray(array: Blog[]): Blog[] { 
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default async function Home() {
  const data = await client.get({ endpoint: 'blogs' });
  const allPosts = data.contents;
  const randomPosts = shuffleArray(allPosts).slice(0, 5);

  return (
    <>
      {/* バナー */}
      <div className={styles.heroContainer}>
        <Image
          src="/images/title.png"
          alt="ブログのヒーローイメージ"
          width={1920} 
          height={750} 
          className={styles.heroImage}
          priority
        />
      </div>
      
      {/* サイドバー付きレイアウト */}
      <LayoutWithSidebar>
        {/* ランダム記事カルーセル */}
        <RandomPostsCarousel posts={randomPosts} />
        {/* ブログ一覧 */}
        <PostList posts={allPosts} />
      </LayoutWithSidebar>

      {/* フッター */}
      <Footer />
    </>
  );
}