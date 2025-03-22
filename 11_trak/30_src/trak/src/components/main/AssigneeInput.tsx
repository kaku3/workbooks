import { useEffect, useRef, useState } from 'react';
import styles from './TableView.module.css';
import { User } from '@/types';
import { getUserColor, getTextColor } from '@/lib/utils/colors';

interface AssigneeInputProps {
  value: string[];
  users: User[];
  onUpdate: (value: string[]) => void;
  onClose: () => void;
}

export default function AssigneeInput({
  value,
  users,
  onUpdate,
  onClose
}: AssigneeInputProps): JSX.Element {
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // ユーザー検索
  useEffect(() => {
    const searchLower = searchText.toLowerCase();
    const filtered = users.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(searchLower);
      const emailMatch = user.email.toLowerCase().includes(searchLower);
      return nameMatch || emailMatch;
    });
    setFilteredUsers(filtered);
    setShowSearch(searchText !== '');
  }, [searchText, users]);

  // 検索結果の外側クリックで閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.assigneeSearch} ref={searchRef}>
      <input
        type="text"
        value={searchText}
        className={styles.searchInput}
        onChange={(e) => {
          setSearchText(e.target.value);
          setShowSearch(true);
        }}
        onFocus={() => setShowSearch(true)}
        placeholder="担当者を検索... (ESCで閉じる)"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
            setSearchText('');
          }
        }}
        autoFocus
      />
      <button
        type="button"
        className={styles.closeButton}
        onClick={() => {
          onClose();
          setSearchText('');
        }}
      >
        ×
      </button>
      {showSearch && filteredUsers.length > 0 && (
        <div className={styles.searchResults}>
          {filteredUsers.map(user => (
            <div
              key={user.email}
              className={styles.searchItem}
              onMouseDown={() => {
                if (!value.includes(user.email)) {
                  onUpdate([...value, user.email]);
                }
                setSearchText('');
              }}
            >
              <span className={styles.searchItemName}>{user.name}</span>
              <span className={styles.searchItemEmail}>{user.email}</span>
            </div>
          ))}
        </div>
      )}

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
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(value.filter(a => a !== email));
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
