// components/Header.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Header.module.css';

import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiMonitor,
  FiSearch,
  FiCheck,
} from 'react-icons/fi';

// --- ↓↓↓ ここから追記 ↓↓↓ ---
// Simple Icons (si) からブランドアイコンをインポート
import { SiX, SiYoutube, SiPixiv } from 'react-icons/si';
// --- ↑↑↑ ここまで追記 ↑↑↑ ---

type Theme = 'light' | 'dark' | 'system';

// メニューの項目
const menuItems = [
  { href: '/', label: 'Home' },
  { href: '/tags', label: 'タグ検索' },
  { href: '/contact', label: 'お問い合わせ' },
];

// --- ↓↓↓ ここから追記 ↓↓↓ ---
// ソーシャルリンクの定義
const socialLinks = [
  { 
    href: 'https://x.com/yy819po', // ★ あなたのURLに変更
    label: 'Twitter', 
    icon: <SiX size={24} /> 
  },
  { 
    href: 'https://youtube.com/YOUR_CHANNEL', // ★ あなたのURLに変更
    label: 'YouTube', 
    icon: <SiYoutube size={24} /> 
  },
  { 
    href: 'https://www.pixiv.net/users/31308915', // ★ あなたのURLに変更
    label: 'Pixiv', 
    icon: <SiPixiv size={24} /> 
  },
];
// --- ↑↑↑ ここまで追記 ↑↑↑ ---

export default function Header() {
  // ... (useState, useEffect, applyTheme, etc. のロジックは一切変更なし) ...
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // (applyTheme, useEffect, selectTheme, renderThemeIcon, toggleMenu...
  //  ...これら全ての関数は変更なし)
  const applyTheme = (themeToApply: Theme) => {
    if (themeToApply === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      document.documentElement.setAttribute(
        'data-theme',
        prefersDark ? 'dark' : 'light'
      );
    } else {
      document.documentElement.setAttribute('data-theme', themeToApply);
    }
  };
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const currentThemeSetting = localStorage.getItem('theme') as Theme | null;
      if (currentThemeSetting === 'system' || !currentThemeSetting) {
        document.documentElement.setAttribute(
          'data-theme',
          e.matches ? 'dark' : 'light'
        );
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const selectTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    setIsThemeMenuOpen(false);
  };
  const renderThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <FiSun size={22} />;
      case 'dark':
        return <FiMoon size={22} />;
      case 'system':
        return <FiMonitor size={22} />;
    }
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className={styles.header}>
        {/* ... (ハンバーガーボタン、ロゴ、テーマ切り替えボタンは変更なし) ... */}
        <button
          className={`${styles.menuButton} ${styles.iconButton}`}
          onClick={toggleMenu}
          aria-label="メニューを開閉する"
        >
          {isMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/images/logo.svg"
              alt="MyBlog ロゴ"
              width={120}
              height={40}
              priority
            />
          </Link>
        </div>
        <div className={styles.themeMenuContainer} ref={themeMenuRef}>
          <button
            className={`${styles.themeButton} ${styles.iconButton}`}
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            aria-label="カラーテーマを切り替える"
            aria-expanded={isThemeMenuOpen}
          >
            {renderThemeIcon()}
          </button>
          {isThemeMenuOpen && (
            <div className={styles.themeMenu}>
              <button
                className={styles.themeMenuItem}
                onClick={() => selectTheme('light')}
              >
                <FiSun size={18} />
                <span>ライト</span>
                {theme === 'light' && <FiCheck size={18} className={styles.checkIcon} />}
              </button>
              <button
                className={styles.themeMenuItem}
                onClick={() => selectTheme('dark')}
              >
                <FiMoon size={18} />
                <span>ダーク</span>
                {theme === 'dark' && <FiCheck size={18} className={styles.checkIcon} />}
              </button>
              <button
                className={styles.themeMenuItem}
                onClick={() => selectTheme('system')}
              >
                <FiMonitor size={18} />
                <span>システム</span>
                {theme === 'system' && <FiCheck size={18} className={styles.checkIcon} />}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* --- <nav> の中身を変更 --- */}
      <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
        
        {/* 検索ボックスとメニュー項目 (変更なし) */}
        <div> {/* ★ 上部コンテンツをdivで囲む */}
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input type="search" placeholder="記事を検索..." />
          </div>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.href} className={styles.menuItem}>
                <Link href={item.href} onClick={toggleMenu}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* --- ↑↑↑ ここまで変更 (divで囲む) ↑↑↑ --- */}


        {/* --- ↓↓↓ ここから追記 ↓↓↓ --- */}
        {/* ソーシャルリンク (メニューの右下) */}
        <div className={styles.socialLinks}>
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank" // 外部リンクは新しいタブで開く
              rel="noopener noreferrer" // セキュリティ対策
              aria-label={link.label} // スクリーンリーダー用
              className={styles.socialIcon}
            >
              {link.icon}
            </a>
          ))}
        </div>
        {/* --- ↑↑↑ ここまで追記 ↑↑↑ --- */}

      </nav>

      {/* オーバーレイ (変更なし) */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={toggleMenu}></div>
      )}
    </>
  );
}