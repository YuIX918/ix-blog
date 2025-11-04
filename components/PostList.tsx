// components/PostList.tsx
"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import type { Blog } from '../types/blog';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/PostList.module.css';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import { formatDate } from '../libs/formatDate';

// Props に hideTitle と hideSort を追加
type Props = {
  posts: Blog[];
  hideTitle?: boolean; // ? を付けてオプショナルにする
  hideSort?: boolean;  // ? を付けてオプショナルにする
};

type SortOrder = 'newest' | 'oldest';
const sortLabels: Record<SortOrder, string> = {
  newest: '新着順',
  oldest: '古い順',
};

const POSTS_PER_PAGE = 10;

// デフォルト値を false に設定
export default function PostList({ posts, hideTitle = false, hideSort = false }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ドロップダウンの外側クリック用 useEffect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target as Node)
      ) {
        setIsSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ソートロジック
  const sortedPosts = useMemo(() => {
    const sorted = [...posts];
    sorted.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      if (sortOrder === 'newest') {
        return dateB - dateA; // 降順
      } else {
        return dateA - dateB; // 昇順
      }
    });
    return sorted;
  }, [posts, sortOrder]);

  // ページネーションロジック
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return sortedPosts.slice(startIndex, endIndex);
  }, [currentPage, sortedPosts]);

  // ソート選択時の処理
  const selectSort = (order: SortOrder) => {
    setSortOrder(order);
    setIsSortMenuOpen(false);
    setCurrentPage(1); // ソートしたら1ページ目に戻す
  };

  // ページ変更時の処理
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.container}>

      {/* ヘッダーを条件付き表示 */}
      {!hideTitle && (
        <div className={styles.header}>
          <h1>ブログ一覧</h1>
        </div>
      )}

      {/* ソートコンテナを条件付き表示 */}
      {!hideSort && (
        <div className={styles.sortContainer}>
          <div className={styles.sortMenuContainer} ref={sortMenuRef}>
            <button
              className={styles.sortButton}
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            >
              <span>{sortLabels[sortOrder]}</span>
              <FiChevronDown size={18} />
            </button>

            {isSortMenuOpen && (
              <div className={styles.sortMenu}>
                <button
                  className={styles.sortMenuItem}
                  onClick={() => selectSort('newest')}
                >
                  <span>新着順</span>
                  {sortOrder === 'newest' && <FiCheck size={18} className={styles.checkIcon} />}
                </button>
                <button
                  className={styles.sortMenuItem}
                  onClick={() => selectSort('oldest')}
                >
                  <span>古い順</span>
                  {sortOrder === 'oldest' && <FiCheck size={18} className={styles.checkIcon} />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 記事グリッド */}
      <div className={styles.gridContainer}>
        {paginatedPosts.map((post) => (
          <Link href={`/blog/${post.id}`} key={post.id} className={styles.postCard}>
            <article>
              {post.eyecatch ? (
                <Image
                  src={post.eyecatch.url}
                  width={post.eyecatch.width}
                  height={post.eyecatch.height}
                  alt=""
                  className={styles.eyecatch}
                />
              ) : (
                <div className={styles.eyecatch} style={{ background: '#eee' }} />
              )}
              <div className={styles.postContent}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <time dateTime={post.publishedAt} className={styles.postDate}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* ページネーションUI */}
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          前へ
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? styles.activePage : ''}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          次へ
        </button>
      </div>
    </div>
  );
}