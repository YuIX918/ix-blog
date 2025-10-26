// ブログ記事1件の型定義
export type Blog = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  eyecatch?: any;
  category?: any;
};

// ブログ記事一覧のレスポンス全体の型定義
export type BlogListResponse = {
  contents: Blog;
  totalCount: number;
  limit: number;
  offset: number;
};