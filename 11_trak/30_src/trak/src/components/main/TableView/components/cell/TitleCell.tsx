import styles from './styles/TitleCell.module.css';
import { useEffect, useState } from 'react';
import { useTags } from '../../../TagsContext';
import { Tag } from '@/types';

interface TitleCellProps {
  setEditingCell?: (value: null) => void;
  value: string;
  tags?: string[];
  onUpdate?: (value: string) => void;
  onUpdateTags?: (tags: string[]) => void;
}

export default function TitleCell({
  value,
  tags = [],
  onUpdate,
  onUpdateTags,
  setEditingCell
}: TitleCellProps): JSX.Element {
  const [editValue, setEditValue] = useState(value);
  const [isTagEditing, setIsTagEditing] = useState(false);
  const { tags: availableTags, addTag } = useTags();
  const [tagInput, setTagInput] = useState('');
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  // 編集中のタグを管理
  const [editingTags, setEditingTags] = useState<string[]>(tags);

  // 親コンポーネントからの新しい値を反映
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  // タグの更新を反映
  useEffect(() => {
    setEditingTags(tags);
  }, [tags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.tagSuggestions}`) && 
          !target.closest(`.${styles.tagInput}`) &&
          !target.closest(`.${styles.tagList}`)) {
        setIsTagEditing(false);
        setFilteredTags([]);
      }
    };

    if (isTagEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTagEditing]);

  // タイトル編集時のクリックアウトハンドラー
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isTagRelated = target.closest(`.${styles.tagSuggestions}`) || 
                          target.closest(`.${styles.tagInput}`) || 
                          target.closest(`.${styles.tagList}`) ||
                          target.closest(`.${styles.tagAction}`);
      const isEditing = target.closest(`.${styles.editableCell}`);

      // タグ関連の要素またはセル編集中のクリックは無視
      if (isTagRelated || isEditing) {
        return;
      }

      // タグや編集セル以外のクリックで更新して閉じる
      onUpdate?.(editValue);
      // タグの変更も確定
      if (onUpdateTags && !arraysEqual(editingTags, tags)) {
        onUpdateTags(editingTags);
      }
      setTimeout(() => {
        setIsTagEditing(false);
        setTagInput('');
        setFilteredTags([]);
        setEditingCell?.(null);
      }, 0);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editValue, value, onUpdate, setEditingCell, editingTags, tags]);

  // 配列の比較ヘルパー関数
  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  };

  const showTagSuggestions = () => {
    setFilteredTags(availableTags);
  };

  const handleTagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateTags) {
      setIsTagEditing(true);
      showTagSuggestions();
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    if (value.trim()) {
      const filtered = availableTags.filter(tag =>
        tag.name.toLowerCase().includes(value.toLowerCase()) ||
        tag.id.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(availableTags);
    }
  };

  const handleTagSelect = async (selectedTag: typeof availableTags[0]) => {
    if (!onUpdateTags) return;
    if (!editingTags.includes(selectedTag.id)) {
      setEditingTags([...editingTags, selectedTag.id]);
    }
    setTagInput('');
    setFilteredTags([]);
    // Keep tag editing mode open
    showTagSuggestions();
  };

  const handleRemoveTag = (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    if (!onUpdateTags) return;
    setEditingTags(editingTags.filter(id => id !== tagId));
    // Keep tag editing mode open after removing a tag
    setIsTagEditing(true);
    showTagSuggestions();
  };

  const handleNewTag = async () => {
    if (!onUpdateTags || !tagInput.trim()) return;

    const inputValue = tagInput.trim();
    const existingTag = availableTags.find(
      tag => tag.name.toLowerCase() === inputValue.toLowerCase()
    );

    if (existingTag) {
      if (!editingTags.includes(existingTag.id)) {
        setEditingTags([...editingTags, existingTag.id]);
      }
      setTagInput('');
      setFilteredTags([]);
      showTagSuggestions();
      return;
    }

    const newTag = await addTag({
      name: inputValue,
      color: '#6366f1' // デフォルトカラー
    });

    if (newTag) {
      setEditingTags([...editingTags, newTag.id]);
      setTagInput('');
      setFilteredTags([]);
      showTagSuggestions();
    }
  };

  // 編集不可の場合は表示のみ
  if (!onUpdate) {
    return (
      <div className={styles.titleContainer}>
        {tags.length > 0 && (
          <div className={styles.tagList}>
            {tags.map(tagId => {
              const tag = availableTags.find(t => t.id === tagId);
              if (!tag) return null;
              return (
                <span
                  key={tag.id}
                  className={styles.tag}
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              );
            })}
          </div>
        )}
        <span>{value}</span>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(editValue);
    if (onUpdateTags && !arraysEqual(editingTags, tags)) {
      onUpdateTags(editingTags);
    }
    setIsTagEditing(false);
    setTagInput('');
    setFilteredTags([]);
    setEditingCell?.(null);
  };

  // 編集可能な場合は入力フィールドを表示
  return (
    <div className={`${styles.editableCell} ${styles.editingCell}`} onClick={(e) => e.stopPropagation()}>
      <div className={styles.tagList}>
        {editingTags.map(tagId => {
          const tag = availableTags.find(t => t.id === tagId);
          if (!tag) return null;
          return (
            <span
              key={tag.id}
              className={styles.tag}
              style={{ backgroundColor: tag.color }}
              onClick={handleTagClick}
            >
              {tag.name}
              <span 
                className={`${styles.removeButton} ${styles.tagAction}`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleRemoveTag(tag.id, e);
                }}
              >
                ×
              </span>
            </span>
          );
        })}
        {isTagEditing && (
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className={styles.tagInput}
              style={{ width: 'auto', minWidth: '100px' }}
              placeholder="タグを入力..."
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNewTag();
                }
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            {filteredTags.length > 0 && (
              <div className={styles.tagSuggestions}>
                {filteredTags.map((tag: Tag) => (
                  <div
                    key={tag.id}
                    className={styles.tagSuggestion}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTagSelect(tag);
                    }}
                    tabIndex={0}
                  >
                    <span 
                      className={styles.tagSampleColor}
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name} ({tag.id})
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!isTagEditing && onUpdateTags && (
          <button
            className={styles.tag}
            style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
            onClick={(e) => {
              e.stopPropagation();
              setIsTagEditing(true);
              showTagSuggestions();
            }}
          >
            +
          </button>
        )}
      </div>
      <input
        type="text"
        value={editValue}
        className={styles.editInput}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isTagEditing) {
            handleSave(e as unknown as React.MouseEvent);
          }
        }}
        onClick={(e) => e.stopPropagation()}
        autoFocus
      />
    </div>
  );
}
