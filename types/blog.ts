// types/blog.ts

// カテゴリの型定義
export type Category = {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
    name: string;
};

// アイキャッチの型定義
export type Eyecatch = {
    url: string;
    height: number;
    width: number;
};

// Blog の型定義
export type Blog = {
    id: string;

    // --- ↓↓↓ ここから4行を追記・確認してください ↓↓↓ ---
    createdAt: string;
    updatedAt: string;
    publishedAt: string; // ソートと日付表示に必須
    revisedAt: string;
    // --- ↑↑↑ ここまで ---

    title: string;
    body: string;
    eyecatch?: Eyecatch;
    category?: Category;
};

// ブログ一覧レスポンスの型
export type BlogListResponse = {
    contents: Blog[];
    totalCount: number;
    offset: number;
    limit: number;
};