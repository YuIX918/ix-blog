// components/TableOfContents.tsx
import Link from 'next/link';
import styles from '../styles/TableOfContents.module.css';

// 目次データの型を定義
export type TocItem = {
  text: string;
  id: string;
  level: 'h2' | 'h3';
};

type Props = {
  toc: TocItem[];
};

export default function TableOfContents({ toc }: Props) {
  // 目次が空なら何も表示しない
  if (toc.length === 0) {
    return null;
  }

  return (
    <nav className={styles.toc}>
      <h2>目次</h2>
      <ul>
        {toc.map((item) => (
          <li key={item.id} className={styles[item.level]}>
            <Link href={`#${item.id}`}>
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}