// components/LayoutWithSidebar.tsx
import Sidebar from './Sidebar'; // 作成した Sidebar をインポート
import styles from '../styles/TwoColumnLayout.module.css'; // 2カラム用CSSをインポート

type Props = {
  children: React.ReactNode;
};

export default function LayoutWithSidebar({ children }: Props) {
  return (
    // contentInner で中央揃えと余白を管理
    <div className={styles.contentInner}>
      {/* gridContainer で2カラム分割 */}
      <div className={styles.gridContainer}>
        {/* 左カラム (渡された children を表示) */}
        <div className={styles.mainContent}>
          {children}
        </div>
        {/* 右カラム (Sidebar を表示) */}
        <Sidebar /> 
      </div>
    </div>
  );
}