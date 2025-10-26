export type Blog = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  eyecatch?: any; // アイキャッチ用の行を追加
  category?: any; // カテゴリー用の行を追加
};