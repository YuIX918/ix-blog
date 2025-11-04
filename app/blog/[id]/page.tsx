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
import type { Metadata } from "next";

// --- ページ生成設定 ---
export async function generateStaticParams() {
  const data = await client.get({ endpoint: "blogs" });
  return data.contents.map((content: Blog) => ({
    id: content.id,
  }));
}
export const revalidate = 60;

// --- 記事データ取得関数 ---
async function getBlogData(id: string): Promise<Blog> {
  const blog = await client.get<Blog>({
    endpoint: "blogs",
    contentId: id,
    queries: { depth: 2 },
  });
  return blog;
}

// --- メタデータ生成 ---
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const blog = await getBlogData(params.id);

  // HTMLタグを除去して概要を短く整形
  const plainText = blog.body.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const description =
    plainText.length > 120
      ? plainText.slice(0, plainText.indexOf("。", 80) !== -1 ? plainText.indexOf("。", 80) + 1 : 120)
      : plainText;

  return {
    title: `${blog.title} | Ⅸのだらだら録`,
    description,
    openGraph: {
      title: blog.title,
      description,
      url: `https://your-domain.com/blog/${params.id}`,
      images: [
        {
          url: blog.eyecatch?.url || "/images/ogp_default.png",
          width: 1200,
          height: 630,
          alt: `${blog.title} のサムネイル`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: [blog.eyecatch?.url || "/images/ogp_default.png"],
      creator: "@yy819po", // ←あればTwitter IDを入れてね
    },
  };
}

// --- 記事ページ本体 ---
export default async function BlogId({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams; 
  const blog = await getBlogData(id);

  // 関連記事取得
  let relatedPosts: Blog[] = [];
  if (blog.category && blog.category.id) {
    try {
      const relatedData = await client.get({
        endpoint: "blogs",
        queries: {
          filters: `category[equals]${blog.category.id}[and]id[not_equals]${blog.id}`,
          limit: 4,
          depth: 2,
        },
      });
      relatedPosts = relatedData.contents;
    } catch (error) {
      console.error("関連記事の取得に失敗しました:", error);
    }
  }

  // 目次生成
  const $ = cheerio.load(blog.body);
  const headings = $("h2, h3");
  const toc: TocItem[] = [];
  headings.each((index: number, element: cheerio.Element) => { 
    if (element.type === "tag") {
      const level = element.name as "h2" | "h3";
      const text = $(element).text();
      const id = $(element).attr("id");
      if (id && text) {
        toc.push({ text, id, level });
      }
    }
  });

  const isUpdated = blog.updatedAt !== blog.publishedAt;

  // --- 表示 ---
  return (
    <LayoutWithSidebar>
      <article className={styles.post}>
        <div className={styles.postHeader}>
          <h1 className={styles.title}>{blog.title}</h1>
          <div className={styles.dateContainer}>
            <time dateTime={blog.publishedAt}>
              公開日: {formatDate(blog.publishedAt)}
            </time>
            {isUpdated && (
              <time dateTime={blog.updatedAt}>
                更新日: {formatDate(blog.updatedAt)}
              </time>
            )}
          </div>
        </div>

        <TableOfContents toc={toc} />

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />

        {blog.category && (
          <div className={styles.tagContainer}>
            <span>カテゴリ:</span>
            <Link
              href={`/category/${blog.category.id}`}
              className={styles.tagBadge}
            >
              {blog.category.name}
            </Link>
          </div>
        )}

        <RelatedPosts posts={relatedPosts} />
      </article>
    </LayoutWithSidebar>
  );
}