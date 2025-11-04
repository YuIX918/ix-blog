// components/RelatedPosts.tsx
import type { Blog } from '../types/blog';
import Link from 'next/link';
import Image from 'next/image';
// PostList のカードデザインを流用します
import styles from '../styles/PostList.module.css'; 
import relatedStyles from '../styles/RelatedPosts.module.css';

type Props = {
  posts: Blog[];
};

export default function RelatedPosts({ posts }: Props) {
  // 関連記事が0件なら何も表示しない
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className={relatedStyles.container}>
      <h2>関連記事</h2>
      {/* PostList のグリッドコンテナを流用 */}
      <div className={styles.gridContainer}> 
        {posts.map((post) => (
          <Link href={`/blog/${post.id}`} key={post.id} className={styles.postCard}>
            <article>
              {post.eyecatch ? (
                <Image
                  src={post.eyecatch.url}
                  width={post.eyecatch.width}
                  height={post.eyecatch.height}
                  alt=""
                  className={styles.eyecatch}
                />
              ) : (
                <div className={styles.eyecatch} style={{ background: '#eee' }} />
              )}
              {/* postContent で囲み、日付も表示（一覧とデザインを合わせる） */}
              <div className={styles.postContent}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                {/* 関連記事に日付を表示したくない場合は、
                  ここの <time> タグを削除してください 
                */}
                {/* <time dateTime={post.publishedAt} className={styles.postDate}>
                  {formatDate(post.publishedAt)} 
                </time>
                */}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}