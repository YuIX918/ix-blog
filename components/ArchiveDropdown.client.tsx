// components/ArchiveDropdown.client.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/PostList.module.css';
import { FiChevronDown } from 'react-icons/fi';

type Archive = {
  yearMonth: string;
  label: string;
  count: number;
};

type Props = {
  archives: Archive[];
};

export default function ArchiveDropdown({ archives }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (yearMonth: string) => {
    setIsOpen(false);
    // 遷移先は /archive/YYYY/MM 形式にしている（サーバー側ルート）
    const [y, m] = yearMonth.split('-');
    router.push(`/archive/${y}/${m}`);
  };

  return (
    <div className={styles.sortMenuContainer} ref={dropdownRef}>
      <button
        className={styles.sortButton}
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '100%' }}
      >
        <span>月を選択...</span>
        <FiChevronDown size={18} style={{ marginLeft: 'auto' }} />
      </button>

      {isOpen && (
        <div className={styles.sortMenu} style={{ width: '100%', left: 0 }}>
          {archives.map((archive) => (
            <button
              key={archive.yearMonth}
              className={styles.sortMenuItem}
              onClick={() => handleSelect(archive.yearMonth)}
            >
              <span>{archive.label} ({archive.count})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}