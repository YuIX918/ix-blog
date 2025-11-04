// components/Footer.tsx
import Link from 'next/link';
import styles from '../styles/Footer.module.css'; // CSSモジュールをインポート

export default function Footer() {
  const currentYear = new Date().getFullYear(); // 現在の年を取得

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 左側: ナビゲーションリンク (例) */}
        <nav className={styles.nav}>
          <Link href="/privacy-policy">プライバシーポリシー</Link>
          {/* 他に必要なリンクがあれば追加 */}
        </nav>

        {/* 右側: コピーライト */}
        <div className={styles.copyright}>
          &copy; {currentYear} [あなたのブログ名]. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}