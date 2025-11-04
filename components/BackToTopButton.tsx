"use client";
// components/BackToTopButton.tsx
import { useState, useEffect } from 'react';
import Image from 'next/image'; // Imageコンポーネントをインポート
import styles from '../styles/BackToTopButton.module.css';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      className={`${styles.button} ${isVisible ? styles.visible : ''}`}
      onClick={scrollToTop}
      aria-label="ページ上部に戻る"
    >
      {/* public/images/move_up.svg を参照 */}
      <Image
        src="/images/move_up.svg"
        alt="上に戻る"
        width={24} // SVGの基準サイズに合わせて調整
        height={24} // SVGの基準サイズに合わせて調整
      />
    </button>
  );
}