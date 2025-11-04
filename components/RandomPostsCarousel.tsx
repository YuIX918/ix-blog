// components/RandomPostsCarousel.tsx
"use client"; // ★ クライアントコンポーネントとして指定

import type { Blog } from '../types/blog'; // ブログの型をインポート
import Link from 'next/link';
import Image from 'next/image'; // (もしアイキャッチ画像も表示する場合)

// Swiper のコンポーネントとモジュールをインポート
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Swiper の基本CSSをインポート
import 'swiper/css';
import 'swiper/css/navigation'; // ナビゲーション（矢印）のCSS

// ★ Swiper の矢印アイコンのスタイル（後述）
import styles from '../styles/Carousel.module.css';

// ホームページからランダムな記事の配列を受け取る
type Props = {
  posts: Blog[];
};

export default function RandomPostsCarousel({ posts }: Props) {
  if (!posts || posts.length === 0) {
    return null; // 表示する記事がなければ何も表示しない
  }

  return (
    <div className={styles.carouselContainer}>
      <Swiper
        modules={[Navigation, Autoplay]} // ★ 矢印と自動再生のモジュールを有効化
        slidesPerView={3} // 画面内に3件表示
        spaceBetween={20} // 記事間のスペース
        loop={true} // 無限ループ
        navigation={true} // ★ 矢印（次へ/戻る）を有効化
        autoplay={{ // ★ 自動再生
          delay: 4000, // 4秒ごと
          disableOnInteraction: false, // 触った後も自動再生を続ける
        }}
        // レスポンシブ対応（スマホでは1件表示）
        breakpoints={{
          // 640px以上の場合
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          // 640px未満の場合
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
        }}
        className={styles.swiper}
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id} className={styles.slide}>
            <Link href={`/blog/${post.id}`}>
              {/* ここに記事のカードデザインを入れます。
                例：アイキャッチ画像
              */}
              {post.eyecatch && (
                <Image
                  src={post.eyecatch.url}
                  width={post.eyecatch.width}
                  height={post.eyecatch.height}
                  alt=""
                  className={styles.eyecatch}
                />
              )}
              <h3 className={styles.slideTitle}>{post.title}</h3>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}