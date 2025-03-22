import { useState, useRef, useEffect } from 'react';
import styles from '../TableView.module.css';
import { getUserColor, getTextColor } from '@/lib/utils/colors';
import type { User } from '@/types';

interface AssigneeCellProps {
  value: string[];
  users: User[];
  onUpdate?: (value: string[]) => void;
}

export default function AssigneeCell({
  value,
  users,
  onUpdate
}: AssigneeCellProps): JSX.Element {
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // 編集モードに入ったらドロップダウンを表示
  useEffect(() => {
    if (onUpdate) {
      setShowDropdown(true);
      setFilteredUsers(users);
    }
  }, [onUpdate, users]);

  // ユーザー検索
  useEffect(() => {
    if (onUpdate && searchText !== '') {
      const searchLower = searchText.toLowerCase();
      const filtered = users.filter(user => {
        const nameMatch = user.name.toLowerCase().includes(searchLower);
        const emailMatch = user.email.toLowerCase().includes(searchLower);
        return nameMatch || emailMatch;
      });
      setFilteredUsers(filtered);
    } else if (onUpdate) {
      setFilteredUsers(users);
    }
  }, [searchText, users, onUpdate]);

  // 編集モード終了のためのクリックイベント
  useEffect(() => {
    if (onUpdate) {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setShowDropdown(false);
          setSearchText('');
          // Trigger update to exit edit mode
          onUpdate(value);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [onUpdate]);

  // 編集不可の場合は表示のみ
  if (!onUpdate) {
    if (value.length === 0) {
      return <>-</>;
    }

    return (
      <div className={styles.assigneeTags}>
        {value.map(email => {
          const user = users.find(u => u.email === email);
          return (
            <div
              key={email}
              className={styles.assigneeCell}
              style={{
                backgroundColor: getUserColor(user?.id || ''),
                color: getTextColor(getUserColor(user?.id || ''))
              }}
            >
              <span className={styles.assigneeName}>
                {user?.name || email}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  const handleRemove = (email: string) => {
    const newValue = value.filter(v => v !== email);
    if (newValue.length !== value.length) {
      onUpdate(newValue);
    }
  };

  const handleAdd = (email: string) => {
    if (!value.includes(email)) {
      onUpdate([...value, email]);
    }
    setSearchText('');
  };

  // 編集可能な場合は検索インターフェースを表示
  return (
    <div className={`${styles.editableCell} ${styles.editingCell}`}>
      <div className={styles.assigneeSearch} ref={searchRef}>
        <div className={styles.assigneeTags}>
          {value.map(email => {
            const user = users.find(u => u.email === email);
            return (
              <div
                key={email}
                className={styles.assigneeCell}
                style={{
                  backgroundColor: getUserColor(user?.id || ''),
                  color: getTextColor(getUserColor(user?.id || ''))
                }}
              >
                <span className={styles.assigneeName}>
                  {user?.name || email}
                </span>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove(email)}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
        <input
          type="text"
          value={searchText}
          className={styles.searchInput}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="担当者を検索..."
          autoFocus
        />
        {showDropdown && filteredUsers.length > 0 && (
          <div className={styles.searchResults}>
            {filteredUsers.map(user => (
              <div
                key={user.email}
                className={styles.searchItem}
                onClick={() => handleAdd(user.email)}
              >
                <span className={styles.searchItemName}>{user.name}</span>
                <span className={styles.searchItemEmail}>{user.email}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
