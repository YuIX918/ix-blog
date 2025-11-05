// app/blog/[id]/page.tsx
import { client } from "../../../libs/client";
import type { Blog } from "../../../types/blog";
import styles from '../../../styles/Blog.module.css'; 
import RelatedPosts from "../../../components/RelatedPosts"; 
import TableOfContents, { TocItem } from "../../../components/TableOfContents";
import { formatDate } from "../../../libs/formatDate";
import Link from 'next/link';
import * as cheerio from 'cheerio';
import LayoutWithSidebar from "../../../components/LayoutWithSidebar";

// ✅ 追加：記事ごとのメタデータ生成
export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const blog = await client.get<Blog>({
      endpoint: "blogs",
      contentId: id,
      queries: { fields: 'title,description,eyecatch' },
    });

    const ogImage = blog.eyecatch?.url || '/images/ogp_default.png';

    return {
      title: blog.title,
      description: blog.description || 'Ⅸのだらだら録の記事ページ',
      openGraph: {
        title: blog.title,
        description: blog.description || 'Ⅸのだらだら録の記事ページ',
        url: `https://ix-blog.netlify.app/blog/${id}`,
        siteName: 'Ⅸのだらだら録',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${blog.title} のOGP画像`,
          },
        ],
        locale: 'ja_JP',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.description || 'Ⅸのだらだら録の記事ページ',
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error("メタデータ生成エラー:", error);
    return {
      title: '記事が見つかりません',
      description: '指定された記事は存在しません。',
    };
  }
}

// ✅ パラメータ生成（変わらず）
export async function generateStaticParams() {
  const data = await client.get({ endpoint: "blogs" });
  return data.contents.map((content: Blog) => ({
    id: content.id,
  }));
}

// ✅ ISR
export const revalidate = 60;

// ✅ メインコンポーネント
export default async function BlogId({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams; 
  const blog = await client.get<Blog>({ 
    endpoint: "blogs", 
    contentId: id,
    queries: { depth: 2 } 
  });

  // 以下は元の処理と同じ
  let relatedPosts: Blog[] = [];
  if (blog.category?.id) { 
    try {
      const relatedData = await client.get({
        endpoint: 'blogs',
        queries: {
          filters: `category[equals]${blog.category.id}[and]id[not_equals]${blog.id}`,
          limit: 4,
          depth: 2, 
        }
      });
      relatedPosts = relatedData.contents;
    } catch (error) {
      console.error("関連記事の取得に失敗しました:", error);
    }
  }

  const $ = cheerio.load(blog.body);
  const headings = $('h2, h3');
  const toc: TocItem[] = [];
  headings.each((_, element) => { 
    if (element.type === 'tag') {
      const level = element.name as 'h2' | 'h3';
      const text = $(element).text();
      const id = $(element).attr('id');
      if (id && text) {
        toc.push({ text, id, level });
      }
    }
  });

  const isUpdated = blog.updatedAt !== blog.publishedAt;

  return (
    <LayoutWithSidebar>
      <article className={styles.post}>
        <div className={styles.postHeader}>
          <h1 className={styles.title}>{blog.title}</h1>
          <div className={styles.dateContainer}>
            <time dateTime={blog.publishedAt}>公開日: {formatDate(blog.publishedAt)}</time>
            {isUpdated && (
              <time dateTime={blog.updatedAt}>更新日: {formatDate(blog.updatedAt)}</time>
            )}
          </div>
        </div>

        <TableOfContents toc={toc} />
        <div dangerouslySetInnerHTML={{ __html: `${blog.body}` }} />
      </article>

      {blog.category && (
        <div className={styles.tagContainer}>
          <span>カテゴリ:</span>
          <Link href={`/category/${blog.category.id}`} className={styles.tagBadge}>
            {blog.category.name}
          </Link>
        </div>
      )}

      <RelatedPosts posts={relatedPosts} />
    </LayoutWithSidebar>
  );
}
