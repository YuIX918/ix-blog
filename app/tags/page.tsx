// app/tags/page.tsx
import { client } from '../../libs/client';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { formatDate } from '../../libs/formatDate';
import type { Blog, Category } from '../../types/blog';
import tagPageStyles from '../../styles/TagsPage.module.css'; 
import LayoutWithSidebar from '../../components/LayoutWithSidebar'; // 新しいレイアウトをインポート

export const metadata: Metadata = {
  title: 'タグ別検索',
};
export const revalidate = 60;
type CategoryWithPosts = Category & {
  posts: Blog[];
};

export default async function TagsPage() {
  const categoryData = await client.get({ endpoint: 'categories' });
  const categories: Category[] = categoryData.contents;
  const postLimit = 3; 
  const categoryPromises = categories.map(async (category) => { 
    const postData = await client.get({
      endpoint: 'blogs',
      queries: {
        filters: `category[equals]${category.id}`,
        limit: postLimit,
        depth: 2, 
      },
    });
    return { ...category, posts: postData.contents };
   });
  const categoriesWithPosts: CategoryWithPosts[] = await Promise.all(categoryPromises);

  return (
    // サイドバー付きレイアウト
    <LayoutWithSidebar>
      <h1 className={tagPageStyles.mainTitle}>タグ別検索</h1>
      <div className={tagPageStyles.gridContainer}>
        {categoriesWithPosts.map((category) => (
          <section key={category.id} className={tagPageStyles.categoryColumn}>
             <h2 className={tagPageStyles.categoryTitle}>{category.name}</h2>
             <div className={tagPageStyles.postsList}> 
               {category.posts.map((post) => (
                 <Link href={`/blog/${post.id}`} key={post.id} className={tagPageStyles.tagPostCard}>
                   <article>
                    {post.eyecatch ? (
                      <div className={tagPageStyles.tagImageWrapper}>
                        <Image
                          src={post.eyecatch.url}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw" 
                          className={tagPageStyles.tagEyecatch}
                        />
                      </div>
                    ) : (
                      <div className={tagPageStyles.tagImageWrapper}>
                        <div className={tagPageStyles.tagEyecatchDummy} />
                      </div>
                    )}
                    <div className={tagPageStyles.tagPostContent}>
                      <h3 className={tagPageStyles.tagPostTitle}>{post.title}</h3>
                      <time dateTime={post.publishedAt} className={tagPageStyles.tagPostDate}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                  </article>
                 </Link>
               ))}
             </div>
             {category.posts.length > 0 && (
               <div className={tagPageStyles.seeMoreContainer}> 
                 <Link href={`/category/${category.id}`} className={tagPageStyles.seeMoreButton}>
                   もっとみる <span aria-hidden="true">&gt;</span>
                 </Link>
               </div>
             )}
          </section>
        ))}
      </div>
    </LayoutWithSidebar>
  );
}