// app/contact/page.tsx
import type { Metadata } from 'next';
import layoutStyles from '../../styles/Layout.module.css'; // 中央揃えCSSを使用

export const metadata: Metadata = {
  title: 'お問い合わせ',
};

export default function ContactPage() {
  return (
    // 中央揃えを適用
    <article className={layoutStyles.contentWrapper}>
      <h1>お問い合わせ</h1>
      <p>
        お問い合わせフォームは現在準備中です。
        <br />
        （ここにGoogleフォームを埋め込んだり、フォームコンポーネントを配置します）
      </p>
    </article>
  );
}