// app/not-found.tsx
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <Image
        src="/images/error.svg" // ← 任意の404画像パス（public配下）
        alt="404 Not Found"
        width={400}
        height={300}
        priority
        className={styles.image}
      />
      <h1 className={styles.title}>ページが見つかりませんでした</h1>
      <p className={styles.message}>
        お探しのページは削除されたか、存在しない可能性があります。
      </p>
      <Link href="/" className={styles.link}>
        ホームに戻る
      </Link>
    </div>
  );
}